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

    const razorpaySubscriptionId = `reward_${plan}_${Date.now()}`
    const cost = plan === 'starter' ? 2100 : 3000 // Keeping for logging metadata

    const result = await sql.begin(async (tx: any) => {
      // 1. Fetch current user state and affiliate stats
      const userResult = await tx`
        SELECT plan FROM users WHERE github_id = ${githubId} FOR UPDATE
      `
      
      const affiliateResult = await tx`
        SELECT id, paid_referral_count, reward_claimed FROM affiliate_users 
        WHERE github_id = ${githubId}
        FOR UPDATE
      `

      if (userResult.length === 0) throw new Error('User not found')
      if (affiliateResult.length === 0) throw new Error('Affiliate profile not found')

      // One-time claim check
      if (affiliateResult[0].reward_claimed) {
        throw new Error('You have already claimed your one-time affiliate reward. This benefit can only be used once per account.')
      }

      const currentPlan = userResult[0].plan || 'free'
      const currentPaidCount = affiliateResult[0].paid_referral_count || 0

      // Plan Hierarchy Weights
      const weights: Record<string, number> = { 'free': 0, 'starter': 1, 'pro': 2 }
      const currentWeight = weights[currentPlan] ?? 0
      const newWeight = weights[plan]

      // Downgrade/Same-tier Protection
      if (newWeight <= currentWeight) {
        throw new Error(`You are already on the ${currentPlan} plan or a higher tier. You cannot switch to ${plan}.`)
      }

      // Milestone validation
      if (plan === 'starter' && currentPaidCount < 2) {
        throw new Error('Insufficient referrals. You need at least 2 paid referrals to claim the Starter plan.')
      }

      if (plan === 'pro' && currentPaidCount < 3) {
        throw new Error('Insufficient referrals. You need at least 3 paid referrals to claim the Pro plan.')
      }

      // 3. Update user plan directly
      await tx`
        UPDATE users
        SET plan = ${plan},
            razorpay_subscription_id = ${razorpaySubscriptionId},
            plan_started_at = NOW(),
            plan_expires_at = NOW() + INTERVAL '30 days',
            updated_at = NOW()
        WHERE github_id = ${githubId}
      `

      // 4. Mark reward as claimed
      await tx`
        UPDATE affiliate_users
        SET reward_claimed = TRUE,
            reward_claimed_at = NOW()
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

      return { success: true, plan }
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
