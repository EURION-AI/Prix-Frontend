import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FeedbackContent } from './feedback-content'

export const metadata: Metadata = {
  title: 'Feedback - Help Us Improve Prix',
  description: 'Share your experience with Prix. Your feedback helps us build a better product for the entire developer community.',
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508]" />
      <Navbar />
      <main className="pt-20 relative">
        <FeedbackContent />
      </main>
      <Footer />
    </div>
  )
}