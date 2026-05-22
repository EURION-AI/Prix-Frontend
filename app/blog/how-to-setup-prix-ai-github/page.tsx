import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, User, ArrowLeft, ArrowRight, CheckCircle, Github, Terminal, Settings, Search, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/jsonld'

export const metadata: Metadata = {
  title: 'How to Set Up Prix AI on GitHub — Step-by-Step Guide | 2026',
  description: 'Learn how to install and configure Prix AI on your GitHub repositories in under 5 minutes. Step-by-step setup guide with GitHub App installation, repository selection, and first PR review.',
  keywords: ['setup Prix AI GitHub', 'Prix AI installation guide', 'how to install Prix AI', 'GitHub PR reviewer setup', 'AI code review setup', 'Prix AI GitHub App'],
  authors: [{ name: 'Prix Team', url: 'https://www.prixai.xyz' }],
  openGraph: {
    title: 'How to Set Up Prix AI on GitHub — Step-by-Step Guide',
    description: 'Get Prix AI running on your GitHub repos in under 5 minutes. Complete installation guide with setup steps.',
    type: 'article',
    publishedTime: '2026-05-19T10:00:00Z',
    modifiedTime: '2026-05-19T10:00:00Z',
    authors: ['Prix Team'],
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Set Up Prix AI on GitHub',
    description: 'Step-by-step guide to installing Prix AI on your GitHub repositories.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://www.prixai.xyz/blog/how-to-setup-prix-ai-github',
    types: {
      'text/markdown': '/markdown/blog/how-to-setup-prix-ai-github',
    },
  },
}

const steps = [
  {
    icon: Github,
    title: 'Install the GitHub App',
    description: 'Navigate to the Prix AI GitHub App installation page and click "Install". Choose whether to install on all repositories or select specific ones. Prix needs access to read PRs and post review comments.',
    highlights: [
      'Go to github.com/apps/prix-ai-automation/installations/new',
      'Click "Install" and authorize',
      'Select "All repositories" or pick specific repos',
    ],
  },
  {
    icon: Settings,
    title: 'Configure Your Dashboard',
    description: 'After installation, visit the Prix Dashboard to manage which repositories are actively monitored. You can toggle repos on or off and adjust review settings per repository.',
    highlights: [
      'Go to prixai.xyz/dashboard after signing in',
      'Review the list of connected repositories',
      'Toggle monitoring on/off for each repo',
    ],
  },
  {
    icon: Search,
    title: 'Open Your First PR',
    description: 'Prix works automatically — no manual triggers needed. Simply open or update a pull request on any monitored repository, and Prix will analyze the changes within seconds.',
    highlights: [
      'Create a new PR or update an existing one',
      'Wait 30-60 seconds for analysis',
      'View inline review comments on your PR',
    ],
  },
  {
    icon: Terminal,
    title: 'Use !prix fix and !prix plan',
    description: 'After receiving a review, you can comment !prix fix on the PR to generate auto-fixes, or !prix plan on any issue to generate implementation plans. These commands work directly in GitHub comments.',
    highlights: [
      'Comment !prix fix on any PR to auto-generate fixes',
      'Comment !prix plan on any issue for implementation plans',
      'Fixes appear as a new PR with changes applied',
    ],
  },
]

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <BreadcrumbJsonLd items={[{ label: 'Blog', href: '/blog' }, { label: 'How to Set Up Prix AI', href: '/blog/how-to-setup-prix-ai-github' }]} />
      
      <article className="pt-32 pb-20 max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/40 hover:text-primary text-sm transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Guide</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">How to Set Up Prix AI on GitHub — Step-by-Step Guide</h1>
          
          <div className="flex items-center gap-4 text-sm text-white/40 mb-8">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> May 19, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 min read</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Prix Team</span>
          </div>
          
          <p className="text-xl text-white/60 leading-relaxed">
            Getting Prix AI running on your GitHub repositories takes under 5 minutes. Follow this step-by-step guide to install, configure, and start receiving automated PR reviews.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <section key={i} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">Step {i + 1}</span>
                  <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                </div>
              </div>
              <p className="text-white/50 leading-relaxed mb-4">{step.description}</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <ul className="space-y-2">
                  {step.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Pro Tips
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-white/60">
              <span className="text-primary font-bold">•</span>
              <span>Install Prix on all repositories at once — you can disable specific repos later from the dashboard</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white/60">
              <span className="text-primary font-bold">•</span>
              <span>Use <code className="text-primary text-xs font-mono">!prix fix</code> on draft PRs to preview fixes before marking them ready for review</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white/60">
              <span className="text-primary font-bold">•</span>
              <span>Combine <code className="text-primary text-xs font-mono">!prix plan</code> with Cursor or Windsurf for end-to-end automated implementation</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Install Prix AI Now</h3>
          <p className="text-white/50 mb-6 max-w-md mx-auto">Free plan includes 15 PR reviews per month. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 w-fit">
              <Link href="https://github.com/apps/prix-ai-automation/installations/new" target="_blank">
                <Github className="w-4 h-4" /> Install GitHub App
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-11 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white w-fit">
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/prix-ai-review-2026" className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all">
              <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">Prix AI Review 2026 — Is It Worth It?</h4>
              <p className="text-white/60 text-sm">Honest review of pricing, features, and performance.</p>
            </Link>
            <Link href="/blog/prix-ai-vs-coderabbit" className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all">
              <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">Prix AI vs CodeRabbit — Which Is Better?</h4>
              <p className="text-white/60 text-sm">Compare features, pricing, and performance.</p>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/features" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            See all Prix AI features →
          </Link>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Set Up Prix AI on GitHub — Step-by-Step Guide | 2026',
            description: 'Learn how to install and configure Prix AI on your GitHub repositories in under 5 minutes.',
            author: { '@type': 'Organization', name: 'Prix Team', url: 'https://www.prixai.xyz' },
            publisher: { '@type': 'Organization', name: 'Prix', logo: { '@type': 'ImageObject', url: 'https://www.prixai.xyz/logo.png' } },
            datePublished: '2026-05-19',
            dateModified: '2026-05-19',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.prixai.xyz/blog/how-to-setup-prix-ai-github' },
            image: { '@type': 'ImageObject', url: 'https://www.prixai.xyz/logo.png', width: 1200, height: 630 },
          }),
        }}
      />

      <Footer />
    </div>
  )
}
