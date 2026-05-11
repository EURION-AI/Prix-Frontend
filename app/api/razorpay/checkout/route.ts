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
    const region = body.region || 'US'
    const upgrade = body.upgrade
    const discount = body.discount

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

    // Calculate amount with upgrade/discount logic
    let finalAmount = planPricing.price

    if (upgrade === 'starter_to_pro' && plan === 'pro') {
      // Special upgrade price
      if (region === 'IN') {
        finalAmount = 500 // ₹5 for testing
      } else {
        finalAmount = 200 // $2.00 for US/others
      }
    } else if (discount) {
      // Generic discount (in cents/paise)
      const discountValue = parseInt(String(discount), 10)
      if (!isNaN(discountValue)) {
        // If discount is '2', it might mean '$2' (200 cents)
        // For simplicity, if it's a small number like '2', treat it as the major currency unit
        const actualDiscount = discountValue < 100 ? discountValue * 100 : discountValue
        finalAmount = Math.max(0, finalAmount - actualDiscount)
      }
    }

    const razorpay = getRazorpayClient()

    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    const options = {
      amount: finalAmount,
      currency: planPricing.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        userId: userId || 'anonymous',
        region,
        upgrade: upgrade || 'none',
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
