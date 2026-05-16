import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { PricingSection } from '@/components/pricing-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Prix AI Pricing — AI Code Review Plans for Every Team',
  description: 'Start free with 15 PR reviews, 3 issue plans & 3 auto fixes per month. Upgrade to Starter from $6.99/mo for 400 reviews & 50 issue plans, or Pro from $9.99/mo for unlimited AI-powered code review, planning and fixes.',
  alternates: {
    canonical: 'https://www.prixai.xyz/pricing',
    types: {
      'text/markdown': '/markdown/pricing',
    },
  },
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      <div className="pt-20">
        <h1 className="sr-only">Prix AI Pricing — AI Code Review Plans</h1>
        <PricingSection />
      </div>
      <CTASection />
      <Footer />
    </main>
  )
}
