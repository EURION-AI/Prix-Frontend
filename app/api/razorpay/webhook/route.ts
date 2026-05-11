import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { activateSubscription, extendSubscription, cancelUserSubscription, expireOverduePlans } from '@/lib/user-store'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  try {
    const eventType = event.event
    console.log(`[WEBHOOK] Received event: ${eventType}`)

    switch (eventType) {
      // ── Initial subscription authentication success ──
      case 'subscription.authenticated': {
        const subscription = event.payload.subscription?.entity
        if (!subscription) break

        const notes = subscription.notes || {}
        const plan = notes.plan
        const userId = notes.userId

        if (userId && userId !== 'anonymous' && plan) {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await activateSubscription(githubId, plan, subscription.id)
            console.log(`[WEBHOOK] Subscription authenticated for user ${githubId}, plan: ${plan}`)
          }
        }
        break
      }

      // ── Monthly recurring charge succeeded ──
      case 'subscription.charged': {
        const subscription = event.payload.subscription?.entity
        const payment = event.payload.payment?.entity
        if (!subscription) break

        const notes = subscription.notes || {}
        const userId = notes.userId
        const plan = notes.plan

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            // Extend their plan by 30 days
            await extendSubscription(githubId)
            console.log(`[WEBHOOK] Subscription renewed for user ${githubId}`)

            // Log recurring revenue event
            try {
              await sql`
                INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
                VALUES (
                  'subscription_renewed',
                  ${payment?.amount || 0},
                  ${payment?.currency || 'INR'},
                  ${githubId},
                  ${plan || 'unknown'},
                  ${sql.json({
                    subscriptionId: subscription.id,
                    paymentId: payment?.id,
                    method: 'razorpay_subscription'
                  })},
                  NOW()
                )
              `
            } catch (e) {
              console.error('[WEBHOOK] Failed to log renewal revenue event:', e)
            }
          }
        }
        break
      }

      // ── Payment pending / retry ──
      case 'subscription.pending': {
        const subscription = event.payload.subscription?.entity
        console.log(`[WEBHOOK] Subscription pending (payment retry): ${subscription?.id}`)
        // No action needed — Razorpay will retry. User keeps access during grace.
        break
      }

      // ── All payment retries failed — downgrade user ──
      case 'subscription.halted': {
        const subscription = event.payload.subscription?.entity
        if (!subscription) break

        const notes = subscription.notes || {}
        const userId = notes.userId

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await cancelUserSubscription(githubId)
            console.log(`[WEBHOOK] Subscription halted for user ${githubId} — will expire at plan_expires_at`)

            try {
              await sql`
                INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
                VALUES (
                  'subscription_halted',
                  0,
                  'INR',
                  ${githubId},
                  ${notes.plan || 'unknown'},
                  ${sql.json({ subscriptionId: subscription.id, reason: 'payment_failed' })},
                  NOW()
                )
              `
            } catch (e) {
              console.error('[WEBHOOK] Failed to log halted event:', e)
            }
          }
        }
        break
      }

      // ── User cancelled subscription ──
      case 'subscription.cancelled': {
        const subscription = event.payload.subscription?.entity
        if (!subscription) break

        const notes = subscription.notes || {}
        const userId = notes.userId

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            // Clear subscription ID but keep access until plan_expires_at
            await cancelUserSubscription(githubId)
            console.log(`[WEBHOOK] Subscription cancelled for user ${githubId} — access continues until expiry`)

            try {
              await sql`
                INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
                VALUES (
                  'subscription_cancelled',
                  0,
                  'INR',
                  ${githubId},
                  ${notes.plan || 'unknown'},
                  ${sql.json({ subscriptionId: subscription.id })},
                  NOW()
                )
              `
            } catch (e) {
              console.error('[WEBHOOK] Failed to log cancellation event:', e)
            }
          }
        }
        break
      }

      // ── Subscription completed (total_count reached) ──
      case 'subscription.completed': {
        const subscription = event.payload.subscription?.entity
        if (!subscription) break

        const notes = subscription.notes || {}
        const userId = notes.userId

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await cancelUserSubscription(githubId)
            console.log(`[WEBHOOK] Subscription completed for user ${githubId}`)
          }
        }
        break
      }

      // ── Legacy: one-time payment captured (backward compat) ──
      case 'payment.captured': {
        const payment = event.payload.payment?.entity
        if (!payment) break

        const notes = payment.notes || {}
        const plan = notes.plan
        const userId = notes.userId

        if (userId && userId !== 'anonymous' && plan) {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            // Legacy: use activateSubscription without a real subscription ID
            await activateSubscription(githubId, plan, `legacy_${payment.id}`)
            console.log(`[WEBHOOK] Legacy payment captured for user ${githubId}, plan: ${plan}`)
          }
        }
        break
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${eventType}`)
    }

    // Opportunistically expire overdue plans
    try {
      const expired = await expireOverduePlans()
      if (expired > 0) {
        console.log(`[WEBHOOK] Expired ${expired} overdue plans`)
      }
    } catch (e) {
      console.error('[WEBHOOK] Failed to expire overdue plans:', e)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
