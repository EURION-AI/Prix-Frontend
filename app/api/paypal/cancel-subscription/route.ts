import { NextResponse } from 'next/server'
import { getUserByGithubId, cancelUserSubscription } from '@/lib/user-store'
import { getAuthenticatedUser } from '@/lib/auth'
import { cancelPayPalSubscription } from '@/lib/paypal'

export async function POST() {
  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const githubId = authed.githubId

    // Verify this user is on a PayPal subscription, not Razorpay
    const user = await getUserByGithubId(githubId)
    if (!user || !user.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    if (user.subscriptionProvider !== 'paypal') {
      return NextResponse.json(
        { error: 'This account does not have an active PayPal subscription' },
        { status: 400 }
      )
    }

    const subscriptionId = user.subscriptionId

    await cancelPayPalSubscription(subscriptionId)
    await cancelUserSubscription(githubId)

    const updatedUser = await getUserByGithubId(githubId)

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. Access continues until your current period ends.',
      expiresAt: updatedUser?.planExpiresAt || null,
    })
  } catch (error) {
    console.error('Cancel PayPal subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
