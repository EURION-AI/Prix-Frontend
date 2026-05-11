import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { rateLimit } from '@/lib/security'
import { validateCSRFToken, addCSRFTokenToResponse } from '@/lib/csrf'
import { PRICING } from '@/lib/pricing'
import { sql } from '@/lib/db'

type PlanKey = 'starter' | 'pro'

function getRazorpayClient(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

/**
 * Get or create a Razorpay Plan for a given region+tier combo.
 * Plans are cached in the razorpay_plans table to avoid re-creation.
 */
async function getOrCreateRazorpayPlan(
  razorpay: Razorpay,
  plan: PlanKey,
  region: string,
  amount: number,
  currency: string
): Promise<string> {
  const planKey = `${plan}_${region}`

  // Check cache first
  const cached = await sql`
    SELECT razorpay_plan_id FROM razorpay_plans WHERE plan_key = ${planKey}
  `

  if (cached.length > 0) {
    return cached[0].razorpay_plan_id
  }

  // Create on Razorpay
  const planDisplayName = plan === 'starter' ? 'Starter' : 'Pro'
  const razorpayPlan = await (razorpay as any).plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: `Prix AI ${planDisplayName} (${region})`,
      amount: amount,
      currency: currency,
      description: `Monthly subscription for Prix AI ${planDisplayName} plan`,
    },
  })

  // Cache it
  await sql`
    INSERT INTO razorpay_plans (plan_key, razorpay_plan_id, amount, currency)
    VALUES (${planKey}, ${razorpayPlan.id}, ${amount}, ${currency})
    ON CONFLICT (plan_key) DO UPDATE SET
      razorpay_plan_id = EXCLUDED.razorpay_plan_id
  `

  console.log(`Created Razorpay plan: ${planKey} -> ${razorpayPlan.id}`)
  return razorpayPlan.id
}

export async function GET(request: Request) {
  // Provide CSRF token for frontend
  const { response, token } = addCSRFTokenToResponse(NextResponse.json({}))
  return NextResponse.json({ csrfToken: token }, { 
    headers: response.headers,
  })
}

export async function POST(request: Request) {
  // Validate CSRF token for POST requests
  const csrfError = await validateCSRFToken(request)
  if (csrfError) return csrfError

  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const body = await request.json()
    const plan = body.plan
    const userId = body.userId
    const region = body.region || 'US'

    if (!plan || (plan !== 'starter' && plan !== 'pro')) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    // Get regional pricing from shared config
    const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
    const planPricing = regionalPricing[plan as PlanKey]

    if (!planPricing) {
      return NextResponse.json(
        { error: 'Invalid plan or region' },
        { status: 400 }
      )
    }

    const razorpay = getRazorpayClient()

    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    // Step 1: Get or create Razorpay Plan for this region+tier
    const razorpayPlanId = await getOrCreateRazorpayPlan(
      razorpay,
      plan,
      region,
      planPricing.price,
      planPricing.currency
    )

    // Step 2: Create a Subscription
    const subscription = await (razorpay as any).subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: 120, // Max 10 years
      customer_notify: 1,
      notes: {
        plan,
        userId: userId || 'anonymous',
        region,
      },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay subscription checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
