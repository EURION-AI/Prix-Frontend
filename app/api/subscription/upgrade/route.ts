import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { sql } from '@/lib/db'
import { PRICING } from '@/lib/pricing'
import { getUserSubscriptionId } from '@/lib/user-store'
import { getAuthenticatedUser } from '@/lib/auth'

function getRazorpayClient(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

async function getRazorpayPlanId(razorpay: Razorpay, plan: 'starter' | 'pro', region: string): Promise<string | null> {
  const planKey = `${plan}_${region}`
  
  const cached = await sql`
    SELECT razorpay_plan_id FROM razorpay_plans WHERE internal_plan_id = ${planKey}
  `

  if (cached.length > 0) {
    return cached[0].razorpay_plan_id
  }

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

  await sql`
    INSERT INTO razorpay_plans (internal_plan_id, razorpay_plan_id, amount, currency)
    VALUES (${planKey}, ${razorpayPlan.id}, ${planPricing.price}, ${planPricing.currency})
    ON CONFLICT (internal_plan_id) DO UPDATE SET
      razorpay_plan_id = EXCLUDED.razorpay_plan_id
  `

  return razorpayPlan.id
}

export async function POST(request: Request) {
  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const githubId = authed.githubId

    const { newPlanId, region = 'US' } = await request.json()
    
    if (newPlanId !== 'pro') {
      return NextResponse.json({ error: 'Only upgrades to Pro plan are supported' }, { status: 400 })
    }

    // Get user's current subscription provider
    const user = await sql`
      SELECT subscription_provider FROM users WHERE github_id = ${githubId}
    `
    const provider = user[0]?.subscription_provider || 'razorpay'

    // Handle PayPal upgrade
    if (provider === 'paypal') {
      const { createPayPalPlan } = await import('@/lib/paypal')
      const planKey = `${newPlanId}_${region}`
      const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
      type PlanKey = 'starter' | 'pro'
      const planPricing = regionalPricing[newPlanId as PlanKey]
      const planName = newPlanId === 'starter' ? 'Starter' : 'Pro'

      await createPayPalPlan(planKey, planPricing.price, planPricing.currency, planName)

      await sql`
        UPDATE users
        SET plan = ${newPlanId},
            usage_limit_cap = 1000,
            updated_at = NOW()
        WHERE github_id = ${githubId}
      `

      return NextResponse.json({
        success: true,
        message: 'Plan upgraded successfully. The new price will apply from your next billing cycle.',
      })
    }

    // Handle Razorpay upgrade (existing logic)
    const subscriptionId = await getUserSubscriptionId(githubId)

    const razorpay = getRazorpayClient()
    if (!razorpay) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    const razorpayPlanId = await getRazorpayPlanId(razorpay, newPlanId, region)
    if (!razorpayPlanId) {
      return NextResponse.json({ error: 'Target plan not found' }, { status: 404 })
    }

    if (!subscriptionId || subscriptionId.startsWith('legacy_') || subscriptionId.startsWith('reward_')) {
      console.log(`[UPGRADE] No active subscription for user ${githubId}, creating new Pro subscription.`)
      try {
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
      } catch (createErr: any) {
        console.error('[UPGRADE] Razorpay subscription creation failed:', createErr)
        return NextResponse.json({
          error: 'Failed to create subscription',
          details: createErr.description || createErr.message || 'Unknown Razorpay error',
        }, { status: 500 })
      }
    }

    try {
      const updatedSubscription = await (razorpay as any).subscriptions.update(subscriptionId, {
        plan_id: razorpayPlanId,
        schedule_change_at: 'now',
        customer_notify: 1,
      })

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
