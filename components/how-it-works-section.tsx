'use client'

import { GithubLogo as Github, GitBranch, Sparkle as Sparkles } from '@phosphor-icons/react'

const steps = [
  {
    icon: Github,
    step: '01',
    title: 'Connect your repository',
    description: 'Link your GitHub account in one click. Select the repos you want Prix to monitor.',
    metrics: ['2-minute setup', 'Universal support']
  },
  {
    icon: GitBranch,
    step: '02',
    title: 'Open a pull request',
    description: 'Push your changes as usual. Prix automatically detects new PRs and begins analysis immediately.',
    metrics: ['Zero config needed', 'Auto-detection']
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Fixes auto-generated',
    description: 'Within minutes, receive automatic fixes ready to merge. Apply with one click or discuss in-line.',
    metrics: ['< 2 min average', '1-click apply']
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="w-full max-w-5xl mx-auto px-6 lg:px-12">
        <div className="section-header">
          <h2 className="section-title text-center">
            From PR to fix in<br />
            <span className="text-primary">under 2 minutes.</span>
          </h2>
          <p className="section-subtitle">
            Three steps from repository to automatic fixes. No configuration required.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-px bg-white/[0.06] -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-[#121218] border border-white/[0.08] rounded-xl p-8"
              >
                <span className="text-4xl font-bold text-white/[0.06] absolute top-5 right-6 leading-none select-none">
                  {step.step}
                </span>

                <div className="mb-6">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {step.description}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04]">
                  {step.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-primary/50" />
                      <span className="text-xs text-white/40">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
