import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { activateSubscription } from '@/lib/user-store'
import { sql } from '@/lib/db'
import { markReferralAsPurchased } from '@/lib/affiliate-store-db'
import { getAuthenticatedUser } from '@/lib/auth'
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
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan,
      region,
    } = body

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      )
    }

    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not configured')
      return NextResponse.json(
        { error: 'Payment verification not configured' },
        { status: 500 }
      )
    }

    // For subscriptions, signature is generated using:
    // razorpay_payment_id | razorpay_subscription_id
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      console.error('Razorpay signature mismatch', {
        expected: razorpay_signature.substring(0, 20) + '...',
        generated: generatedSignature.substring(0, 20) + '...'
      })
      return NextResponse.json(
        { error: 'Payment verification failed - signature mismatch' },
        { status: 400 }
      )
    }

    if (userId && userId !== 'anonymous') {
      const githubId = parseInt(userId, 10)

      if (!isNaN(githubId) && githubId > 0) {
        const userRegion = (region && ['IN', 'US', 'GB', 'EU'].includes(region)) ? region : 'US'
        const pricing = PRICING[userRegion as keyof typeof PRICING][plan as keyof typeof PRICING.IN]

        // Idempotency — prevent double-activation on multiple verify clicks
        const verifyEventId = `razorpay_verify_${githubId}_${razorpay_subscription_id}`
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
          INSERT INTO processed_webhooks (event_id, provider) VALUES (${verifyEventId}, 'razorpay')
          ON CONFLICT (event_id) DO UPDATE SET provider = 'razorpay'
        `

        // CRITICAL: Activate subscription with expiration tracking
        await activateSubscription(githubId, plan, razorpay_subscription_id)
        await markReferralAsPurchased(githubId, plan, pricing.price)

        // NON-CRITICAL: Log revenue event for analytics
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
                subscriptionId: razorpay_subscription_id,
                paymentId: razorpay_payment_id,
                method: 'razorpay_subscription'
              })},
              NOW()
            )
          `
        } catch (analyticsError) {
          console.error('Failed to log revenue event (non-critical):', analyticsError)
          // We don't throw here so the user still gets a success response
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      plan
    })
  } catch (error) {
    console.error('[RAZORPAY VERIFY] Error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}