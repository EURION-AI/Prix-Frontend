'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getUserRegion, formatPrice, type Region } from '@/lib/pricing'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    priceValue: 0,
    description: '15 PR reviews/month, public repos only.',
    features: ['15 PR reviews / month', '3 AI issue plans / month', '3 auto fixes / month', 'Public repositories', 'GitHub integration'],
    cta: 'Get Started for Free',
    href: '/login',
  },
  {
    id: 'starter',
    name: 'Starter',
    getPrice: (region: Region) => formatPrice(region, 'starter'),
    priceValue: 5,
    description: '400 combined reviews & fixes/month, private repos.',
    features: ['400 combined reviews & fixes / month', '50 issue plans / month', 'Private repositories', 'Bug detection (logic + common issues)', 'Security scanning (SQL injection, XSS, etc.)'],
    getCta: (region: Region) => `Subscribe for ${formatPrice(region, 'starter')}`,
    getHref: (region: Region) => `/checkout?plan=starter&region=${region}`,
  },
  {
    id: 'pro',
    name: 'Pro',
    getPrice: (region: Region) => formatPrice(region, 'pro'),
    priceValue: 10,
    description: 'Unlimited reviews, priority processing.',
    features: ['Unlimited PR reviews', 'Unlimited auto-fixes', 'Unlimited issue plans', 'Priority queue processing', 'Deeper multi-file analysis'],
    getCta: (region: Region) => `Subscribe for ${formatPrice(region, 'pro')}`,
    getHref: (region: Region) => `/checkout?plan=pro&region=${region}`,
  },
]

export function PricingSection({ region: initialRegion = 'US' }: { region?: Region }) {
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const [region, setRegion] = useState<Region>(initialRegion)
  const [mounted, setMounted] = useState(false)
  const [userPlan, setUserPlan] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const forcedRegion = searchParams.get('region')
    setRegion(getUserRegion(forcedRegion) || initialRegion)

    fetch('/api/auth/user')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.user?.plan) setUserPlan(data.user.plan) })
      .catch(() => {})
  }, [searchParams, initialRegion])

  if (!mounted) {
    return (
      <section id="pricing" className="py-20 lg:py-24 bg-[#0a0a0f] border-t border-white/[0.03]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-12 lg:mb-16 text-center">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-white/10 rounded-full mb-8" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 lg:py-24 bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl">
            Start free. Upgrade when you need unlimited fixes and planning. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const isOwner = userPlan === plan.id
            const isStarterOnPro = userPlan === 'starter' && plan.id === 'pro'
            const isProOnStarter = userPlan === 'pro' && plan.id === 'starter'
            const isLocked = isOwner || isProOnStarter
            const isUpgrade = isStarterOnPro
            const isPro = plan.id === 'pro'

            const appendRef = (href: string) => refCode ? `${href}&ref=${refCode}` : href

            let displayPrice: string
            let displayCta: string
            let displayHref: string
            let disabled = false

            if (plan.id === 'free') {
              displayPrice = 'Free'
              displayCta = userPlan ? 'Free Forever' : 'Get Started for Free'
              displayHref = userPlan ? '#' : (refCode ? `/login?ref=${refCode}` : '/login')
              disabled = !!userPlan
            } else if (isLocked) {
              displayPrice = plan.getPrice ? plan.getPrice(region) : plan.price
              displayCta = isProOnStarter ? 'Already on Pro' : 'Already Purchased'
              displayHref = '#'
              disabled = true
            } else if (isUpgrade) {
              displayPrice = plan.getPrice ? plan.getPrice(region) : ''
              displayCta = 'Upgrade'
              displayHref = appendRef(`/checkout?plan=pro&region=${region}&upgrade=true`)
            } else {
              displayPrice = plan.getPrice ? plan.getPrice(region) : plan.price
              displayCta = plan.getCta ? plan.getCta(region) : plan.cta
              displayHref = plan.getHref ? appendRef(plan.getHref(region)) : plan.href
            }

            return (
              <div
                key={index}
                className={`relative flex flex-col p-5 md:p-8 lg:p-10 rounded-lg border ${
                  isPro ? 'border-primary/30 bg-[#121218]' : 'border-white/[0.08] bg-[#0a0a0f]'
                } ${disabled ? 'opacity-70' : ''}`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    Most popular
                  </div>
                )}

                <div className="mb-4 md:mb-6">
                  <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 ${isPro ? 'text-primary' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg text-white/50 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-5 md:mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isPro && !disabled ? 'text-primary' : 'text-white'}`}>
                      {displayPrice}
                    </span>
                    {plan.price !== 'Free' && !isLocked && (
                      <span className="text-white/50 text-sm md:text-base font-light">/month</span>
                    )}
                  </div>
                  {plan.price === 'Free' && (
                    <span className="text-white/50 text-sm md:text-base font-light">Forever</span>
                  )}
                  {isLocked && (
                    <span className="text-green-400 text-xs font-bold block mt-1">{isProOnStarter ? 'Included in Pro' : 'Current Plan'}</span>
                  )}
                </div>

                <div className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-zinc-500 mt-[3px] shrink-0">·</span>
                      <span className={`text-xs lg:text-sm ${isPro ? 'text-white/80' : 'text-white/50'} leading-tight`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {disabled ? (
                    <div className="w-full h-12 lg:h-14 rounded-lg font-bold text-base lg:text-lg flex items-center justify-center bg-white/5 text-white/40 border border-white/10 cursor-not-allowed">
                      {displayCta}
                    </div>
                  ) : (
                    <Link
                      href={displayHref}
                      className={`w-full h-12 lg:h-14 rounded-lg font-bold text-base lg:text-lg flex items-center justify-center transition-colors ${
                        isPro || isUpgrade
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-white text-black hover:bg-white/90'
                      }`}
                    >
                      {displayCta}
                    </Link>
                  )}

                  <p className="text-center text-white/30 text-xs mt-2">
                    {plan.id === 'free' ? 'No credit card required' : 'Cancel anytime'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
