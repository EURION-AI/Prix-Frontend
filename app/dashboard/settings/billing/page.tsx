'use client'

import { useEffect, useState } from 'react'
import { Loader2, ArrowLeft, CreditCard, Shield, Zap, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

interface UserData {
  id: number
  username: string
  plan: 'free' | 'pro' | 'max'
}

export default function BillingPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)
      } catch {
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
    setIsLoading(false)
  }, [])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'max':
        return {
          name: 'Max Plan',
          icon: <Crown className="w-10 h-10 text-yellow-400" />,
          description: 'You have unlimited power for enterprise scale. Includes unlimited repositories, custom rule engines, and dedicated support.',
          color: 'bg-yellow-400/10 border-yellow-400/20'
        }
      case 'pro':
        return {
          name: 'Pro Plan',
          icon: <Zap className="w-10 h-10 text-blue-400" />,
          description: 'You are on the Pro plan for active developers. Includes up to 15 repositories, advanced AST analysis, and priority support.',
          color: 'bg-blue-400/10 border-blue-400/20'
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

  const details = getPlanDetails(user.plan)

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Billing & Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Current Subscription
          </h1>
          <p className="text-white/40 text-lg max-w-2xl">
            View your active plan status and explore upgrade options.
          </p>
        </div>

        <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-12 rounded-3xl border ${details.color} mb-8`}>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl shrink-0">
            {details.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{details.name}</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {details.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/#pricing"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            Change Plan
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white/60 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all">
            Update Payment Method
          </button>
        </div>
      </div>
    </main>
  )
}
