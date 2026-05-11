import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { updateUserPlan } from '@/lib/user-store'

export async function POST(request: NextRequest) {
  try {
    const { plan, githubId } = await request.json()

    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    if (!githubId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // New pricing thresholds ($21 for Starter, $30 for Pro)
    const COSTS = {
      starter: 2100, // $21 in cents
      pro: 3000,    // $30 in cents
    }

    const cost = COSTS[plan as keyof typeof COSTS]
    const razorpaySubscriptionId = `reward_${plan}_${Date.now()}`

    const result = await sql.begin(async (tx: any) => {
      // 1. Check if user has enough credit
      const affiliateResult = await tx`
        SELECT id, accumulated_credit FROM affiliate_users 
        WHERE github_id = ${githubId}
        FOR UPDATE
      `

      if (affiliateResult.length === 0) {
        throw new Error('Affiliate profile not found')
      }

      const currentCredit = affiliateResult[0].accumulated_credit || 0

      if (currentCredit < cost) {
        throw new Error(`Insufficient credit. You need $${(cost / 100).toFixed(0)} to claim this plan.`)
      }

      // 2. Subtract credit
      await tx`
        UPDATE affiliate_users
        SET accumulated_credit = accumulated_credit - ${cost}
        WHERE id = ${affiliateResult[0].id}
      `

      // 3. Update user plan with subscription dates
      await tx`
        UPDATE users
        SET plan = ${plan},
            razorpay_subscription_id = ${razorpaySubscriptionId},
            plan_started_at = NOW(),
            plan_expires_at = NOW() + INTERVAL '30 days',
            updated_at = NOW()
        WHERE github_id = ${githubId}
      `

      // 4. Log the claim as a revenue event (zero amount but with plan)
      await tx`
        INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata)
        VALUES (
          'claim',
          0,
          'USD',
          ${githubId},
          ${plan},
          ${sql.json({ method: 'affiliate_claim', creditUsed: cost, rewardSubscriptionId: razorpaySubscriptionId })}
        )
      `

      return { success: true, newCredit: currentCredit - cost }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error claiming affiliate reward:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to claim reward' },
      { status: 500 }
    )
  }
}
