'use client'

import { motion } from 'framer-motion'
import { Github, GitBranch, Zap, Check } from 'lucide-react'

const steps = [
  {
    icon: Github,
    title: 'Connect your repository',
    description: 'Link your GitHub, GitLab, or Bitbucket account in one click. Select the repos you want Prix to monitor.',
    step: '01',
    metrics: ['2-minute setup', 'Universal support']
  },
  {
    icon: GitBranch,
    title: 'Open a pull request',
    description: 'Push your changes as usual. Prix automatically detects new PRs and begins analysis immediately.',
    step: '02',
    metrics: ['Zero config needed', 'Auto-detection']
  },
  {
    icon: Zap,
    title: 'Fixes auto-generated',
    description: 'Within minutes, receive automatic fixes ready to merge. Apply with one click or discuss in-line.',
    step: '03',
    metrics: ['< 2 min average', '1-click apply']
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden border-t border-white/[0.03]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/20 mb-6 font-bold">
            03 — System
          </span>
          <h2 className="text-editorial text-5xl md:text-6xl font-semibold text-white text-center max-w-2xl leading-[1.1]">
            From PR to fix in<br />
            <span className="text-primary">under 2 minutes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              
              <div className="relative bg-white/[0.01] border border-white/[0.05] hover:border-primary/20 rounded-3xl p-8 transition-all duration-500 h-full">
                <div className="mb-8">
                  <span className="text-[10px] font-mono text-primary/60 tracking-[0.3em]">{step.step}</span>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mt-4 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500">
                    <step.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-4 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-white/40 text-[13px] leading-relaxed mb-8">
                  {step.description}
                </p>

                <div className="space-y-2">
                  {step.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}