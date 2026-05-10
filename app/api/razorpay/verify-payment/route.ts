import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { updateUserPlan, getUserByGithubId } from '@/lib/user-store'
import { sql } from '@/lib/db'
import { markReferralAsPurchased } from '@/lib/affiliate-store-db'
import { PRICING } from '@/lib/pricing'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userId
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
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
        // Get regional pricing from shared config (default to IN for revenue tracking)
        const pricing = PRICING.IN[plan as keyof typeof PRICING.IN]

        await updateUserPlan(githubId, plan)
        await markReferralAsPurchased(githubId, plan, pricing.price)

        await sql`
          INSERT INTO revenue_events (event_type, amount, currency, github_id, subscription_tier, metadata, created_at)
          VALUES (
            'purchase',
            ${pricing.price},
            ${pricing.currency},
            ${githubId},
            ${plan},
            ${JSON.stringify({
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              method: 'razorpay'
            })},
            NOW()
          )
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      plan
    })
  } catch (error) {
    console.error('Razorpay payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}