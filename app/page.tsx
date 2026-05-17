import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { ComparisonSection } from '@/components/comparison-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { HomePageClient } from '@/components/home-page-client'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.prixai.xyz',
    types: {
      'text/markdown': '/markdown',
    },
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="relative z-10">
        <h1 className="sr-only">AI Code Review That Ships Fixed Code — Every PR. Every Time.</h1>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <Suspense fallback={null}>
          <HomePageClient />
        </Suspense>
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
