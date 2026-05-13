'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Shield, Clock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getUserRegion, formatPrice, UPGRADE_PRICE, type Region, type Plan } from '@/lib/pricing'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    priceValue: 0,
    description: 'Perfect for trying out AI-powered code fixes.',
    features: ['5 PR fixes / month', 'Public repositories', 'GitHub integration'],
    cta: 'Get Started for Free',
    href: '/login',
    popular: false,
    badge: null,
    guarantee: 'No credit card required'
  },
    {
    id: 'starter',
    name: 'Starter',
    getPrice: (region: Region) => formatPrice(region, 'starter'),
    getOriginalPrice: (region: Region) => {
      if (region === 'IN') return '₹10'
      if (region === 'GB') return '£14'
      if (region === 'EU') return '€14'
      return '$14'
    },
    priceValue: 5,
    description: 'For individual developers who want reliable automation.',
    features: ['AI-powered PR reviews (generous usage)', 'Automated PR fixes (generous usage)', 'Private repositories', 'Bug detection (logic + common issues)', 'Security issue detection (SQL injection, XSS, etc.)', 'Basic performance analysis', 'Basic AI issue planning & task breakdowns'],
    getCta: (region: Region) => `Subscribe for ${formatPrice(region, 'starter')}`,
    getHref: (region: Region) => `/checkout?plan=starter&region=${region}`,
    popular: false,
    badge: null,
    guarantee: 'No credit card required'
  },
  {
    id: 'pro',
    name: 'Pro',
    getPrice: (region: Region) => formatPrice(region, 'pro'),
    getOriginalPrice: (region: Region) => {
      if (region === 'IN') return '₹20'
      if (region === 'GB') return '£19'
      if (region === 'EU') return '€19'
      return '$19'
    },
    priceValue: 10,
    description: 'For developers who rely on AI daily for fast, high-quality fixes.',
    features: ['Everything in Starter', 'Unlimited PR reviews', 'Unlimited AI issue planning & task breakdowns' , 'high automated fixes', 'Faster processing (priority queue)', 'Better multi-file context understanding', 'Deeper analysis (bugs, performance, security)'],
    getCta: (region: Region) => `Subscribe for ${formatPrice(region, 'pro')}`,
    getHref: (region: Region) => `/checkout?plan=pro&region=${region}`,
    popular: true,
    badge: 'Most Popular',
    guarantee: 'No credit card required'
  }
]

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2026-06-07T23:59:59')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
      <Clock className="w-4 h-4 text-green-400" />
      <span className="text-green-400 text-sm font-medium">
        Launch special: 50% off • Ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  )
}

export function PricingSection({ region: initialRegion = 'US' }: { region?: Region }) {
  const searchParams = useSearchParams()
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
      <section id="pricing" className="py-20 lg:py-24 bg-background relative border-t border-white/[0.03]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-12 lg:mb-16 text-center">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-white/10 rounded-full mb-8"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 lg:py-24 bg-background relative border-t border-white/[0.03]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-12 lg:mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
            05 — Investment
          </span>
          <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Simple, transparent<br />
            <span className="text-gradient-vibrant">pricing.</span>
          </h2>
          <p className="text-white/50 text-lg lg:text-xl max-w-xl mb-8">
            Start free. Upgrade when you need unlimited fixes and planning. No hidden fees.
          </p>
          <CountdownTimer />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const isOwner = userPlan === plan.id
            const isStarterOnPro = userPlan === 'starter' && plan.id === 'pro'
            const isProOnStarter = userPlan === 'pro' && plan.id === 'starter'
            const isLocked = isOwner || isProOnStarter
            const isUpgrade = isStarterOnPro

            let displayPrice: string
            let displayCta: string
            let displayHref: string
            let disabled = false

            if (plan.id === 'free') {
              displayPrice = 'Free'
              displayCta = userPlan ? 'Free Forever' : 'Get Started for Free'
              displayHref = userPlan ? '#' : '/login'
              disabled = !!userPlan
            } else if (isLocked) {
              displayPrice = plan.getPrice ? plan.getPrice(region) : plan.price
              displayCta = isProOnStarter ? 'Already on Pro' : 'Already Purchased'
              displayHref = '#'
              disabled = true
            } else if (isUpgrade) {
              displayPrice = UPGRADE_PRICE[region] || '$2.99'
              displayCta = `Upgrade for ${displayPrice}`
              displayHref = `/checkout?plan=pro&region=${region}&upgrade=true`
            } else {
              displayPrice = plan.getPrice ? plan.getPrice(region) : plan.price
              displayCta = plan.getCta ? plan.getCta(region) : plan.cta
              displayHref = plan.getHref ? plan.getHref(region) : plan.href
            }
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 1 }}
                className={`relative flex flex-col p-8 lg:p-10 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 shadow-[0_20_60px_rgba(236,72,153,0.15)] ring-2 ring-primary/30' 
                    : 'border-white/[0.12] bg-white/[0.03] hover:border-white/[0.20] hover:bg-white/[0.05]'
                }`}
              >
                {plan.badge && !isLocked && !isUpgrade && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/40">
                    {plan.badge}
                  </div>
                )}

                {/* Plan Name & Tagline */}
                <div className="mb-6">
                  <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${plan.popular ? 'text-primary' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className="text-base lg:text-lg text-white/70 font-light leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    {plan.getOriginalPrice && !isLocked && !isUpgrade && (
                      <span className="text-xl lg:text-2xl font-light text-white/30 line-through">
                        {plan.getOriginalPrice(region)}
                      </span>
                    )}
                    <span className={`text-3xl lg:text-4xl font-bold tracking-tight ${plan.popular && !disabled ? 'text-primary' : 'text-white'}`}>
                      {isLocked ? (
                        <span className="flex items-center gap-2">
                          <Crown className="w-6 h-6 text-yellow-400" />
                          {isProOnStarter ? 'Active' : 'Active'}
                        </span>
                      ) : (
                        displayPrice
                      )}
                    </span>
                    {plan.price !== 'Free' && !isLocked && (
                      <span className="text-white/50 text-base font-light">/month</span>
                    )}
                  </div>
                  {plan.price === 'Free' && (
                    <span className="text-white/50 text-base font-light">Forever</span>
                  )}
                  {isLocked && (
                    <span className="text-green-400 text-xs font-bold block mt-1">{isProOnStarter ? 'Included in Pro' : '✓ Current Plan'}</span>
                  )}
                  {isUpgrade && (() => {
                    const fullPro = parseFloat(formatPrice(region, 'pro').replace(/[^0-9.]/g, ''))
                    const upgradeVal = parseFloat((UPGRADE_PRICE[region] || '$2.99').replace(/[^0-9.]/g, ''))
                    const savedPct = fullPro > 0 ? Math.round((1 - upgradeVal / fullPro) * 100) : 0
                    return <span className="text-primary text-xs font-bold block mt-1">Save {savedPct}% vs monthly</span>
                  })()}
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      </div>
                      <span className={`text-xs lg:text-sm ${plan.popular ? 'text-white/90' : 'text-white/60'} font-light leading-tight`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  {disabled ? (
                    <div className="w-full h-12 lg:h-14 rounded-xl font-bold text-base lg:text-lg flex items-center justify-center bg-white/5 text-white/40 border border-white/10 cursor-not-allowed">
                      {displayCta}
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      asChild
                      className={`w-full h-12 lg:h-14 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 ${
                        plan.popular || isUpgrade
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' 
                          : 'bg-white text-black hover:bg-white/90 shadow-lg'
                      }`}
                    >
                      <Link href={displayHref}>{displayCta}</Link>
                    </Button>
                  )}
                  
                  <div className="mt-4 flex flex-col items-center gap-2">
                    {plan.price !== 'Free' && !isLocked ? (
                      <Link 
                        href="/affiliate" 
                      className="px-4 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 text-[10px] font-bold text-green-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 uppercase tracking-widest"
                      >
                        Earn Free via Affiliate
                      </Link>
                    ) : (
                      <div className="h-[14px]" />
                    )}
                    
                    <p className="text-center text-white/30 text-xs">
                      {plan.guarantee}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 items-center text-sm text-white/40"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Enterprise-grade security</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>GDPR Compliant</span>
          </div>
          <span>•</span>
          <span>Founded in 2026</span>
          <span>•</span>
          <a
            href="mailto:support@prixai.xyz"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            support@prixai.xyz
          </a>
        </motion.div>
      </div>
    </section>
  )
}
