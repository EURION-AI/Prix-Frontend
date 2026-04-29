'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Zap, Github, ArrowRight } from 'lucide-react'

const steps = [
  {
    title: "Authorize",
    description: "Connect Prix to your GitHub organization with two clicks. We only request read access to your code.",
    icon: Github
  },
  {
    title: "Analyze",
    description: "Prix instantly maps your codebase graph and begins monitoring every incoming pull request.",
    icon: Zap
  },
  {
    title: "Automate",
    description: "Receive deep structural reviews and 1-click fixes directly in your development workflow.",
    icon: CheckCircle2
  }
]

export function InstallationSection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
              07 — Deployment
            </span>
            <h2 className="text-editorial text-5xl md:text-7xl font-bold text-white mb-8 leading-[0.9]">
              Two clicks to <br />
              <span className="text-primary">excellence.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-lg">
              <span className="text-primary font-bold">Prix</span> is designed to fit invisibly into your workflow. No complex YAML configurations, no maintenance overhead.
            </p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                    <step.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="bg-glass-vibrant rounded-3xl p-1 bg-muted/40 shadow-2xl glow-pink overflow-hidden group">
              <div className="bg-background rounded-[22px] p-10 relative overflow-hidden">
                {/* Visual Representation of 2-click install */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                    <Github className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">GitHub Marketplace</h3>
                  <p className="text-muted-foreground text-sm mb-8 max-w-xs"><span className="text-primary font-bold">Prix</span> is a verified GitHub App. Your code never leaves the secure environment.</p>
                  
                  <div className="w-full h-px bg-white/5 mb-8" />
                  
                  <button className="w-full h-14 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                    Install on GitHub
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <div className="mt-6 flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      SOC2 Compliant
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-secondary" />
                      Instant Setup
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
