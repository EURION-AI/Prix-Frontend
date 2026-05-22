import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getUserByGithubId, getUserSubscriptionId, cancelUserSubscription } from '@/lib/user-store'
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

export async function POST(request: Request) {
  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const githubId = authed.githubId

    // Get subscription ID from database
    const subscriptionId = await getUserSubscriptionId(githubId)

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Skip cancellation for legacy entries
    if (subscriptionId.startsWith('legacy_')) {
      await cancelUserSubscription(githubId)
      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled. Access continues until your current period ends.',
      })
    }

    const razorpay = getRazorpayClient()
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      )
    }

    // Cancel on Razorpay — at end of current billing cycle
    await (razorpay as any).subscriptions.cancel(subscriptionId, {
      cancel_at_cycle_end: true,
    })

    // Clear subscription ID locally (user keeps access until plan_expires_at)
    await cancelUserSubscription(githubId)

    const user = await getUserByGithubId(githubId)

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. Access continues until your current period ends.',
      expiresAt: user?.planExpiresAt || null,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
