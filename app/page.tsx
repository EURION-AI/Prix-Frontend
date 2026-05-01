'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { ComparisonSection } from '@/components/comparison-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/pricing'
    }
  }, [])

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-white/20 mt-4 animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Authenticating...</p>
      </div>
    )
  }

  return <LandingPage />
}