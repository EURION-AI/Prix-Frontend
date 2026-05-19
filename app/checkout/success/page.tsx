'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const subscriptionId = searchParams.get('subscription_id')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(subscriptionId ? 'verifying' : 'success')
  const [errorMsg, setErrorMsg] = useState('')

  const planName = plan === 'starter' ? 'Starter' : plan === 'pro' ? 'Pro' : null

  useEffect(() => {
    if (!subscriptionId) return

    async function verifyPayment() {
      try {
        const res = await fetch('/api/paypal/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription_id: subscriptionId, plan }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Verification failed')
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Verification failed')
      }
    }
    verifyPayment()
  }, [subscriptionId, plan])

  if (status === 'verifying') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <p className="text-white/50 text-sm">Verifying your payment...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Verification Pending
          </h1>
          <p className="text-white/50 text-sm mb-4">
            {errorMsg}
          </p>
          <p className="text-white/30 text-xs">
            Your payment was received but activation is taking longer than expected.
            Go to your dashboard and try refreshing.
          </p>
        </div>
        <Link
          href="/dashboard?refresh=true"
          className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Successful!
        </h1>
        <p className="text-white/50 text-sm">
          Thank you for subscribing to Prix{planName ? ` ${planName}` : ''}.
          Your account has been upgraded.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/dashboard?refresh=true"
          className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Suspense fallback={<LoadingFallback />}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}