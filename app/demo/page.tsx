import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Code2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demo - Prix AI Code Review',
  description: 'Experience automated code review with Prix. Catch bugs, security issues, and get instant AI-powered fixes.',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <main className="pt-32 pb-20 relative min-h-screen flex flex-col justify-between">
        <div className="flex-1 max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try Prix Today
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Get started with automated code review. Our AI analyzes your pull requests, catches bugs and security issues, and provides instant fixes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 w-full mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Analysis</h3>
              <p className="text-white/50 text-sm">Get code review results in seconds, not hours</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Security First</h3>
              <p className="text-white/50 text-sm">Catch vulnerabilities before they reach production</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Auto-Fixes</h3>
              <p className="text-white/50 text-sm">Get AI-generated fixes you can apply instantly</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center gap-2"
            >
              View Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-bold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}