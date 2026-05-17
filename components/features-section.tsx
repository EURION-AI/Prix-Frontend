'use client'

import { GitBranch, Shield, ChatText as MessageSquare, List as LayoutList, GithubLogo as GithubIcon, MagicWand as Wand2 } from '@phosphor-icons/react'

const features = [
  {
    icon: GitBranch,
    title: 'AST-Powered Analysis',
    description: 'Prix uses tree-sitter and ts-morph to parse your codebase structure, understanding dependencies and architectural context for accurate reviews.',
  },
  {
    icon: Wand2,
    title: 'Context-Aware Fixes',
    description: 'Powered by advanced LLM reasoning, Prix generates fixes that understand your codebase structure and architectural patterns.',
  },
  {
    icon: Shield,
    title: 'Security Scanning',
    description: 'Detects common security issues, vulnerabilities, and code smells in your pull requests with automated fix suggestions.',
  },
  {
    icon: MessageSquare,
    title: 'Issue Planning',
    description: 'Use !prix plan to generate detailed implementation plans for complex features and architectural changes.',
  },
  {
    icon: GithubIcon,
    title: 'GitHub Integration',
    description: 'Seamless GitHub App integration with native comment commands and automatic PR analysis.',
  },
  {
    icon: LayoutList,
    title: 'Auto-Fix Generation',
    description: 'Automatically creates fix PRs with !prix fix command, complete with confidence scoring and validation.',
  }
]

interface FeaturesSectionProps {
  hideHeader?: boolean
}

export function FeaturesSection({ hideHeader = false }: FeaturesSectionProps) {
  return (
    <section id="features" className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="section-container">
        {!hideHeader && (
          <div className="flex flex-col items-start mb-16 max-w-2xl">
            <h2 className="section-title mb-6">
              The platform that fixes,<br />
              <span className="text-primary">plans, and accelerates your workflow.</span>
            </h2>
            <p className="section-subtitle mt-0">
              Ship code faster with fixes, implementation plans, and actionable engineering steps built into your development process.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover p-8 flex flex-col items-start"
            >
              <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/40 group-hover:text-primary transition-all duration-300">
                <feature.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/40 text-[14px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
