import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { activateSubscription } from '@/lib/user-store'
import { getPayPalSubscriptionDetails } from '@/lib/paypal'
import { sql } from '@/lib/db'
import { markReferralAsPurchased } from '@/lib/affiliate-store-db'
import { PRICING } from '@/lib/pricing'
import { rateLimit } from '@/lib/security'

export async function POST(request: Request) {
  const rateLimitResult = rateLimit(request, 20)
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
    const { subscription_id, plan, region } = body

    if (!subscription_id) {
      return NextResponse.json(
        { error: 'Missing subscription_id' },
        { status: 400 }
      )
    }

    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Poll for ACTIVE status with retries (handles race where PayPal hasn't synced yet)
    let subscription = await getPayPalSubscriptionDetails(subscription_id)

    let retries = 0
    while (subscription.status !== 'ACTIVE' && retries < 5) {
      await new Promise(r => setTimeout(r, 1000))
      subscription = await getPayPalSubscriptionDetails(subscription_id)
      retries++
    }

    if (subscription.status !== 'ACTIVE') {
      console.error(`PayPal subscription ${subscription_id} is not active after retries, status: ${subscription.status}`)
      // Track failed attempt for monitoring
      await sql`
        INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
        VALUES ('payment_verification_failed', 0, 'USD', ${parseInt(userId, 10) || 0}, ${plan}, ${sql.json({ subscriptionId: subscription_id, status: subscription.status })}, NOW())
      `.catch(() => {})
      return NextResponse.json(
        { error: `Subscription is not active. Current status: ${subscription.status}` },
        { status: 400 }
      )
    }

    if (userId && userId !== 'anonymous') {
      const githubId = parseInt(userId, 10)

      if (!isNaN(githubId) && githubId > 0) {
        const SUPPORTED_PAYPAL_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'MXN']
        let paypalRegion = (region && ['IN', 'US', 'GB', 'EU'].includes(region)) ? region : 'US'
        let pricing = PRICING[paypalRegion as keyof typeof PRICING][plan as keyof typeof PRICING.IN]

        if (!SUPPORTED_PAYPAL_CURRENCIES.includes(pricing.currency)) {
          paypalRegion = 'US'
          pricing = PRICING.US[plan as keyof typeof PRICING.US]
        }

        // Idempotency — prevent double-activation on multiple verify clicks
        const verifyEventId = `paypal_verify_${githubId}_${subscription_id}`
        const alreadyActivated = await sql`
          SELECT 1 FROM processed_webhooks WHERE event_id = ${verifyEventId}
        `
        if (alreadyActivated.length > 0) {
          return NextResponse.json({
            success: true,
            message: 'Subscription already activated',
            plan,
          })
        }

        await sql`
          INSERT INTO processed_webhooks (event_id, provider) VALUES (${verifyEventId}, 'paypal')
          ON CONFLICT (event_id) DO UPDATE SET provider = 'paypal'
        `

        await activateSubscription(githubId, plan, subscription_id, 'paypal')
        await markReferralAsPurchased(githubId, plan, pricing.price)

        try {
          await sql`
            INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
            VALUES (
              'subscription_started',
              ${pricing.price},
              ${pricing.currency},
              ${githubId},
              ${plan},
              ${sql.json({
                subscriptionId: subscription_id,
                method: 'paypal_subscription'
              })},
              NOW()
            )
          `
        } catch (analyticsError) {
          console.error('Failed to log revenue event (non-critical):', analyticsError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      plan,
    })
  } catch (error) {
    console.error('[PAYPAL VERIFY] Error:', error)
    const message = error instanceof Error ? error.message : 'Payment verification failed'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
