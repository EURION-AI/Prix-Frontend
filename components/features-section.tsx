'use client'

import { motion } from 'framer-motion'
import { Brain, Cpu, Zap, Shield, LayoutGrid, MessageSquare, Check } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Automatic Fixes',
    description: 'Get working code fixes ready to merge. Prix generates patches that follow your coding style, pass your tests, and solve problems permanently.',
    spec: '1-click apply'
  },
  {
    icon: Brain,
    title: 'Code Understanding + Planning',
    description: 'Prix comprehends your entire codebase architecture, generates implementation plans, and tracks dependencies across millions of lines.',
    spec: 'Full-repo context'
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'OWASP Top 10, secrets in code, SQL injection, XSS. Prix catches and fixes what other scanners miss.',
    spec: 'Enterprise security'
  },
  {
    icon: MessageSquare,
    title: 'Chat With Codebase',
    description: 'Ask Prix to explain complex modules or generate implementation plans. Natural language meets deep code analysis.',
    spec: 'Contextual understanding'
  },
  {
    icon: LayoutGrid,
    title: 'Works Everywhere',
    description: 'GitHub, GitLab, Bitbucket, VS Code, JetBrains. Prix integrates seamlessly with your existing stack.',
    spec: 'Universal integrations'
  },
  {
    icon: Cpu,
    title: 'Performance',
    description: 'Detect N+1 queries, memory leaks, and inefficient algorithms. Prix suggests optimizations with benchmarks.',
    spec: '40+ checks'
  }
]

interface FeaturesSectionProps {
  hideHeader?: boolean
}

export function FeaturesSection({ hideHeader = false }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-32 bg-background relative border-t border-white/[0.03] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
           style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '80px 100%' }} />

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start mb-16 max-w-2xl"
          >
            <h2 className="text-editorial text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight">
              The platform that fixes,<br />
              <span className="text-primary">plans, and accelerates your workflow.</span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed">
              Ship code faster with fixes, implementation plans, and actionable engineering steps built into your development process.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="group p-10 flex flex-col items-start transition-all duration-300 hover:bg-white/[0.02] border border-white/[0.02] relative"
            >
              <div className="mb-8 text-white/30 group-hover:text-primary transition-colors duration-300">
                <feature.icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/40 text-[15px] leading-relaxed mb-8">
                {feature.description}
              </p>
              <div className="mt-auto w-full pt-6 border-t border-white/[0.03]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/10 group-hover:text-primary/40 transition-colors">
                    {feature.spec}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}