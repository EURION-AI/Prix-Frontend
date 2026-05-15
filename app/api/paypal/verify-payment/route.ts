import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { activateSubscription } from '@/lib/user-store'
import { getPayPalSubscriptionDetails } from '@/lib/paypal'
import { sql } from '@/lib/db'
import { markReferralAsPurchased } from '@/lib/affiliate-store-db'
import { PRICING } from '@/lib/pricing'

export async function POST(request: Request) {
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

    const subscription = await getPayPalSubscriptionDetails(subscription_id)

    if (subscription.status !== 'ACTIVE') {
      console.error(`PayPal subscription ${subscription_id} is not active, status: ${subscription.status}`)
      return NextResponse.json(
        { error: `Subscription is not active. Current status: ${subscription.status}` },
        { status: 400 }
      )
    }

    if (userId && userId !== 'anonymous') {
      const githubId = parseInt(userId, 10)

      if (!isNaN(githubId) && githubId > 0) {
        const userRegion = (region && ['IN', 'US', 'GB', 'EU'].includes(region)) ? region : 'US'
        const pricing = PRICING[userRegion as keyof typeof PRICING][plan as keyof typeof PRICING.IN]

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
    console.error('PayPal subscription verification error:', error)
    return NextResponse.json(
      {
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
