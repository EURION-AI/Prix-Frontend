import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { sql } from '@/lib/db'
import { PRICING, UPGRADE_PRICE_CENTS } from '@/lib/pricing'
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
      const { createPayPalPlan, createPayPalSubscription } = await import('@/lib/paypal')
      const planKey = `${newPlanId}_paypal_${region}`
      const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
      type PlanKey = 'starter' | 'pro'
      const planPricing = regionalPricing[newPlanId as PlanKey]
      const planName = newPlanId === 'starter' ? 'Starter' : 'Pro'

      const upgradeCents = UPGRADE_PRICE_CENTS[region] || 299
      const upgradeCurrency: Record<string, string> = { IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR' }
      const currency = upgradeCurrency[region] || 'USD'

      const upgradePlanKey = `${newPlanId}_paypal_upgrade_${region}`
      const paypalPlan = await createPayPalPlan(upgradePlanKey, upgradeCents, currency, `${planName} Upgrade`)

      const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const returnUrl = `${origin}/checkout/success?plan=${newPlanId}`
      const cancelUrl = `${origin}/checkout/cancel?plan=${newPlanId}`

      const subscription = await createPayPalSubscription(
        paypalPlan.id,
        returnUrl,
        cancelUrl,
        { plan: newPlanId, userId: String(githubId), region, upgrade: 'true' }
      )

      console.log(`[UPGRADE_PAYPAL] Subscription created: ${subscription.id}`)

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        links: subscription.links,
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

    // Try to update the existing subscription (prorated charge)
    if (subscriptionId && !subscriptionId.startsWith('legacy_') && !subscriptionId.startsWith('reward_')) {
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
        const description = razorpayError.error?.description || razorpayError.description || ''
        const message = razorpayError.error?.message || razorpayError.message || ''
        const errorMsg = description || message
        console.error(`[UPGRADE] Subscription update failed:`, JSON.stringify(razorpayError))

        if (errorMsg.toLowerCase().includes('amount') || errorMsg.toLowerCase().includes('proration')) {
          return NextResponse.json({
            error: 'Proration limit reached',
            details: 'The remaining time in your current cycle results in a difference too small to charge. You will be automatically moved to the new plan at the start of your next billing cycle.',
            code: 'PRORATION_AMOUNT_TOO_LOW'
          }, { status: 400 })
        }

        // Fall through to create a new subscription at the upgrade price below
        console.warn(`[UPGRADE] Subscription update failed, falling back to new upgrade sub: ${errorMsg}`)
      }
    }

    // User has no active subscription — create a new one at the upgrade price
    // (legacy, reward, or new user upgrading directly)
    const upgradeCents = UPGRADE_PRICE_CENTS[region] || 299
    const upgradeCurrency: Record<string, string> = { IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR' }
    const currency = upgradeCurrency[region] || 'USD'
    console.log(`[UPGRADE] Creating new Pro subscription for user ${githubId} at upgrade price ${upgradeCents} ${currency}`)

    try {
      const upgradePlan = await (razorpay as any).plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `Prix AI Pro Upgrade (${region})`,
          amount: upgradeCents,
          currency,
          description: 'One-time upgrade from Starter to Pro',
        },
      })

      const newSubscription = await (razorpay as any).subscriptions.create({
        plan_id: upgradePlan.id,
        total_count: 1,
        customer_notify: 1,
        notes: {
          plan: newPlanId,
          userId: String(githubId),
          region,
          upgrade: 'true',
        },
      })
      return NextResponse.json({
        subscriptionId: newSubscription.id,
        key: process.env.RAZORPAY_KEY_ID,
      })
    } catch (createErr: any) {
      console.error('[UPGRADE] Razorpay upgrade subscription creation failed:', createErr)
      return NextResponse.json({
        error: 'Failed to create upgrade subscription',
        details: createErr.description || createErr.message || 'Unknown Razorpay error',
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('[UPGRADE_ERROR]', error)
    return NextResponse.json({ 
      error: 'Failed to process upgrade', 
      details: error.message 
    }, { status: 500 })
  }
}
