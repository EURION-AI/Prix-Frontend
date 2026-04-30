import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demo - See Prix in Action',
  description: 'Watch how Prix uses AI to analyze your code, catch bugs, security issues, and provide instant fixes.',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <Navbar />
      <main className="pt-32 pb-20 relative min-h-screen flex flex-col justify-between">
        <div className="flex-1 max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See Prix in Action
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Watch how our AI automatically fixes code in real-time, generates implementation plans, and provides actionable engineering guidance.
            </p>
          </div>
          
          <div className="w-full aspect-video bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <p className="text-white/50 font-medium">Video Demo Coming Soon</p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}