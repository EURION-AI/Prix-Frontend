import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { markReferralAsPurchased } from '@/lib/affiliate-store-db'
import { updateUserPlan, getUserByGithubId } from '@/lib/user-store'
import { sql } from '@/lib/db'

function getStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  })
}

function getPlanFromPriceId(priceId: string): string {
  const basicPrice = process.env.STRIPE_BASIC_PRICE_ID
  const advancedPrice = process.env.STRIPE_ADVANCED_PRICE_ID

  if (priceId === basicPrice) return 'starter'
  if (priceId === advancedPrice) return 'pro'
  return 'free'
}

function getAmountFromPriceId(priceId: string): number {
  const basicPrice = process.env.STRIPE_BASIC_PRICE_ID
  const advancedPrice = process.env.STRIPE_ADVANCED_PRICE_ID

  if (priceId === basicPrice) return 299
  if (priceId === advancedPrice) return 500
  return 0
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, stripe-signature')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const stripe = getStripeClient()
  if (!stripe) {
    console.error('Stripe is not configured')
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook secret not configured')
    return NextResponse.json(
      { error: 'Stripe webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log(`Processing webhook event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id)

        const userId = session.metadata?.userId
        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await markReferralAsPurchased(githubId)

            const priceId = session.line_items?.data[0]?.price?.id || ''
            const amount = getAmountFromPriceId(priceId) * 100
            const plan = getPlanFromPriceId(priceId)

            await sql`
              INSERT INTO revenue_events (event_type, amount, customer_id, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'purchase',
                ${amount},
                ${userId},
                ${githubId},
                ${plan},
                ${JSON.stringify({
                  sessionId: session.id,
                  checkoutType: session.mode,
                  customerEmail: session.customer_details?.email,
                })},
                NOW()
              )
            `

            if (plan !== 'free') {
              await updateUserPlan(githubId, plan)
            }

            const affiliateCode = session.metadata?.affiliateCode
            if (affiliateCode) {
              const affiliate = await sql`
                SELECT id FROM affiliate_users WHERE affiliate_code = ${affiliateCode}
              `
              if (affiliate.length > 0) {
                const commission = amount * 0.15
                await sql`
                  INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
                  VALUES (
                    'commission_paid',
                    ${affiliate[0].id},
                    ${affiliateCode},
                    ${commission},
                    'paid',
                    ${JSON.stringify({
                      githubId,
                      amount,
                      commission,
                      sessionId: session.id,
                    })},
                    NOW()
                  )
                `
              }
            }

            console.log('Recorded purchase and updated user plan:', githubId, plan)
          }
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription created:', subscription.id, 'Status:', subscription.status)

        const userId = subscription.metadata?.userId
        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await markReferralAsPurchased(githubId)

            const priceId = subscription.items.data[0]?.price?.id || ''
            const amount = getAmountFromPriceId(priceId) * 100
            const plan = getPlanFromPriceId(priceId)

            await sql`
              INSERT INTO revenue_events (event_type, amount, customer_id, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'subscription',
                ${amount},
                ${userId},
                ${githubId},
                ${plan},
                ${JSON.stringify({
                  subscriptionId: subscription.id,
                  status: subscription.status,
                })},
                NOW()
              )
            `

            if (plan !== 'free') {
              await updateUserPlan(githubId, plan)
            }

            console.log('Recorded subscription and updated user plan:', githubId, plan)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status)

        const userId = subscription.metadata?.userId
        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            const priceId = subscription.items.data[0]?.price?.id || ''
            const plan = getPlanFromPriceId(priceId)

            if (subscription.status === 'active' && plan !== 'free') {
              await updateUserPlan(githubId, plan)

              await sql`
                INSERT INTO revenue_events (event_type, amount, customer_id, github_id, subscription_tier, metadata, created_at)
                VALUES (
                  'subscription_renewed',
                  ${getAmountFromPriceId(priceId) * 100},
                  ${userId},
                  ${githubId},
                  ${plan},
                  ${JSON.stringify({
                    subscriptionId: subscription.id,
                    status: subscription.status,
                  })},
                  NOW()
                )
              `
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription cancelled:', subscription.id)

        const userId = subscription.metadata?.userId
        if (userId && userId !== 'anonymous') {
          const githubId = parseInt(userId, 10)
          if (!isNaN(githubId) && githubId > 0) {
            await updateUserPlan(githubId, 'free')

            await sql`
              INSERT INTO revenue_events (event_type, amount, customer_id, github_id, subscription_tier, metadata, created_at)
              VALUES (
                'subscription_cancelled',
                0,
                ${userId},
                ${githubId},
                'free',
                ${JSON.stringify({
                  subscriptionId: subscription.id,
                  cancelledAt: new Date().toISOString(),
                })},
                NOW()
              )
            `

            console.log('Subscription cancelled, user downgraded to free:', githubId)
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded for invoice:', invoice.id)

        if (invoice.subscription && typeof invoice.subscription === 'string') {
          try {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
            const userId = subscription.metadata?.userId
            if (userId && userId !== 'anonymous') {
              const githubId = parseInt(userId, 10)
              if (!isNaN(githubId) && githubId > 0) {
                await markReferralAsPurchased(githubId)

                const priceId = subscription.items.data[0]?.price?.id || ''
                const amount = getAmountFromPriceId(priceId) * 100
                const plan = getPlanFromPriceId(priceId)

                await sql`
                  INSERT INTO revenue_events (event_type, amount, customer_id, github_id, subscription_tier, metadata, created_at)
                  VALUES (
                    'subscription_renewed',
                    ${amount},
                    ${userId},
                    ${githubId},
                    ${plan},
                    ${JSON.stringify({
                      invoiceId: invoice.id,
                      subscriptionId: subscription.id,
                    })},
                    NOW()
                  )
                `

                console.log('Recorded renewal payment:', githubId, amount)
              }
            }
          } catch (err) {
            console.error('Error retrieving subscription:', err)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)

        await sql`
          INSERT INTO revenue_events (event_type, amount, customer_id, subscription_tier, metadata, created_at)
          VALUES (
            'payment_failed',
            0,
            ${invoice.customer?.toString() || 'unknown'},
            'unknown',
            ${JSON.stringify({
              invoiceId: invoice.id,
              errorMessage: invoice.last_finalization_error?.message,
            })},
            NOW()
          )
        `
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`Error processing event ${event.type}:`, err)
    return NextResponse.json(
      { error: 'Error processing webhook event' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}