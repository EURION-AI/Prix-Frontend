import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security'
import { validateCSRFToken, addCSRFTokenToResponse } from '@/lib/csrf'
import { getAuthenticatedUser } from '@/lib/auth'
import { PRICING } from '@/lib/pricing'
import { createPayPalPlan, createPayPalSubscription } from '@/lib/paypal'
import { getUserSubscriptionId } from '@/lib/user-store'

type PlanKey = 'starter' | 'pro'

export async function GET() {
  const { response, token } = addCSRFTokenToResponse(NextResponse.json({}))
  return NextResponse.json({ csrfToken: token }, {
    headers: response.headers,
  })
}

export async function POST(request: Request) {
  const csrfError = await validateCSRFToken(request)
  if (csrfError) return csrfError

  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, region = 'US', returnUrl, cancelUrl } = body

    if (!plan || (plan !== 'starter' && plan !== 'pro')) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    const SUPPORTED_PAYPAL_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'MXN']

    // Use region's pricing, but fall back to US pricing if currency isn't supported by PayPal
    const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
    let planPricing = regionalPricing[plan as PlanKey]

    if (!planPricing) {
      return NextResponse.json(
        { error: 'Invalid plan or region' },
        { status: 400 }
      )
    }

    // Fall back to US pricing if the region's currency isn't supported by PayPal
    let paypalRegion = region
    let paypalPrice = planPricing.price
    let paypalCurrency = planPricing.currency

    if (!SUPPORTED_PAYPAL_CURRENCIES.includes(planPricing.currency)) {
      const usPricing = PRICING.US[plan as PlanKey]
      paypalRegion = 'US'
      paypalPrice = usPricing.price
      paypalCurrency = usPricing.currency
      console.log(`[PAYPAL] Currency ${planPricing.currency} not supported, falling back to USD for plan ${plan}`)
    }

    const planKey = `${plan}_paypal_${paypalRegion}`
    const planName = plan === 'starter' ? 'Starter' : 'Pro'

    const paypalPlan = await createPayPalPlan(
      planKey,
      paypalPrice,
      paypalCurrency,
      planName
    )

    const defaultReturnUrl = `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?plan=${plan}`
    const defaultCancelUrl = `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel?plan=${plan}`

    const subscription = await createPayPalSubscription(
      paypalPlan.id,
      returnUrl || defaultReturnUrl,
      cancelUrl || defaultCancelUrl,
      { plan, userId: String(authed.githubId), region }
    )

    const approvalUrl = subscription.links?.find((l: any) => l.rel === 'approve')?.href
    console.log(`[PAYPAL] Subscription created: ${subscription.id}, approval: ${approvalUrl}`)

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      links: subscription.links,
    })
  } catch (error: any) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
