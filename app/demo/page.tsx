import { Metadata } from 'next'
import { DemoSection } from '@/components/demo-section'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Brain, Zap, Shield, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demo - See Prix in Action',
  description: 'Watch how Prix uses AI to analyze your code, catch bugs, security issues, and provide instant fixes.',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      <main className="pt-20 relative">
        <div className="py-20 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See Prix in Action
            </h1>
            <p className="text-white/50 text-lg mb-4">
              Watch how our AI automatically fixes code in real-time, generates implementation plans, and provides actionable engineering guidance.
            </p>
          </div>
        </div>
        
        <DemoSection />
        
        <div className="py-24 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Deep Analysis + Planning</h3>
                <p className="text-white/40 text-sm">
                  AI understands your codebase architecture and generates implementation plans, not just surface-level patterns.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Automatic Fixes</h3>
                <p className="text-white/40 text-sm">
                  Get working code patches ready to merge, implementation plans, and actionable engineering steps — not just alerts.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Security First</h3>
                <p className="text-white/40 text-sm">
                  Catches OWASP Top 10, secrets in code, SQL injection, XSS, and more.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Real-Time</h3>
                <p className="text-white/40 text-sm">
                  Reviews complete in seconds, not days. No more waiting for human reviewers.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-24 border-t border-white/[0.03] text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to try it yourself?
            </h2>
            <p className="text-white/50 mb-8">
              Start with our free plan. No credit card required.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}