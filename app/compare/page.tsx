import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, ArrowRight, Zap, Shield, Clock, DollarSign, Code, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prix vs GitHub Copilot vs Manual Code Review | Compare',
  description: 'Compare Prix AI code review with GitHub Copilot and manual code review. See why Prix delivers 80% faster reviews with 95% bug detection and zero false positives.',
  keywords: ['Prix vs Copilot', 'AI code review comparison', 'code review tools', 'automated code review', 'GitHub Copilot alternative'],
  openGraph: {
    title: 'Prix vs GitHub Copilot vs Manual Code Review',
    description: 'See why Prix is the superior choice for AI-powered code review with 80% faster reviews and 95% bug detection.',
    type: 'website',
  },
}

const comparisonData = [
  {
    feature: 'Review Speed',
    prix: '80% faster',
    copilot: '2-3x faster',
    manual: 'Baseline',
    prixHighlight: true,
  },
  {
    feature: 'Bug Detection Rate',
    prix: '95%',
    copilot: '70-80%',
    manual: '60-70%',
    prixHighlight: true,
  },
  {
    feature: 'False Positives',
    prix: 'Zero',
    copilot: 'High',
    manual: 'N/A',
    prixHighlight: true,
  },
  {
    feature: 'Architectural Context',
    prix: 'Deep analysis',
    copilot: 'Limited',
    manual: 'High',
    prixHighlight: true,
  },
  {
    feature: 'Security Vulnerability Detection',
    prix: 'Built-in',
    copilot: 'Basic',
    manual: 'Manual',
    prixHighlight: true,
  },
  {
    feature: 'Automated Fix Generation',
    prix: 'Yes',
    copilot: 'Limited',
    manual: 'No',
    prixHighlight: true,
  },
  {
    feature: 'Cost per 1000 reviews',
    prix: '$15',
    copilot: '$20',
    manual: '$50+',
    prixHighlight: true,
  },
  {
    feature: 'Setup Time',
    prix: '5 minutes',
    copilot: '10 minutes',
    manual: 'N/A',
    prixHighlight: true,
  },
]

const quickStats = [
  { value: '80%', label: 'Faster Reviews', icon: Zap },
  { value: '95%', label: 'Bug Detection', icon: Shield },
  { value: '70%', label: 'Cost Savings', icon: DollarSign },
  { value: '0', label: 'False Positives', icon: X },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      
      <article className="pt-32 pb-20 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Header */}
          <header className="mb-16 text-center max-w-4xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">Comparison</Badge>
            <h1 className="section-title text-4xl md:text-6xl mb-6">
              Prix vs GitHub Copilot vs Manual Code Review
            </h1>
            <p className="section-subtitle mx-auto">
              See why engineering teams choose Prix for AI-powered code review with superior accuracy, speed, and cost efficiency.
            </p>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {quickStats.map((stat, index) => (
              <div key={index} className="card-base p-6 text-center">
                <stat.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="card-base overflow-hidden mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-5 text-white/60 font-medium text-sm">Feature</th>
                  <th className="text-center p-5 text-primary font-bold text-base">Prix</th>
                  <th className="text-center p-5 text-white/60 font-medium text-sm">GitHub Copilot</th>
                  <th className="text-center p-5 text-white/60 font-medium text-sm">Manual Review</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={`border-b border-white/5 ${row.prixHighlight ? 'bg-primary/[0.02]' : ''}`}>
                    <td className="p-5 text-white font-medium text-sm">{row.feature}</td>
                    <td className={`p-5 text-center font-bold text-sm ${row.prixHighlight ? 'text-primary' : 'text-white'}`}>
                      {row.prix}
                    </td>
                    <td className="p-5 text-center text-white/60 text-sm">{row.copilot}</td>
                    <td className="p-5 text-center text-white/60 text-sm">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Comparison */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card-base p-7 border-primary/20 bg-primary/[0.03]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Prix</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Multi-dimensional graph analysis for architectural understanding</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Zero false positives with context-aware detection</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Automated fix generation with verification</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Built-in security vulnerability scanning</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>70% more cost-effective than alternatives</span>
                </li>
              </ul>
            </div>

            <div className="card-base p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-xl font-bold text-white">GitHub Copilot</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>General-purpose model, not code-review specific</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>High false positive rate requires manual filtering</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Limited architectural context understanding</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>No automated fix generation</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Higher cost per review</span>
                </li>
              </ul>
            </div>

            <div className="card-base p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-xl font-bold text-white">Manual Review</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Slow 2-3 day review cycles</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Inconsistent quality across reviewers</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Doesn't scale with team growth</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>High opportunity cost of senior developer time</span>
                </li>
                <li className="flex items-start gap-2.5 text-white/70 text-sm">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Most expensive option at scale</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-10 card-base border-primary/20 bg-primary/[0.03]">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Code Review?</h2>
            <p className="text-white/50 mb-8 max-w-2xl mx-auto text-sm">
              Join engineering teams shipping 5x faster with Prix AI-powered code review. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 w-fit">
                <Link href="/login">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white w-fit">
                <Link href="/demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  )
}
