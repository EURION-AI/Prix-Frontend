import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { sql } from '@/lib/db'
import { PRICING } from '@/lib/pricing'
import { getUserSubscriptionId } from '@/lib/user-store'
import { getAuthenticatedUser } from '@/lib/auth'

/**
 * Initialize Razorpay Client
 */
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
 * Helper to resolve internal plan name (e.g. 'pro') to a Razorpay Plan ID
 */
async function getRazorpayPlanId(razorpay: Razorpay, plan: 'starter' | 'pro', region: string): Promise<string | null> {
  const planKey = `${plan}_${region}`
  
  // Check cache first
  const cached = await sql`
    SELECT razorpay_plan_id FROM razorpay_plans WHERE internal_plan_id = ${planKey}
  `

  if (cached.length > 0) {
    return cached[0].razorpay_plan_id
  }

  // If not in cache, we should ideally fetch or create it. 
  // For this implementation, we assume plans are created during checkout.
  // But we'll add a fallback creation logic similar to checkout route if needed.
  const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
  const planPricing = regionalPricing[plan]

  if (!planPricing) return null

  const planDisplayName = plan === 'starter' ? 'Starter' : 'Pro'
  const razorpayPlan = await (razorpay as any).plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: `Prix AI ${planDisplayName} (${region})`,
      amount: planPricing.price,
      currency: planPricing.currency,
      description: `Monthly subscription for Prix AI ${planDisplayName} plan`,
    },
  })

  // Cache it
  await sql`
    INSERT INTO razorpay_plans (internal_plan_id, razorpay_plan_id, amount, currency)
    VALUES (${planKey}, ${razorpayPlan.id}, ${planPricing.price}, ${planPricing.currency})
    ON CONFLICT (internal_plan_id) DO UPDATE SET
      razorpay_plan_id = EXCLUDED.razorpay_plan_id
  `

  return razorpayPlan.id
}

/**
 * POST /api/subscription/upgrade
 * Implements mid-cycle subscription upgrade with native Razorpay proration.
 */
export async function POST(request: Request) {
  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const githubId = authed.githubId

    // 2. Parse Request
    const { newPlanId, region = 'US' } = await request.json()
    
    if (newPlanId !== 'pro') {
      return NextResponse.json({ error: 'Only upgrades to Pro plan are supported' }, { status: 400 })
    }

    // 3. Get Existing Subscription
    const subscriptionId = await getUserSubscriptionId(githubId)

    const razorpay = getRazorpayClient()
    if (!razorpay) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    // 4. Resolve Razorpay Plan ID for the target tier
    const razorpayPlanId = await getRazorpayPlanId(razorpay, newPlanId, region)
    if (!razorpayPlanId) {
      return NextResponse.json({ error: 'Target plan not found' }, { status: 404 })
    }

    // If no existing subscription, create a new one instead of rejecting
    if (!subscriptionId || subscriptionId.startsWith('legacy_')) {
      console.log(`[UPGRADE] No active subscription for user ${githubId}, creating new Pro subscription`)
      const newSubscription = await (razorpay as any).subscriptions.create({
        plan_id: razorpayPlanId,
        total_count: 120,
        customer_notify: 1,
        notes: {
          plan: newPlanId,
          userId: String(githubId),
          region,
        },
      })

      return NextResponse.json({
        subscriptionId: newSubscription.id,
        key: process.env.RAZORPAY_KEY_ID,
      })
    }

    // 5. Update Existing Subscription on Razorpay
    try {
      const updatedSubscription = await (razorpay as any).subscriptions.update(subscriptionId, {
        plan_id: razorpayPlanId,
        schedule_change_at: 'now',
        customer_notify: 1,
      })

      console.log(`[UPGRADE] Successfully upgraded ${subscriptionId} to ${newPlanId}`)

      return NextResponse.json({
        success: true,
        message: 'Subscription upgraded successfully. Prorated difference will be charged.',
        subscriptionId: updatedSubscription.id,
      })

    } catch (razorpayError: any) {
      const errorMsg = razorpayError.description || razorpayError.message || ''
      
      if (errorMsg.toLowerCase().includes('amount') || errorMsg.toLowerCase().includes('proration')) {
        return NextResponse.json({
          error: 'Proration limit reached',
          details: 'The remaining time in your current cycle results in a difference too small to charge. You will be automatically moved to the new plan at the start of your next billing cycle.',
          code: 'PRORATION_AMOUNT_TOO_LOW'
        }, { status: 400 })
      }

      throw razorpayError
    }

  } catch (error: any) {
    console.error('[UPGRADE_ERROR]', error)
    return NextResponse.json({ 
      error: 'Failed to process upgrade', 
      details: error.message 
    }, { status: 500 })
  }
}
