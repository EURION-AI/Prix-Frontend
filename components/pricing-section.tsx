'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PRICING } from '@/lib/pricing'

const regionalPricing = {
  IN: { currency: '₹', basePrice: '₹699', proPrice: '₹899', baseOriginal: '₹1399', proOriginal: '₹1799' },
  EU: { currency: '€', basePrice: '€6.99', proPrice: '€9.99', baseOriginal: '€13.99', proOriginal: '€19.99' },
  GB: { currency: '£', basePrice: '£6.99', proPrice: '£9.99', baseOriginal: '£13.99', proOriginal: '£19.99' },
  US: { currency: '$', basePrice: '$6.99', proPrice: '$9.99', baseOriginal: '$13.99', proOriginal: '$19.99' }
}

function detectRegion() {
  if (typeof window === 'undefined') return 'US'

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = navigator.language || 'en-US'

    if (timezone.includes('Asia/Kolkata') || locale.includes('IN')) return 'IN'
    if (timezone.includes('Europe') && !timezone.includes('London')) return 'EU'
    if (timezone.includes('Europe/London') || locale.includes('GB')) return 'GB'
  } catch (e) {
    console.error('Error detecting region:', e)
  }

  return 'US'
}

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
    getPrice: (region: string) => regionalPricing[region as keyof typeof regionalPricing]?.basePrice || '$6.99',
    priceValue: 6.99,
    description: 'For individual developers who want reliable automation.',
    features: ['AI-powered PR reviews (generous usage)', 'Automated PR fixes (generous usage)', 'Private repositories', 'Bug detection (logic + common issues)', 'Security issue detection (SQL injection, XSS, etc.)', 'Basic performance analysis', 'Basic AI issue planning & task breakdowns'],
    getCta: (region: string) => `Subscribe for ${regionalPricing[region as keyof typeof regionalPricing]?.basePrice || '$6.99'}`,
    getHref: (region: string) => `/checkout?plan=starter&region=${region}`,
    popular: false,
    badge: null,
    guarantee: 'No credit card required'
  },
  {
    id: 'pro',
    name: 'Pro',
    getPrice: (region: string) => regionalPricing[region as keyof typeof regionalPricing]?.proPrice || '$9.99',
    priceValue: 9.99,
    description: 'For developers who rely on AI daily for fast, high-quality fixes.',
    features: ['Everything in Starter', 'Unlimited PR reviews', 'Unlimited AI issue planning & task breakdowns' , 'high automated fixes', 'Faster processing (priority queue)', 'Better multi-file context understanding', 'Deeper analysis (bugs, performance, security)'],
    getCta: (region: string) => `Subscribe for ${regionalPricing[region as keyof typeof regionalPricing]?.proPrice || '$9.99'}`,
    getHref: (region: string) => `/checkout?plan=pro&region=${region}`,
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

export function PricingSection() {
  const [region, setRegion] = useState('US')

  useEffect(() => {
    setRegion(detectRegion())
  }, [])

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const displayPrice = plan.getPrice ? plan.getPrice(region) : plan.price
            const displayCta = plan.getCta ? plan.getCta(region) : plan.cta
            const displayHref = plan.getHref ? plan.getHref(region) : plan.href
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 1 }}
                className={`relative flex flex-col p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:border-white/20 hover:-translate-y-1 will-change-transform ${plan.popular ? 'border-primary/50 bg-primary/5 shadow-[0_0_40px_rgba(236,72,153,0.08)]' : 'border-white/[0.08] bg-white/[0.02]'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-10">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">{displayPrice}</span>
                    {plan.price !== 'Free' && (
                      <span className="text-white/40 text-sm">/month</span>
                    )}
                    {plan.price === 'Free' && (
                      <span className="text-white/40 text-sm">forever</span>
                    )}
                  </div>
                  <p className="text-white/50 text-base leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-5 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/60'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-base text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  asChild
                  className={`w-full h-12 lg:h-14 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 ${plan.popular ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' : 'bg-white text-black hover:bg-white/90 shadow-lg'}`}
                >
                  <Link href={displayHref}>{displayCta}</Link>
                </Button>
                
                <div className="mt-4 flex flex-col items-center gap-2">
                  {plan.price !== 'Free' ? (
                    <Link 
                      href="/affiliate" 
                      className="px-4 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 text-[10px] font-bold text-green-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 uppercase tracking-widest"
                    >
                      Earn Free via Affiliate
                    </Link>
                  ) : (
                    <div className="h-[14px]" /> // Spacer to keep buttons aligned
                  )}
                  
                  <p className="text-center text-white/30 text-xs">
                    {plan.guarantee}
                  </p>
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
        </motion.div>
      </div>
    </section>
  )
}