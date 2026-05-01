import { Navbar } from '@/components/navbar'
import { PricingSection } from '@/components/pricing-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      <div className="pt-20">
        <PricingSection />
      </div>
      <CTASection />
      <Footer />
    </main>
  )
}
