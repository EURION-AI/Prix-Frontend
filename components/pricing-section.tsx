'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getUserRegion, formatPrice, UPGRADE_PRICE, type Region } from '@/lib/pricing'
import { Check, X, Info } from '@phosphor-icons/react'

interface PlanFeature {
  text: string
  available: boolean
  subtext?: string
  tooltip?: string
}

interface Plan {
  id: string
  name: string
  price?: string
  getPrice?: (region: Region) => string
  priceValue: number
  description: string
  features: PlanFeature[]
  cta?: string
  getCta?: (region: Region) => string
  href?: string
  getHref?: (region: Region) => string
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    priceValue: 0,
    description: 'Ideal for individuals and open-source hobbyists.',
    features: [
      { text: '15 PR reviews / month', available: true },
      { text: '3 AI issue plans / month', available: true },
      { text: '3 Auto-fixes / month', available: true },
      { text: '1k lines of change limit (per PR)', available: true },
      { text: 'Public repositories only', available: true },
      { text: 'Private Repository support', available: false, subtext: 'No support for large PRs' },
      { text: 'Deep multi-file analysis', available: false },
      { text: 'Advanced security scanning', available: false },
      { text: 'Standard queue processing (Slower)', available: false }
    ],
    cta: 'Get Started for Free',
    href: '/login',
  },
  {
    id: 'starter',
    name: 'Starter',
    getPrice: (region: Region) => formatPrice(region, 'starter'),
    priceValue: 5,
    description: 'Perfect for freelancers and growing indie-developers.',
    features: [
      { text: '400 combined reviews & fixes / month (Huge upgrade!)', available: true },
      { text: '50 AI issue plans / month', available: true },
      { text: 'Private repositories supported', available: true },
      { text: 'Up to 7,000 lines per PR', available: true },
      { text: 'Core Bug Detection (Logic flaws & common issues)', available: true },
      { text: 'Essential Security Scanning (SQL injection, XSS, etc.)', available: true },
      { text: 'Deep multi-file analysis (Single-file focus)', available: false },
      { text: 'Standard queue processing', available: false },
      { text: 'Support for large PRs', available: false }
    ],
    getCta: (region: Region) => `Subscribe for ${formatPrice(region, 'starter')}`,
    getHref: (region: Region) => `/checkout?plan=starter&region=${region}`,
  },
  {
    id: 'pro',
    name: 'Pro',
    getPrice: (region: Region) => formatPrice(region, 'pro'),
    priceValue: 10,
    description: 'Built for power users, professionals, and fast-moving teams.',
    features: [
      { text: '700 combined reviews & fixes / month', available: true },
      { text: '300 AI issue plans / month', available: true },
      { text: 'Private repositories supported', available: true },
      { text: 'Large PRs supported', available: true, tooltip: 'Max 15k lines, 75 large PRs' },
      { text: 'Priority Queue Processing (Sub-second, instant reviews)', available: true },
      { text: 'Deeper Multi-File Analysis (Understands codebase context)', available: true },
      { text: 'Advanced Bug & Security Guard (Full repo-level scanning)', available: true }
    ],
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
              displayPrice = plan.getPrice ? plan.getPrice(region) : (plan.price || '')
              displayCta = isProOnStarter ? 'Already on Pro' : 'Already Purchased'
              displayHref = '#'
              disabled = true
            } else if (isUpgrade) {
              displayPrice = UPGRADE_PRICE[region] || '$2.99'
              displayCta = 'Upgrade to Pro'
              displayHref = appendRef(`/checkout?plan=pro&region=${region}&upgrade=true`)
            } else {
              displayPrice = plan.getPrice ? plan.getPrice(region) : (plan.price || '')
              displayCta = plan.getCta ? plan.getCta(region) : (plan.cta || '')
              displayHref = plan.getHref ? appendRef(plan.getHref(region)) : (plan.href || '')
            }

            return (
              <div
                key={index}
                className={`relative flex flex-col p-4 md:p-5 lg:p-6 rounded-lg border ${
                  isPro ? 'border-primary/50 bg-[#161622] shadow-[0_0_30px_rgba(var(--primary-rgb),0.12)]' : 'border-white/[0.12] bg-[#0e0e14]'
                } ${disabled ? 'opacity-70' : ''}`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    Most popular
                  </div>
                )}

                <div className="mb-3 md:mb-4">
                  <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-1.5 ${isPro ? 'text-primary' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-white/50 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4 md:mb-5">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isPro && !disabled ? 'text-primary' : 'text-white'}`}>
                      {displayPrice}
                    </span>
                    {plan.price !== 'Free' && !isLocked && (
                      <span className="text-white/50 text-xs md:text-sm font-light">/month</span>
                    )}
                  </div>
                  {plan.price === 'Free' && (
                    <span className="text-white/50 text-xs md:text-sm font-light">Forever</span>
                  )}
                  {isLocked && (
                    <span className="text-green-400 text-[10px] font-bold block mt-1">{isProOnStarter ? 'Included in Pro' : 'Current Plan'}</span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-[2px] shrink-0">
                        {feature.available ? (
                          <Check size={18} weight="bold" className="text-green-500" />
                        ) : (
                          <X size={18} weight="bold" className="text-[#ff1a75]" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs lg:text-sm font-medium ${
                            !feature.available 
                              ? 'text-white/30 line-through' 
                              : isPro ? 'text-white/90' : 'text-white/70'
                          } leading-tight`}>
                            {feature.text}
                          </span>
                          {feature.tooltip && (
                            <div className="group relative flex items-center">
                              <Info size={16} weight="regular" className="text-white/50 hover:text-white/80 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 border border-white/10 rounded-md text-[10px] text-white/90 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                {feature.tooltip}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                              </div>
                            </div>
                          )}
                        </div>
                        {feature.subtext && (
                          <span className={`text-[10px] mt-1 ${
                            !feature.available ? 'text-white/20' : 'text-white/40'
                          }`}>
                            {feature.subtext}
                          </span>
                        )}
                      </div>
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

                  {plan.id !== 'free' && !isLocked && (
                    <Link
                      href="/affiliate"
                      className="mt-3 inline-block w-full text-center text-[11px] font-semibold text-green-400 hover:text-green-300 transition-colors"
                    >
                      Earn for free →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
