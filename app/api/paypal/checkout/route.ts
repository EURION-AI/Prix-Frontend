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

    const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
    const planPricing = regionalPricing[plan as PlanKey]

    if (!planPricing) {
      return NextResponse.json(
        { error: 'Invalid plan or region' },
        { status: 400 }
      )
    }

    const planKey = `${plan}_${region}`
    const planName = plan === 'starter' ? 'Starter' : 'Pro'

    const paypalPlan = await createPayPalPlan(
      planKey,
      planPricing.price,
      planPricing.currency,
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
