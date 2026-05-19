'use client'

import { useEffect, useState } from 'react'
import { Loader2, ArrowUpRight, ExternalLink } from 'lucide-react'

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
  const [showManualLink, setShowManualLink] = useState(false)
  const [pendingApprovalLink, setPendingApprovalLink] = useState('')
  const [pendingSubscriptionId, setPendingSubscriptionId] = useState('')
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const STORAGE_KEY = `paypal_verified_${plan}_${region}`
  // Note: sessionStorage is client-controllable (user can set via dev tools).
  // This is UI-only — the real gate is the server-side verify-payment endpoint.

  const formatDisplayPrice = (amount: number, currency: string): string => {
    if (currency === 'INR') {
      return `₹${(amount / 100).toFixed(0)}`
    } else {
      return `${currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€'}${(amount / 100).toFixed(2)}`
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setPaymentConfirmed(true)
    }

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
    if (paymentConfirmed) {
      onSuccess()
      return
    }

    setIsLoading(true)

    let popupReady = false

    try {
      if (upgradeParam) {
        const upgradeResponse = await fetch('/api/subscription/upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPlanId: plan, region }),
        })

        const upgradeData = await upgradeResponse.json()

        if (!upgradeResponse.ok) {
          throw new Error(upgradeData.error || upgradeData.details || 'Failed to process upgrade')
        }

        if (upgradeData.subscriptionId && upgradeData.links) {
          const approvalLink = upgradeData.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
          if (!approvalLink) {
            throw new Error('No approval link received')
          }

          const popup = window.open(
            approvalLink,
            'paypal-subscription',
            'width=600,height=700,scrollbars=yes'
          )

          if (!popup || popup.closed) {
            setPendingApprovalLink(approvalLink)
            setPendingSubscriptionId(upgradeData.subscriptionId)
            setShowManualLink(true)
            setIsLoading(false)
            return
          }

          const readyDelay = setTimeout(() => { popupReady = true }, 3000)

          const pollTimer = setInterval(async () => {
            try {
              if (popup.closed) {
                clearInterval(pollTimer)
                clearTimeout(readyDelay)
                setIsLoading(false)
                return
              }

              if (!popupReady) return

              const popupUrl = popup.location.href
              if (popupUrl && popupUrl.startsWith(window.location.origin)) {
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
            setIsLoading(false)
            onError('Payment window timed out. Please try again.')
          }, 300000)

          return
        }

        if (upgradeData.success) {
          onSuccess()
          return
        }

        onError('Unexpected upgrade response from server')
        return
      }

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

      if (!popup || popup.closed) {
        setPendingApprovalLink(approvalLink)
        setPendingSubscriptionId(data.subscriptionId)
        setShowManualLink(true)
        setIsLoading(false)
        return
      }

      const readyDelay = setTimeout(() => { popupReady = true }, 3000)

      const pollTimer = setInterval(async () => {
        try {
          if (popup.closed) {
            clearInterval(pollTimer)
            clearTimeout(readyDelay)
            setIsLoading(false)
            return
          }

          if (!popupReady) return

          const popupUrl = popup.location.href
          if (popupUrl && popupUrl.startsWith(window.location.origin)) {
            clearInterval(pollTimer)
            clearTimeout(readyDelay)
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
        setIsLoading(false)
        onError('Payment window timed out. Please try again.')
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

      setShowManualLink(false)
      setPendingApprovalLink('')
      setPaymentConfirmed(true)
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsLoading(false)
      onSuccess()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment verification failed')
      setIsLoading(false)
    }
  }

  const closeManualLink = () => {
    setShowManualLink(false)
    setPendingApprovalLink('')
  }

  return (
    <>
      {showManualLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-sm w-full mx-4 p-6 rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete Payment on PayPal</h3>
            <p className="text-white/50 text-sm mb-5">
              Your browser blocked the popup. Click the button below to open PayPal directly.
            </p>
            <a
              href={pendingApprovalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#0070ba] hover:bg-[#003087] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-3"
            >
              <ArrowUpRight className="w-4 h-4" />
              Open PayPal
            </a>
            <p className="text-white/30 text-xs">
              After approving on PayPal, click &quot;Check Payment&quot; to verify.
            </p>
            <button
              onClick={() => verifyAndActivate(pendingSubscriptionId)}
              disabled={isLoading}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : 'Check Payment'}
            </button>
            <button
              onClick={closeManualLink}
              className="mt-2 text-white/40 hover:text-white text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <button
        onClick={scriptError ? retryScript : handlePayment}
        disabled={disabled || isLoading || (!isScriptLoaded && !scriptError) || paymentConfirmed}
        className="w-full h-14 rounded-xl bg-[#0070ba] text-white font-bold text-base hover:bg-[#003087] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {upgradeParam ? (
          `Upgrade ${formatDisplayPrice(amount, currency)}/mo`
        ) : paymentConfirmed ? (
          <>
            Payment Confirmed ✓
          </>
        ) : scriptError ? (
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
    </>
  )
}
