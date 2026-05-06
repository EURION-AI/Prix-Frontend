'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Loader2, Check, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { RazorpayCheckoutButton } from '@/components/razorpay-checkout'
import { PRICING } from '@/lib/pricing'

interface PlanInfo {
  id: string
  name: string
  price: string
  pricePaise: number
  features: string[]
}

const PLAN_DETAILS: Record<string, PlanInfo> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: '₹699/mo',
    pricePaise: 69900,
    features: [
      'AI-powered PR reviews (generous usage)',
      'Automated PR fixes (generous usage)',
      'Private repositories',
      'Bug detection (logic + common issues)',
      'Security issue detection',
      'Basic performance analysis',
      'Basic AI issue planning'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '₹899/mo',
    pricePaise: 89900,
    features: [
      'Everything in Starter',
      'Unlimited PR reviews',
      'Unlimited AI issue planning',
      'High automated fixes',
      'Faster processing (priority queue)',
      'Better multi-file context understanding',
      'Deeper analysis (bugs, performance, security)'
    ]
  }
}

function getPlanPricing(plan: string, region: string) {
  const pricing = PRICING[region as keyof typeof PRICING] || PRICING.IN
  return pricing[plan as keyof typeof pricing] || pricing.starter
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = (searchParams.get('plan') || 'starter') as 'starter' | 'pro'
  const region = searchParams.get('region') || 'IN'

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS.starter
  const planPricing = getPlanPricing(planId, region)
  const displayPrice = `${planPricing.currency === 'INR' ? '₹' : planPricing.currency === 'USD' ? '$' : planPricing.currency === 'GBP' ? '£' : '€'}${(planPricing.price / (planPricing.currency === 'INR' ? 100 : 100)).toFixed(2)}/mo`
  const displayPricePaise = planPricing.price

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/user')
        if (response.ok) {
          const data = await response.json()
          setUserId(String(data.user.id))
          setUserName(data.user.name || data.user.username || '')
          setUserEmail(data.user.email || '')
        } else {
          setUserId('anonymous')
        }
      } catch {
        setUserId('anonymous')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleSuccess = () => {
    router.push('/dashboard?refresh=true')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <p className="text-white/50 text-sm">Preparing checkout...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 text-center">
          Subscribe to {plan.name}
        </h1>
        <p className="text-white/50 text-sm text-center">
          You&apos;re one step away from unlocking {plan.name === 'Pro' ? 'unlimited' : 'enhanced'} AI-powered code reviews.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">{plan.name} Plan</h3>
            <p className="text-white/40 text-sm">Monthly subscription</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{plan.price}</span>
          </div>
        </div>

        <ul className="space-y-4 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-white/70 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <RazorpayCheckoutButton
          plan={planId}
          amount={displayPricePaise}
          currency={planPricing.currency === 'INR' ? '₹' : planPricing.currency === 'USD' ? '$' : planPricing.currency === 'GBP' ? '£' : '€'}
          userId={userId}
          region={region}
          userName={userName}
          userEmail={userEmail}
          onSuccess={handleSuccess}
          onError={handleError}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span>Secure payment powered by Razorpay</span>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </Link>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-lg text-center">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Suspense fallback={<LoadingFallback />}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}