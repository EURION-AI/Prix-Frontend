import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { validatePlan } from '@/lib/validation'
import { rateLimit } from '@/lib/security'

const PLANS = {
  starter: {
    name: 'Base',
    price: 24900, // INR 249.00 (approx $2.99)
  },
  pro: {
    name: 'Pro',
    price: 41500, // INR 415.00 (approx $4.99)
  },
} as const

type PlanKey = keyof typeof PLANS

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
  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const body = await request.json()
    const plan = body.plan
    const userId = body.userId

    if (!plan || !validatePlan(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[plan as PlanKey]
    const razorpay = getRazorpayClient()

    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    const options = {
      amount: selectedPlan.price,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        userId: userId || 'anonymous',
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}
