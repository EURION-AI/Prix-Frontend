import { NextResponse } from 'next/server'
import { getUserByGithubId, getUserSubscriptionId, cancelUserSubscription } from '@/lib/user-store'
import { getAuthenticatedUser } from '@/lib/auth'
import { cancelPayPalSubscription } from '@/lib/paypal'

export async function POST() {
  try {
    const authed = await getAuthenticatedUser()
    if (!authed) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const githubId = authed.githubId

    const subscriptionId = await getUserSubscriptionId(githubId)
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    await cancelPayPalSubscription(subscriptionId)
    await cancelUserSubscription(githubId)

    const user = await getUserByGithubId(githubId)

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. Access continues until your current period ends.',
      expiresAt: user?.planExpiresAt || null,
    })
  } catch (error) {
    console.error('Cancel PayPal subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
