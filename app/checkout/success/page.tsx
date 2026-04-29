'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const plan = searchParams.get('plan')

  const planName = plan === 'basic' ? 'Basic' : plan === 'advanced' ? 'Advanced' : null

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

      {sessionId && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Session ID</p>
          <p className="text-white/60 text-sm font-mono">{sessionId}</p>
        </div>
      )}

      <div className="space-y-4">
        <Link
          href="/"
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