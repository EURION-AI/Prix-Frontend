import { NextResponse } from 'next/server'
import {
  activateSubscription,
  extendSubscription,
  cancelUserSubscription,
  expireOverduePlans,
  getUserByGithubId,
} from '@/lib/user-store'
import { sql } from '@/lib/db'
import { verifyPayPalWebhookSignature, getPayPalSubscriptionDetails } from '@/lib/paypal'

export async function POST(request: Request) {
  const body = await request.text()
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })

  const isValid = await verifyPayPalWebhookSignature(headers, body)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const eventId = event.id

  const alreadyProcessed = await sql`
    SELECT 1 FROM processed_webhooks WHERE event_id = ${eventId}
  `
  if (alreadyProcessed.length > 0) {
    console.log(`[PAYPAL_WEBHOOK] Skipping already-processed event: ${eventId}`)
    return NextResponse.json({ received: true })
  }

  try {
    // Record as processed BEFORE handling to prevent double-processing on crash/retry
    try {
      await sql`
        INSERT INTO processed_webhooks (event_id) VALUES (${eventId})
        ON CONFLICT (event_id) DO NOTHING
      `
    } catch (e) {
      console.error('[PAYPAL_WEBHOOK] Failed to record processed event:', e)
    }

    const eventType = event.event_type
    console.log(`[PAYPAL_WEBHOOK] Received event: ${eventType}`)

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const resource = event.resource
        if (!resource) break

        const customId = resource.custom_id
        let parsedNotes: Record<string, string> = {}
        try {
          parsedNotes = customId ? JSON.parse(customId) : {}
        } catch {}

        const userId = parsedNotes.userId || resource.custom_id
        const plan = parsedNotes.plan || 'starter'

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await activateSubscription(githubId, plan, resource.id, 'paypal')
            console.log(`[PAYPAL_WEBHOOK] Subscription activated for user ${githubId}, plan: ${plan}`)
          }
        }
        break
      }

      case 'PAYMENT.SALE.COMPLETED': {
        const resource = event.resource
        if (!resource) break

        const billingAgreementId = resource.billing_agreement_id
        if (!billingAgreementId) break

        const subscription = await getPayPalSubscriptionDetails(billingAgreementId)

        let userId: string | undefined
        let plan: string | undefined
        try {
          const notes = subscription.custom_id ? JSON.parse(subscription.custom_id) : {}
          userId = notes.userId
          plan = notes.plan
        } catch {}

        if (!userId) {
          const userLookup = await sql`
            SELECT github_id FROM users WHERE subscription_id = ${billingAgreementId}
          `
          if (userLookup.length > 0) {
            userId = String(userLookup[0].github_id)
          }
        }

        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            const user = await getUserByGithubId(githubId)
            if (!user || user.plan === 'free' || !user.subscriptionId) {
              await activateSubscription(githubId, plan || 'starter', billingAgreementId, 'paypal')
              console.log(`[PAYPAL_WEBHOOK] Subscription activated for user ${githubId}, plan: ${plan}`)
            } else {
              await extendSubscription(githubId)
              console.log(`[PAYPAL_WEBHOOK] Subscription renewed for user ${githubId}`)
            }

            try {
              await sql`
                INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
                VALUES (
                  'subscription_renewed',
                  ${resource.amount?.total ? Math.round(parseFloat(resource.amount.total) * 100) : 0},
                  ${resource.amount?.currency || 'USD'},
                  ${githubId},
                  ${plan || 'unknown'},
                  ${sql.json({
                    subscriptionId: billingAgreementId,
                    paymentId: resource.id,
                    method: 'paypal_subscription',
                  })},
                  NOW()
                )
              `
            } catch (e) {
              console.error('[PAYPAL_WEBHOOK] Failed to log renewal:', e)
            }
          }
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        const resource = event.resource
        if (!resource) break

        const userLookup = await sql`
          SELECT github_id FROM users WHERE subscription_id = ${resource.id}
        `
        if (userLookup.length > 0) {
          const githubId = userLookup[0].github_id
          await cancelUserSubscription(githubId)
          console.log(`[PAYPAL_WEBHOOK] Subscription cancelled for user ${githubId}`)

          try {
            await sql`
              INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'subscription_cancelled',
                0,
                'USD',
                ${githubId},
                'unknown',
                ${sql.json({ subscriptionId: resource.id })},
                NOW()
              )
            `
          } catch (e) {
            console.error('[PAYPAL_WEBHOOK] Failed to log cancellation:', e)
          }
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const resource = event.resource
        if (!resource) break

        const userLookup = await sql`
          SELECT github_id FROM users WHERE subscription_id = ${resource.id}
        `
        if (userLookup.length > 0) {
          const githubId = userLookup[0].github_id
          await cancelUserSubscription(githubId)
          console.log(`[PAYPAL_WEBHOOK] Subscription suspended for user ${githubId} — access continues until plan_expires_at`)

          try {
            await sql`
              INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'subscription_halted',
                0,
                'USD',
                ${githubId},
                'unknown',
                ${sql.json({ subscriptionId: resource.id, reason: 'payment_failed' })},
                NOW()
              )
            `
          } catch (e) {
            console.error('[PAYPAL_WEBHOOK] Failed to log suspension:', e)
          }
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const resource = event.resource
        if (!resource) break

        const userLookup = await sql`
          SELECT github_id FROM users WHERE subscription_id = ${resource.id}
        `
        if (userLookup.length > 0) {
          const githubId = userLookup[0].github_id
          await cancelUserSubscription(githubId)
          console.log(`[PAYPAL_WEBHOOK] Subscription expired for user ${githubId}`)

          try {
            await sql`
              INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'subscription_cancelled',
                0,
                'USD',
                ${githubId},
                'unknown',
                ${sql.json({ subscriptionId: resource.id, reason: 'expired' })},
                NOW()
              )
            `
          } catch (e) {
            console.error('[PAYPAL_WEBHOOK] Failed to log expiration:', e)
          }
        }
        break
      }

      default:
        console.log(`[PAYPAL_WEBHOOK] Unhandled event type: ${eventType}`)
    }

    try {
      const expired = await expireOverduePlans()
      if (expired > 0) {
        console.log(`[PAYPAL_WEBHOOK] Expired ${expired} overdue plans`)
      }
    } catch (e) {
      console.error('[PAYPAL_WEBHOOK] Failed to expire overdue plans:', e)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
