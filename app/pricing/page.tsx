import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { PricingSection } from '@/components/pricing-section'
import { ComparisonSection } from '@/components/comparison-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/jsonld'

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
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <BreadcrumbJsonLd items={[{ label: 'Pricing', href: '/pricing' }]} />
      <FaqJsonLd
        questions={[
          { question: 'Is Prix AI free to use?', answer: 'Yes, Prix AI offers a Free plan with 15 PR reviews per month, 3 issue plans, and 3 auto-fixes for public repositories. No credit card required.' },
          { question: 'How much does Prix AI cost?', answer: 'Prix AI has three plans: Free ($0), Starter ($6.99/month), and Pro ($9.99/month). Each plan includes increasing numbers of PR reviews, issue plans, and auto-fixes.' },
          { question: 'What is included in the Starter plan?', answer: 'The Starter plan includes 400 combined reviews & fixes per month, 50 AI issue plans, private repository support, up to 7,000 lines per PR, core bug detection, and essential security scanning.' },
          { question: 'What is included in the Pro plan?', answer: 'The Pro plan includes 700 combined reviews & fixes per month, 300 AI issue plans, priority queue processing, deeper multi-file analysis, advanced bug & security scanning, and large PR support.' },
          { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, you get immediate access to the new features. Downgrades take effect at the next billing cycle.' },
        ]}
      />
      <div className="pt-24">
        <h1 className="sr-only">Prix AI Pricing — AI Code Review Plans</h1>
        <PricingSection />
      </div>
      <ComparisonSection />
      <CTASection />
      <Footer />
    </main>
  )
}
