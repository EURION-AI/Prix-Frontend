'use client'

import { useEffect, useState } from 'react'
import { Loader2, ArrowLeft, CreditCard, Shield, Zap, Crown, ArrowRight, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import type { Plan } from '@/lib/user-store'
import { getUserRegion, formatPrice, getCurrencySymbol, UPGRADE_PRICE, type Region } from '@/lib/pricing'

interface UserData {
  id: number
  username: string
  plan: Plan
}

interface UpgradeOption {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  icon: React.ReactNode
  color: string
  popular?: boolean
}

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [region, setRegion] = useState<Region>('US')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const forcedRegion = searchParams.get('region')
    setRegion(getUserRegion(forcedRegion))

    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/user')
        if (!response.ok) {
          window.location.href = '/login'
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch {
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [searchParams])

  const handleUpgrade = (targetPlan: string) => {
    if (targetPlan === 'pro-upgrade') {
      // Special $2 upgrade for Starter users to Pro
      window.location.href = `/checkout?plan=pro&region=${region}&upgrade=starter_to_pro&discount=2`
    } else {
      window.location.href = `/checkout?plan=${targetPlan}&region=${region}`
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const currency = getCurrencySymbol(region)
  const currentPlanDetails = getPlanDetails(user.plan, region)

  const upgradeOptions = getUpgradeOptions(user.plan, region)

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Dashboard
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Billing & Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {user.plan === 'free' ? 'Upgrade Your Plan' : 'Manage Subscription'}
          </h1>
          <p className="text-white/40 text-lg max-w-2xl">
            {user.plan === 'free'
              ? 'Choose a plan that fits your needs and unlock more power.'
              : 'View your current plan and explore upgrade options.'}
          </p>
        </div>

        <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-12 rounded-3xl border ${currentPlanDetails.color} mb-8`}>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl shrink-0">
            {currentPlanDetails.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{currentPlanDetails.name}</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {currentPlanDetails.description}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5" />
            <p>{successMessage}</p>
          </div>
        )}

        {upgradeOptions.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white/80">
              {user.plan === 'free' ? 'Available Plans' : 'Upgrade Options'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgradeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative p-6 rounded-2xl border transition-all hover:-translate-y-1 ${option.color}`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
                      Recommended
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/5">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-1">{option.name}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">{option.price}</span>
                        <span className="text-white/40 text-sm">/month</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm mb-4">{option.description}</p>
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(option.id)}
                    disabled={isUpgrading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {user.plan === 'free' ? 'Subscribe Now' : 'Upgrade'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          user.plan === 'pro' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">You're on the Pro Plan!</h3>
            <p className="text-white/50">You have full access to all PRIX features and unlimited consumption.</p>
          </div>
          )
        )}

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              Need to manage your subscription or cancel?
            </p>
            <a
              href="mailto:support@prixai.xyz"
              className="px-6 py-3 bg-white/5 text-white/60 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

function getPlanDetails(plan: string, region: Region) {
  switch (plan) {
    case 'pro':
      return {
        name: 'Pro Plan',
        icon: <Crown className="w-10 h-10 text-yellow-400" />,
        description: 'You are on the Pro plan for active developers. Includes unlimited repositories, advanced AST analysis, and priority support.',
        color: 'bg-yellow-400/10 border-yellow-400/20'
      }
    case 'starter':
      return {
        name: 'Starter Plan',
        icon: <Zap className="w-10 h-10 text-green-400" />,
        description: 'You are on the Starter plan. Includes unlimited repositories, AI-powered PR reviews, and automated fixes.',
        color: 'bg-green-400/10 border-green-400/20'
      }
    default:
      return {
        name: 'Free Plan',
        icon: <Shield className="w-10 h-10 text-white/40" />,
        description: 'You are on the Free plan. Includes up to 5 repositories and basic PR analysis. Upgrade to unlock more power.',
        color: 'bg-white/5 border-white/10'
      }
  }
}

function getUpgradeOptions(currentPlan: string, region: Region): UpgradeOption[] {
  const currency = getCurrencySymbol(region)
  const starterPrice = formatPrice(region, 'starter')
  const proPrice = formatPrice(region, 'pro')

  if (currentPlan === 'pro') return []

  if (currentPlan === 'starter') {
    return [
      {
        id: 'pro-upgrade',
        name: 'Upgrade to Pro',
        price: UPGRADE_PRICE[region] || '$2.99',
        description: 'Special upgrade price for existing Starter users.',
        features: [
          'Everything in Starter',
          'Unlimited PR reviews',
          'Unlimited AI issue planning',
          'Priority processing queue',
          'Better multi-file context',
          'Deeper bug & security analysis'
        ],
        icon: <Crown className="w-6 h-6 text-yellow-400" />,
        color: 'border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/50',
        popular: true
      }
    ]
  }

    return [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: starterPrice,
      description: 'Perfect for individual developers wanting reliable automation.',
      features: [
        'Unlimited repositories',
        'AI-powered PR reviews',
        'Automated PR fixes',
        'Private repositories',
        'Bug & security detection',
        'Basic AI planning'
      ],
      icon: <Zap className="w-6 h-6 text-green-400" />,
      color: 'border-white/20 bg-white/5 hover:border-white/30'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: proPrice,
      description: 'For developers who rely on AI daily for fast, high-quality fixes.',
      features: [
        'Everything in Starter',
        'Unlimited PR reviews',
        'Unlimited AI issue planning',
        'Priority processing queue',
        'Better multi-file context',
        'Deeper bug & security analysis'
      ],
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      color: 'border-primary/30 bg-primary/5 hover:border-primary/50',
      popular: true
    }
  ]
}
