import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { FeaturesSection } from '@/components/features-section'
import { ComparisonSection } from '@/components/comparison-section'
import { TechnicalSection } from '@/components/technical-section'
import { SecuritySection } from '@/components/security-section'
import { IntegrationsSection } from '@/components/integrations-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { VisionSection } from '@/components/vision-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Features | Prix AI - Automated Code Review Platform',
  description: 'AI-powered code review with automatic bug detection, security scanning, and PR fix generation. Integrates with GitHub, GitLab, and Bitbucket.',
  alternates: {
    canonical: './',
  },
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
        <h1 className="text-editorial text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter">
          Engineered for<br />
          <span className="text-gradient-vibrant">velocity.</span>
        </h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          The platform that fixes, plans, and accelerates your workflow. Ship code faster with fixes, implementation plans, and actionable engineering steps built into your development process.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-8 rounded-xl btn-premium text-base font-bold group">
            <Link href="/login">Get Started for Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-base transition-all duration-300">
            <Link href="/#pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
      <FeaturesSection hideHeader={true} />
      <HowItWorksSection />
      <ComparisonSection />
      <TechnicalSection />
      <SecuritySection />
      <IntegrationsSection />
      <VisionSection />
      <div className="py-24 text-center border-t border-white/[0.03]">
        <h3 className="text-white text-3xl font-bold mb-8">Ready to accelerate?</h3>
        <Button size="lg" asChild className="h-10 px-6 rounded-lg btn-premium text-sm font-bold w-fit mx-auto">
          <Link href="/login">Start Free Trial</Link>
        </Button>
      </div>
      <CTASection />
      <Footer />
    </main>
  )
}
