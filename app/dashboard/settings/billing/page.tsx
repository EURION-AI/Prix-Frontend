'use client'

import { useEffect, useState } from 'react'
import { Loader2, ArrowLeft, Check, CreditCard, Shield, Zap, Crown } from 'lucide-react'
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

  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: '$0',
      description: 'Perfect for exploring Prix intelligence.',
      icon: <Shield className="w-6 h-6 text-white/40" />,
      features: ['Up to 5 repositories', 'Basic PR analysis', 'Community support'],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Pro',
      id: 'pro',
      price: '$29',
      period: '/mo',
      description: 'For active developers and small teams.',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      features: ['Up to 15 repositories', 'Advanced AST analysis', 'Priority support', 'Faster processing'],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Max',
      id: 'max',
      price: '$99',
      period: '/mo',
      description: 'Unlimited power for enterprise scale.',
      icon: <Crown className="w-6 h-6 text-yellow-400" />,
      features: ['Unlimited repositories', 'Custom rule engines', 'Dedicated account manager', 'SLA guarantees'],
      cta: 'Upgrade to Max',
      popular: false,
    }
  ]

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
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
            Manage Subscription
          </h1>
          <p className="text-white/40 text-lg max-w-2xl">
            You are currently on the <strong className="text-white capitalize">{user.plan}</strong> plan. Upgrade to unlock more repositories and advanced AI features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
                plan.popular 
                  ? 'bg-primary/5 border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              } ${user.plan === plan.id ? 'ring-2 ring-white/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${plan.popular ? 'bg-primary/20' : 'bg-white/5'}`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {user.plan === plan.id && (
                    <span className="text-xs text-white/40 font-mono">Active Plan</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className="text-white/40">{plan.period}</span>}
              </div>

              <p className="text-white/40 mb-8 flex-1">{plan.description}</p>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-white/40'}`} />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                disabled={user.plan === plan.id}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  user.plan === plan.id
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]'
                      : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {user.plan === plan.id ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
