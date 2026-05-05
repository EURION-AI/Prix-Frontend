import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { validatePlan } from '@/lib/validation'
import { rateLimit } from '@/lib/security'
import { validateCSRFToken, addCSRFTokenToResponse, generateCSRFToken } from '@/lib/csrf'

const REGIONAL_PRICING = {
  IN: {
    starter: { price: 69900, currency: 'INR' }, // ₹699
    pro: { price: 89900, currency: 'INR' }, // ₹899
  },
  GB: {
    starter: { price: 699, currency: 'GBP' }, // £6.99
    pro: { price: 999, currency: 'GBP' }, // £9.99
  },
  EU: {
    starter: { price: 699, currency: 'EUR' }, // €6.99
    pro: { price: 999, currency: 'EUR' }, // €9.99
  },
  US: {
    starter: { price: 699, currency: 'USD' }, // $6.99
    pro: { price: 999, currency: 'USD' }, // $9.99
  },
}

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
  const response = NextResponse.json({ csrfToken: generateCSRFToken() })
  return addCSRFTokenToResponse(response)
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

    // Get regional pricing
    const regionalPricing = REGIONAL_PRICING[region as keyof typeof REGIONAL_PRICING] || REGIONAL_PRICING.US
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
