import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Mail, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Prix AI - Get Support',
  description: 'Get in touch with the Prix AI team for support, feedback, or questions. We typically respond within 24 hours.',
  alternates: {
    canonical: 'https://www.prixai.xyz/contact',
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in <span className="text-gradient-vibrant">Touch</span>
            </h1>
            <p className="text-white/50 text-lg lg:text-xl max-w-2xl mx-auto">
              Have questions about Prix AI? Need support or want to share feedback? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email Support</h3>
              <p className="text-white/60 mb-4">
                Get help with billing, technical issues, or general questions
              </p>
              <a
                href="mailto:support@prixai.xyz"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                support@prixai.xyz
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Response Time</h3>
              <p className="text-white/60 mb-4">
                We typically respond within 24 hours during business days
              </p>
              <div className="text-white/40 text-sm">
                Mon-Fri: 9AM-6PM EST
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quick Questions</h3>
              <p className="text-white/60 mb-4">
                Check our FAQ and documentation for instant answers
              </p>
              <a
                href="/pricing"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View Pricing & Plans
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Need Help Right Away?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions about Prix AI, billing, or technical issues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@prixai.xyz"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/20"
              >
                View Plans
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
