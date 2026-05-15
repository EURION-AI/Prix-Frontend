'use server'

import { sql } from '@/lib/db'

const PAYPAL_API_BASE = 'https://api-m.paypal.com'
const PAYPAL_API_BASE_SANDBOX = 'https://api-m.sandbox.paypal.com'

function getBaseUrl() {
  return process.env.PAYPAL_SANDBOX === 'true' ? PAYPAL_API_BASE_SANDBOX : PAYPAL_API_BASE
}

interface PayPalToken {
  access_token: string
  expires_at: number
}

let tokenCache: PayPalToken | null = null

export async function getPayPalAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires_at) {
    return tokenCache.access_token
  }

  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal client ID or secret not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal OAuth failed: ${err}`)
  }

  const data = await res.json()
  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  }

  return data.access_token
}

export interface PayPalProduct {
  id: string
  name: string
}

export async function createPayPalProduct(): Promise<PayPalProduct> {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${getBaseUrl()}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Prix AI',
      description: 'AI-powered code review subscription',
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  })

  if (res.status === 409) {
    return { id: 'PRODUCT-ALREADY-EXISTS', name: 'Prix AI' }
  }

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal product creation failed: ${err}`)
  }

  return res.json()
}

export interface PayPalPlan {
  id: string
  product_id: string
}

export async function createPayPalPlan(
  planKey: string,
  amount: number,
  currency: string,
  planName: string
): Promise<PayPalPlan> {
  const cached = await sql`
    SELECT paypal_plan_id, product_id FROM paypal_plans WHERE internal_plan_id = ${planKey}
  `
  if (cached.length > 0) {
    return { id: cached[0].paypal_plan_id, product_id: cached[0].product_id }
  }

  const token = await getPayPalAccessToken()

  let productId: string
  const existingProduct = await sql`
    SELECT paypal_plan_id FROM paypal_plans WHERE internal_plan_id = 'product_prix_ai'
  `
  if (existingProduct.length > 0) {
    productId = existingProduct[0].paypal_plan_id
  } else {
    const product = await createPayPalProduct()
    productId = product.id
  }

  const res = await fetch(`${getBaseUrl()}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: `Prix AI ${planName}`,
      description: `Monthly subscription for Prix AI ${planName} plan`,
      billing_cycles: [
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: (amount / 100).toFixed(2),
              currency_code: currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: currency,
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal plan creation failed: ${err}`)
  }

  const plan = await res.json()

  await sql`
    INSERT INTO paypal_plans (internal_plan_id, paypal_plan_id, product_id, amount, currency)
    VALUES (${planKey}, ${plan.id}, ${productId}, ${amount}, ${currency})
    ON CONFLICT (internal_plan_id) DO UPDATE SET
      paypal_plan_id = EXCLUDED.paypal_plan_id,
      product_id = EXCLUDED.product_id
  `

  if (existingProduct.length === 0) {
    await sql`
      INSERT INTO paypal_plans (internal_plan_id, paypal_plan_id, product_id, amount, currency)
      VALUES ('product_prix_ai', ${productId}, ${productId}, 0, 'USD')
      ON CONFLICT (internal_plan_id) DO NOTHING
    `
  }

  return { id: plan.id, product_id: productId }
}

export interface PayPalSubscription {
  id: string
  status: string
  links: { rel: string; href: string }[]
}

export async function createPayPalSubscription(
  planId: string,
  returnUrl: string,
  cancelUrl: string,
  notes?: Record<string, string>
): Promise<PayPalSubscription> {
  const token = await getPayPalAccessToken()

  const body: Record<string, any> = {
    plan_id: planId,
    application_context: {
      brand_name: 'Prix AI',
      locale: 'en-US',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'SUBSCRIBE_NOW',
      payment_method: {
        payer_selected: 'PAYPAL',
        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
      },
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  }

  if (notes) {
    body.custom_id = JSON.stringify(notes)
  }

  const res = await fetch(`${getBaseUrl()}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal subscription creation failed: ${err}`)
  }

  return res.json()
}

export async function getPayPalSubscriptionDetails(subscriptionId: string): Promise<{
  id: string
  status: string
  custom_id?: string
  plan_id: string
}> {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${getBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal subscription fetch failed: ${err}`)
  }

  return res.json()
}

export async function cancelPayPalSubscription(subscriptionId: string): Promise<void> {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${getBaseUrl()}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: 'Cancelled by user',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal subscription cancellation failed: ${err}`)
  }
}

export async function verifyPayPalWebhookSignature(
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID is not configured')
    return false
  }

  const token = await getPayPalAccessToken()

  const payload = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: JSON.parse(body),
  }

  const res = await fetch(`${getBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error('PayPal webhook verification request failed:', await res.text())
    return false
  }

  const data = await res.json()
  return data.verification_status === 'SUCCESS'
}
