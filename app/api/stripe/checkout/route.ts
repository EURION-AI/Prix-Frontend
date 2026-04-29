import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validatePlan } from '@/lib/validation'
import { rateLimit } from '@/lib/security'

const PLANS = {
  starter: {
    name: 'Base',
    price: 299,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
  },
  pro: {
    name: 'Pro',
    price: 499,
    priceId: process.env.STRIPE_ADVANCED_PRICE_ID,
  },
} as const

type PlanKey = keyof typeof PLANS

function getStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
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

    if (userId && (typeof userId !== 'string' || userId.length > 100)) {
      return NextResponse.json(
        { error: 'Invalid userId' },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[plan as PlanKey]
    const stripe = getStripeClient()

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (selectedPlan.priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: selectedPlan.priceId,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${baseUrl}/checkout/cancel?plan=${plan}`,
        metadata: {
          plan,
          userId: userId || 'anonymous',
        },
        subscription_data: {
          metadata: {
            plan,
            userId: userId || 'anonymous',
          },
        },
      })

      return NextResponse.json({ url: session.url })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Prix ${selectedPlan.name} Plan`,
              description: `Monthly subscription for Prix ${selectedPlan.name} plan`,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${baseUrl}/checkout/cancel?plan=${plan}`,
      metadata: {
        plan,
        userId: userId || 'anonymous',
      },
      subscription_data: {
        metadata: {
          plan,
          userId: userId || 'anonymous',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}