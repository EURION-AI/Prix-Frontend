import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Terminal, Github } from 'lucide-react'
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/jsonld'

export const metadata: Metadata = {
  title: 'How to Use Prix AI — Demo & Documentation',
  description: 'Learn how Prix AI works. Automated PR reviews, !prix fix for auto-generated fixes, and !prix plan for step-by-step implementation plans.',
  alternates: {
    canonical: 'https://www.prixai.xyz/demo',
  },
}

const steps = [
  {
    src: '/review.mp4',
    title: '1. Automated PR Reviews',
    subtitle: 'Zero setup. Every PR gets reviewed automatically.',
    description: `Whenever someone opens or updates a pull request, Prix AI automatically analyzes every changed file. It detects bugs, security vulnerabilities, logic errors, performance issues, and syntax problems — all before a human reviewer even looks at it.`,
    highlights: [
      'No commands needed — reviews happen automatically',
      'Catches critical issues: syntax errors, security holes, logic bugs',
      'Each issue gets an inline comment with severity, confidence score, and impact analysis',
      'Works on both public and private repositories',
    ],
    command: null,
  },
  {
    src: '/autofix.mp4',
    title: '2. Auto-Fix with !prix fix',
    subtitle: 'Fix everything with one command.',
    description: `After a review, type !prix fix in any PR comment to automatically generate fixes for all detected issues. Prix will analyze each bug, apply the correction to your code, and raise a new PR with the changes. No manual editing.`,
    highlights: [
      'Comment <code class="text-primary font-bold">!prix fix</code> on any PR to trigger auto-fix',
      'Generates verified patches for each issue',
      'Creates a new PR with all fixes applied',
      'Supports multi-file repositories with complex interdependencies',
    ],
    command: '!prix fix',
  },
  {
    src: '/plan.mp4',
    title: '3. Issue Planning with !prix plan',
    subtitle: 'Turn issues into actionable implementation plans.',
    description: `Drop <code class="text-primary font-bold">!prix plan</code> on any GitHub issue, and Prix generates a detailed, phase-by-phase implementation plan. Each phase includes the specific files to modify, the exact code changes needed, and ready-to-use AI prompts you can feed directly into Cursor, Windsurf, or any AI coding agent.`,
    highlights: [
      'Comment <code class="text-primary font-bold">!prix plan</code> on any issue to start',
      'Receives a structured multi-phase implementation breakdown',
      'Each phase includes file paths, code snippets, and AI prompts',
      'Perfect for handing off to AI coding agents or your team',
    ],
    command: '!prix plan',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <BreadcrumbJsonLd items={[{ label: 'Demo', href: '/demo' }]} />
      <HowToJsonLd
        name="How to Use Prix AI for Automated Code Review"
        description="Learn how to use Prix AI to automatically review pull requests, generate fixes, and create implementation plans."
        steps={[
          { title: 'Automated PR Reviews', text: 'Whenever someone opens or updates a pull request, Prix AI automatically analyzes every changed file. It detects bugs, security vulnerabilities, logic errors, performance issues, and syntax problems.' },
          { title: 'Auto-Fix with !prix fix', text: 'After a review, type !prix fix in any PR comment to automatically generate fixes for all detected issues. Prix will analyze each bug, apply the correction, and raise a new PR with the changes.' },
          { title: 'Issue Planning with !prix plan', text: 'Drop !prix plan on any GitHub issue, and Prix generates a detailed, phase-by-phase implementation plan. Each phase includes the specific files to modify and the exact code changes needed.' },
        ]}
      />
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="section-label">
              Documentation
            </span>
            <h1 className="section-title text-4xl md:text-6xl mb-6">
              How Prix AI Works
            </h1>
            <p className="section-subtitle mx-auto">
              Three features. Zero friction. Watch how Prix automates code review, generates fixes, and plans implementations — all from inside GitHub.
            </p>
          </div>

          {/* Video Sections */}
          <div className="space-y-32">
            {steps.map((step, i) => (
              <section
                key={i}
                className="scroll-mt-24"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Video */}
                  <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="card-base overflow-hidden">
                      <video
                        className="w-full aspect-video object-contain"
                        preload="metadata"
                        muted
                        controls
                        playsInline
                        loop
                      >
                        <source src={step.src} type="video/mp4" />
                      </video>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {step.title}
                    </h2>
                    <p className="text-primary font-medium text-sm mb-6">
                      {step.subtitle}
                    </p>
                    <p className="text-white/50 leading-relaxed mb-8 text-sm">
                      {step.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-3 mb-8">
                      {step.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span
                            className="text-white/60 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: h }}
                          />
                        </li>
                      ))}
                    </ul>

                    {/* Command Badge */}
                    {step.command && (
                      <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/10 border border-primary/20 rounded-xl">
                        <Terminal className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-mono text-primary font-bold">
                          {step.command}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Prerequisite */}
          <div className="mt-32 mb-16">
            <div className="max-w-2xl mx-auto card-base border-primary/20 bg-primary/[0.03] p-8 text-center">
              <Terminal className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-3">
                Before you start
              </h2>
              <p className="text-white/50 leading-relaxed mb-4 text-sm max-w-lg mx-auto">
                Make sure you have mounted your repositories in the{' '}
                <Link href="/dashboard" className="text-primary hover:underline font-medium">Prix Dashboard</Link> first.
                Install the Prix GitHub App on your repos, then select which ones to monitor.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-bold text-sm"
              >
                <Github className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="max-w-xl mx-auto card-base p-10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to try it?
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed text-sm">
                Install the Prix AI GitHub App, push a PR, and watch the review appear automatically. No configuration needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://github.com/apps/prix-ai-automation/installations/new"
                  target="_blank"
                  className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center gap-2 justify-center"
                >
                  <Github className="w-5 h-5" />
                  Install GitHub App
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-bold"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
