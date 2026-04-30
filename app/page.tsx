'use client'

import { useEffect, useState } from 'react'
import { Loader2, Copy, Check, Users, Gift, Star, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { AffiliateStatsSkeleton } from '@/components/skeleton'
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
  return <LandingPage />
}