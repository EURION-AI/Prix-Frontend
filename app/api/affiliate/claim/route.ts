import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import Razorpay from 'razorpay'
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
    
    const result = await sql.begin(async (tx: any) => {
      // 1. Fetch current user state and affiliate stats
      const userResult = await tx`
        SELECT plan, plan_expires_at, razorpay_subscription_id FROM users WHERE github_id = ${githubId} FOR UPDATE
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
        throw new Error('You have already claimed your one-time affiliate reward.')
      }

      const user = userResult[0]
      const currentPlan = user.plan || 'free'
      const currentPaidCount = affiliateResult[0].paid_referral_count || 0
      const activeSubscriptionId = user.razorpay_subscription_id

      // Plan Hierarchy Weights
      const weights: Record<string, number> = { 'free': 0, 'starter': 1, 'pro': 2 }
      const currentWeight = weights[currentPlan] ?? 0
      const newWeight = weights[plan]

      // Downgrade Protection (Legacy check - we now allow "Different plan" logic but keep weight check for UI consistency)
      if (newWeight <= currentWeight && activeSubscriptionId) {
        // If same tier, we extend. If lower tier, we queue. 
        // The user specifically wanted to block downgrades initially, 
        // but now wants "if on Pro and claims Starter, next month is Starter".
        // So we allow different weights now.
      }

      // Milestone validation
      if (plan === 'starter' && currentPaidCount < 2) {
        throw new Error('Insufficient referrals. You need at least 2 paid referrals to claim the Starter plan.')
      }

      if (plan === 'pro' && currentPaidCount < 3) {
        throw new Error('Insufficient referrals. You need at least 3 paid referrals to claim the Pro plan.')
      }

      // Handle Razorpay Cancellation if active
      if (activeSubscriptionId && !activeSubscriptionId.startsWith('reward_')) {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })
        
        try {
          await (razorpay as any).subscriptions.cancel(activeSubscriptionId, {
            cancel_at_cycle_end: true,
          })
        } catch (e) {
          console.error('Failed to cancel Razorpay sub:', e)
          // Continue anyway, we'll handle it on our end
        }
      }

      // Implementation of Stacking/Queuing Logic
      const isCurrentlyActive = user.plan !== 'free' && user.plan_expires_at && user.plan_expires_at > new Date()

      if (isCurrentlyActive) {
        if (plan === currentPlan) {
          // Case: Same Plan -> Extension
          await tx`
            UPDATE users
            SET plan_expires_at = plan_expires_at + INTERVAL '30 days',
                razorpay_subscription_id = NULL,
                updated_at = NOW()
            WHERE github_id = ${githubId}
          `
        } else {
          // Case: Different Plan -> Queue
          await tx`
            UPDATE users
            SET queued_plan = ${plan},
                razorpay_subscription_id = NULL,
                updated_at = NOW()
            WHERE github_id = ${githubId}
          `
        }
      } else {
        // Case: No Active Plan -> Immediate activation
        await tx`
          UPDATE users
          SET plan = ${plan},
              razorpay_subscription_id = ${razorpaySubscriptionId},
              plan_started_at = NOW(),
              plan_expires_at = NOW() + INTERVAL '30 days',
              updated_at = NOW()
          WHERE github_id = ${githubId}
        `
      }

      // 4. Mark reward as claimed
      await tx`
        UPDATE affiliate_users
        SET reward_claimed = TRUE,
            reward_claimed_at = NOW()
        WHERE github_id = ${githubId}
      `

      // Calculate the referral cost for logging
      const cost = plan === 'pro' ? 3 : 2

      // 4. Log the claim as a revenue event (zero amount but with plan)
      await tx`
        INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata)
        VALUES (
          'claim',
          0,
          'USD',
          ${githubId},
          ${plan},
          ${sql.json({ 
            method: 'affiliate_claim', 
            referralsUsed: cost, 
            rewardSubscriptionId: razorpaySubscriptionId 
          })}
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
