'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, ArrowLeft, Loader2 } from 'lucide-react'

function CancelContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-white/40" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Cancelled
        </h1>
        <p className="text-white/50 text-sm">
          No worries! Your payment was not processed.
          You can still explore Prix with our free tier.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/checkout"
          className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          Try Again
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

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Suspense fallback={<LoadingFallback />}>
        <CancelContent />
      </Suspense>
    </div>
  )
}