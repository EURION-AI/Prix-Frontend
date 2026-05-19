import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { rateLimit } from '@/lib/security'
import { validateCSRFToken, addCSRFTokenToResponse } from '@/lib/csrf'
import { getAuthenticatedUser } from '@/lib/auth'
import { PRICING, SUPPORTED_REGIONS } from '@/lib/pricing'
import { sql } from '@/lib/db'
import { getUserSubscriptionId, activateSubscription } from '@/lib/user-store'

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

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Razorpay API timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
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

  // Check cache first — only use cached plan if amount matches current pricing
  const cached = await sql`
    SELECT razorpay_plan_id, amount FROM razorpay_plans WHERE internal_plan_id = ${planKey}
  `

  if (cached.length > 0 && Number(cached[0].amount) === amount) {
    return cached[0].razorpay_plan_id
  }

  // Amount changed or no cache — create new plan on Razorpay
  const planDisplayName = plan === 'starter' ? 'Starter' : 'Pro'
  let razorpayPlan: any
  try {
    razorpayPlan = await withTimeout(
      (razorpay as any).plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `Prix AI ${planDisplayName} (${region})`,
          amount: amount,
          currency: currency,
          description: `Monthly subscription for Prix AI ${planDisplayName} plan`,
        },
      }),
      10000
    )
  } catch (createError: any) {
    console.error(`[RAZORPAY] Plan creation failed, falling back to cached plan if available:`, createError?.message || createError)
    if (cached.length > 0) {
      return cached[0].razorpay_plan_id
    }
    throw createError
  }

  // Upsert cache with new plan ID and amount
  await sql`
    INSERT INTO razorpay_plans (internal_plan_id, razorpay_plan_id, amount, currency)
    VALUES (${planKey}, ${razorpayPlan.id}, ${amount}, ${currency})
    ON CONFLICT (internal_plan_id) DO UPDATE SET
      razorpay_plan_id = EXCLUDED.razorpay_plan_id,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency
  `

  console.log(`Created Razorpay plan: ${planKey} -> ${razorpayPlan.id} (₹${(amount / 100).toFixed(0)})`)
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
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const userId = String(authed.githubId)

    const body = await request.json()
    const plan = body.plan
    const region = body.region || 'US'

    if (!plan || (plan !== 'starter' && plan !== 'pro')) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    if (!SUPPORTED_REGIONS.includes(region)) {
      return NextResponse.json(
        { error: `Unsupported region: ${region}. Supported: ${SUPPORTED_REGIONS.join(', ')}` },
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

    // Step 2: Check for existing subscription
    let currentSubId: string | null = null;
    if (userId && userId !== 'anonymous') {
      const githubId = parseInt(userId, 10);
      if (!isNaN(githubId)) {
        currentSubId = await getUserSubscriptionId(githubId);
      }
    }

    // Step 3: Update existing or Create new
    if (currentSubId && !currentSubId.startsWith('legacy_')) {
      console.log(`[CHECKOUT] Upgrading existing subscription ${currentSubId} to plan ${plan}`);

      try {
        const updatedSub = await withTimeout(
          (razorpay as any).subscriptions.update(currentSubId, {
            plan_id: razorpayPlanId,
            schedule_change_at: 'now',
            customer_notify: 1
          }),
          10000
        );

        if (userId && userId !== 'anonymous') {
          await activateSubscription(parseInt(userId, 10), plan, currentSubId);
        }

        return NextResponse.json({
          upgraded: true,
          subscriptionId: updatedSub.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
        });
      } catch (updateError: any) {
        console.error(`[CHECKOUT] Failed to update existing subscription ${currentSubId}, falling back to new subscription:`, updateError?.message || updateError);
        // Fall through to create a new subscription instead
      }
    }

    // Otherwise, create a new Subscription
    const subscription = await withTimeout(
      (razorpay as any).subscriptions.create({
        plan_id: razorpayPlanId,
        total_count: 120,
        customer_notify: 1,
        notes: {
          plan,
          userId: userId || 'anonymous',
          region,
        },
      }),
      15000
    )

    return NextResponse.json({
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('[RAZORPAY CHECKOUT] Error:', error)
    const message = error?.error?.description || error?.description || error?.message || 'Failed to create subscription'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
