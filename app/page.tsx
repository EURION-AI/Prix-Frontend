'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { ComparisonSection } from '@/components/comparison-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { getUserRegion } from '@/lib/pricing'

export default function Home() {
  const searchParams = useSearchParams()
  const region = getUserRegion(searchParams.get('region'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection region={region} />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}