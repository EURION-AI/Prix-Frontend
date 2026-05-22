import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Zap, ArrowRight, Clock, Shield, Code, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Changelog — Prix AI Product Updates & Releases',
  description: 'See the latest updates to Prix AI. New features, improvements, and fixes for our AI-powered GitHub PR reviewer.',
  alternates: {
    canonical: 'https://www.prixai.xyz/changelog',
  },
  openGraph: {
    title: 'Prix AI Changelog — Product Updates',
    description: 'See the latest features, improvements, and fixes for Prix AI.',
    type: 'website',
    url: 'https://www.prixai.xyz/changelog',
    siteName: 'Prix AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prix AI Changelog — Product Updates',
    description: 'See the latest features, improvements, and fixes for Prix AI.',
  },
}

const updates = [
  {
    version: 'v1.1.0',
    date: 'May 20, 2026',
    type: 'Improvement',
    typeColor: 'bg-green-500',
    title: 'Performance & Polish',
    description: 'Faster review analysis, improved fix accuracy, refined GitHub comment formatting, and UI improvements across the dashboard.',
    icon: Zap
  },
  {
    version: 'v1.0.0',
    date: 'May 15, 2026',
    type: 'Launch',
    typeColor: 'bg-purple-500',
    title: 'Soft Launch',
    description: 'Prix AI goes live. Full PR review pipeline with bug detection, security scanning, auto-fix generation, and issue planning. GitHub integration complete.',
    icon: Search
  },
  {
    version: 'v0.3.0',
    date: 'May 10, 2026',
    type: 'New Feature',
    typeColor: 'bg-primary',
    title: 'Issue Planning (!prix plan)',
    description: 'Introduced !prix plan command — drop it on any GitHub issue and get a detailed, phase-by-phase implementation breakdown with file paths and code changes.',
    icon: Code
  },
  {
    version: 'v0.2.0',
    date: 'May 2, 2026',
    type: 'New Feature',
    typeColor: 'bg-primary',
    title: 'Auto-Fix (!prix fix)',
    description: 'Introduced !prix fix command — automatically generates and applies code fixes for detected issues. Prix creates a new PR with the patch.',
    icon: Zap
  },
  {
    version: 'v0.1.0',
    date: 'March 28, 2026',
    type: 'Foundation',
    typeColor: 'bg-white/20',
    title: 'Project Started',
    description: 'Initial work begins on Prix AI. Core review engine architecture, GitHub API integration, and LLM pipeline design.',
    icon: Shield
  }
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508]" />
      <Navbar />
      <main className="pt-32 pb-20 relative">
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 w-fit">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Changelog</span>
            </div>
            <h1 className="text-editorial text-5xl md:text-7xl font-bold text-white mb-6">
              Product <span className="text-primary">Updates</span>
            </h1>
            <p className="text-white/50 text-xl max-w-2xl">
              We ship fast. See the latest features, improvements, and fixes for Prix.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5" />

            <div className="space-y-12">
              {updates.map((update, index) => (
                <div key={index} className="relative pl-24">
                  <div className="absolute left-4 w-8 h-8 rounded-full bg-[#0a0a0f] border border-white/10 flex items-center justify-center">
                    <update.icon className="w-4 h-4 text-primary" />
                  </div>

                  <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-8 hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                        {update.version}
                      </span>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-white ${update.typeColor}`}>
                        {update.type}
                      </span>
                      <span className="text-xs text-white/30">
                        {update.date}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4">
                      {update.title}
                    </h2>

                    <p className="text-white/50 leading-relaxed">
                      {update.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 p-10 bg-[#0a0a0f] border border-white/5 rounded-2xl text-center">
            <div className="flex justify-center gap-4 mb-6">
              <Zap className="w-8 h-8 text-primary" />
              <Shield className="w-8 h-8 text-primary" />
              <Code className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay ahead of the curve
            </h3>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Get the latest AI code review features. Start free.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}