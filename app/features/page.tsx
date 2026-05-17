import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { FeaturesSection } from '@/components/features-section'
import { ComparisonSection } from '@/components/comparison-section'
import { TechnicalSection } from '@/components/technical-section'
import { SecuritySection } from '@/components/security-section'

import { HowItWorksSection } from '@/components/how-it-works-section'
import { VisionSection } from '@/components/vision-section'
import { DiffScreenshot, SummaryScreenshot } from '@/components/github-screenshots'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Code Review Features | Prix AI — Automated PR Analysis & Fix Generation',
  description: 'AI-powered code review with automatic bug detection, security scanning, and PR fix generation. Seamless GitHub integration with automatic PR analysis.',
  alternates: {
    canonical: 'https://www.prixai.xyz/features',
    types: {
      'text/markdown': '/markdown/features',
    },
  },
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-32 pb-20 section-container text-center">
        <h1 className="section-title mb-6">
          Engineered for<br />
          <span className="text-white">velocity.</span>
        </h1>
        <p className="section-subtitle mx-auto mb-10">
          The platform that fixes, plans, and accelerates your workflow. Ship code faster with fixes, implementation plans, and actionable engineering steps built into your development process.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base transition-colors">
            <Link href="/login">Get Started for Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-base transition-colors">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>

      <FeaturesSection hideHeader={true} />
      <HowItWorksSection />
      <ComparisonSection />

      <section className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
        <div className="w-full max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-title text-3xl md:text-5xl mb-4 max-w-2xl">
            See it in action
          </h2>
          <p className="section-subtitle mb-16 max-w-xl">
            Real outputs from Prix reviewing actual pull requests.
          </p>

          <div className="mb-24">
            <h3 className="text-lg font-semibold text-white mb-2">Opens fixes automatically</h3>
            <p className="text-white/40 text-sm mb-6 max-w-lg">
              When Prix finds a fixable issue, it creates a new pull request with the suggested change.
            </p>
            <DiffScreenshot />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Handles large pull requests</h3>
            <p className="text-white/40 text-sm mb-6 max-w-lg">
              Prix reviews multi-file changes across your entire repository.
            </p>
            <SummaryScreenshot />
          </div>
        </div>
      </section>

      <TechnicalSection />
      <SecuritySection />
      <VisionSection />
      <div className="py-20 text-center border-t border-white/[0.03] bg-[#0a0a0f]">
        <h3 className="text-white text-2xl font-bold mb-6">Ready to accelerate?</h3>
        <Button size="lg" asChild className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold">
          <Link href="/login">Start Free Trial</Link>
        </Button>
      </div>
      <CTASection />
      <Footer />
    </main>
  )
}
