import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { validatePlan } from '@/lib/validation'
import { rateLimit } from '@/lib/security'
import { validateCSRFToken, addCSRFTokenToResponse, generateCSRFToken } from '@/lib/csrf'
import { PRICING } from '@/lib/pricing'

const PLANS = {
  starter: {
    name: 'Base',
  },
  pro: {
    name: 'Pro',
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

export async function GET(request: Request) {
  // Provide CSRF token for frontend
  const { response, token } = addCSRFTokenToResponse(NextResponse.json({}))
  return NextResponse.json({ csrfToken: token }, { 
    headers: response.headers,
  })
}

export async function POST(request: Request) {
  // Validate CSRF token for POST requests
  const csrfError = await validateCSRFToken(request)
  if (csrfError) return csrfError

  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const body = await request.json()
    const plan = body.plan
    const userId = body.userId
    const region = body.region || 'US' // Default to US if no region provided

    if (!plan || !validatePlan(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    // Get regional pricing from shared config
    const regionalPricing = PRICING[region as keyof typeof PRICING] || PRICING.US
    const planPricing = regionalPricing[plan as PlanKey]

    if (!planPricing) {
      return NextResponse.json(
        { error: 'Invalid plan or region' },
        { status: 400 }
      )
    }

    const razorpay = getRazorpayClient()

    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    const options = {
      amount: planPricing.price,
      currency: planPricing.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        userId: userId || 'anonymous',
        region,
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}
