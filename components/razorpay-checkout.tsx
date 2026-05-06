'use client'

import { useEffect, useState } from 'react'
import { Loader2, Check, X } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: string
  currency: string
  name: string
  description: string
  image?: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  on: (event: string, handler: () => void) => void
  open: () => void
}

interface RazorpayCheckoutButtonProps {
  plan: 'starter' | 'pro'
  amount: number
  currency: string
  userId: string | null
  region?: string
  userName?: string
  userEmail?: string
  onSuccess: () => void
  onError: (error: string) => void
  disabled?: boolean
}

export function RazorpayCheckoutButton({
  plan,
  amount,
  currency,
  region = 'IN',
  userId,
  userName = '',
  userEmail = '',
  onSuccess,
  onError,
  disabled
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      console.log('Razorpay checkout script loaded successfully')
      setIsScriptLoaded(true)
    }
    script.onerror = (e) => {
      console.error('Razorpay script load error:', e)
      onError('Failed to load Razorpay checkout')
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      onError('Razorpay is still loading. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Get CSRF token first
      const csrfResponse = await fetch('/api/razorpay/checkout')
      const { csrfToken } = await csrfResponse.json()

      if (!csrfToken) {
        throw new Error('Failed to obtain security token')
      }

      // 2. Create Razorpay order
      const createOrderResponse = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          plan,
          userId,
          region
        }),
      })

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const orderData = await createOrderResponse.json()

      if (!orderData.id) {
        throw new Error('No order ID received')
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: String(orderData.amount),
        currency: orderData.currency,
        name: 'Prix AI',
        description: `Prix ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
        image: '/logo.png',
        order_id: orderData.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                userId
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            onSuccess()
          } catch (error) {
            onError(error instanceof Error ? error.message : 'Payment verification failed')
          }
        },
        prefill: {
          name: userName,
          email: userEmail
        },
        theme: {
          color: '#ec4899'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', (response: { error: { description: string } }) => {
        onError(response.error?.description || 'Payment failed')
        setIsLoading(false)
      })

      razorpay.open()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to initiate payment')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading || !isScriptLoaded}
      className="w-full h-14 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isLoading || !isScriptLoaded ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {isScriptLoaded ? 'Processing...' : 'Loading Razorpay...'}
        </>
      ) : (
        `Pay ${currency} ${(amount / 100).toFixed(2)}`
      )}
    </button>
  )
}