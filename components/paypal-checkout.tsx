'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface PayPalCheckoutButtonProps {
  plan: 'starter' | 'pro'
  amount: number
  currency: string
  userId: string | null
  region?: string
  userName?: string
  userEmail?: string
  upgrade?: string | null
  onSuccess: () => void
  onError: (error: string) => void
  disabled?: boolean
}

export function PayPalCheckoutButton({
  plan,
  amount,
  currency,
  region = 'IN',
  userId,
  userName = '',
  userEmail = '',
  upgrade: upgradeParam,
  onSuccess,
  onError,
  disabled,
}: PayPalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  const formatDisplayPrice = (amount: number, currency: string): string => {
    if (currency === 'INR') {
      return `₹${(amount / 100).toFixed(0)}`
    } else {
      return `${currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€'}${(amount / 100).toFixed(2)}`
    }
  }

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setScriptError(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=subscription&vault=true`
    script.async = true
    script.onload = () => {
      setIsScriptLoaded(true)
      setScriptError(false)
    }
    script.onerror = () => {
      setScriptError(true)
      setIsScriptLoaded(false)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const retryScript = () => {
    setScriptError(false)
    setIsScriptLoaded(false)
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setScriptError(true)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=subscription&vault=true`
    script.async = true
    script.onload = () => {
      setIsScriptLoaded(true)
      setScriptError(false)
    }
    script.onerror = () => {
      setScriptError(true)
    }
    document.body.appendChild(script)
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const csrfResponse = await fetch('/api/paypal/checkout')
      const { csrfToken } = await csrfResponse.json()

      if (!csrfToken) {
        throw new Error('Failed to obtain security token')
      }

      const res = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          plan,
          region,
          returnUrl: `${window.location.origin}/checkout/success?plan=${plan}`,
          cancelUrl: `${window.location.origin}/checkout/cancel?plan=${plan}`,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create subscription')
      }

      const data = await res.json()

      if (!data.subscriptionId) {
        throw new Error('No subscription ID received')
      }

      const approvalLink = data.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
      if (!approvalLink) {
        throw new Error('No approval link received')
      }

      const popup = window.open(
        approvalLink,
        'paypal-subscription',
        'width=600,height=700,scrollbars=yes'
      )

      if (!popup) {
        window.location.href = approvalLink
        return
      }

      const pollTimer = setInterval(async () => {
        try {
          if (popup.closed) {
            clearInterval(pollTimer)
            setIsLoading(false)
            return
          }

          const popupUrl = popup.location.href
          if (popupUrl && popupUrl.includes(window.location.origin)) {
            clearInterval(pollTimer)
            popup.close()

            const url = new URL(popupUrl)
            const subscriptionId = url.searchParams.get('subscription_id')
            if (subscriptionId) {
              await verifyAndActivate(subscriptionId)
            } else {
              onError('Payment was not completed. Please try again.')
              setIsLoading(false)
            }
          }
        } catch {
          // Cross-origin errors are expected while PayPal hosts the popup
        }
      }, 500)

      setTimeout(() => {
        clearInterval(pollTimer)
      }, 300000)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to initiate PayPal payment')
      setIsLoading(false)
    }
  }

  const verifyAndActivate = async (subscriptionId: string) => {
    try {
      const verifyResponse = await fetch('/api/paypal/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          plan,
          region,
        }),
      })

      const verifyData = await verifyResponse.json()
      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

      onSuccess()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment verification failed')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={scriptError ? retryScript : handlePayment}
      disabled={disabled || isLoading || (!isScriptLoaded && !scriptError)}
      className="w-full h-14 rounded-xl bg-[#0070ba] text-white font-bold text-base hover:bg-[#003087] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {scriptError ? (
        'Retry Loading PayPal'
      ) : isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : !isScriptLoaded ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading PayPal...
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M17.81 4.04A6.37 6.37 0 0 0 13.6 2H4.35a1.8 1.8 0 0 0-1.79 1.54L.8 15.62a1.07 1.07 0 0 0 1.06 1.24h3.97l1.02-6.48-.03.18c.1-.61.63-1.06 1.26-1.06h3.49c2.29 0 4.24 1.65 4.6 3.88H16.8l1.01-6.42z"/>
            <path d="M8.9 1.79A1.8 1.8 0 0 1 10.69.25h8.9a6.37 6.37 0 0 1 4.22 2.04c.4.47.72 1 .95 1.56l-1.01 6.42h.01c-.36-2.23-2.31-3.88-4.6-3.88h-3.49c-.63 0-1.16.45-1.26 1.06l-.03.18-1.02 6.48H8.9l-1.01-6.42H7.87l1.03-6.53z" opacity=".3"/>
          </svg>
          Subscribe {formatDisplayPrice(amount, currency)}/mo
        </>
      )}
    </button>
  )
}
