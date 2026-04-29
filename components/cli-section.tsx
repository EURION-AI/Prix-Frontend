'use client'

import { motion } from 'framer-motion'
import { Terminal, Command, ChevronRight } from 'lucide-react'

const commands = [
  { cmd: 'prix auth login', desc: 'Authenticate with your GitHub/GitLab account' },
  { cmd: 'prix init', desc: 'Initialize project-wide architecture rules' },
  { cmd: 'prix review --deep', desc: 'Run deep semantic analysis on current branch' },
  { cmd: 'prix fix', desc: 'Apply recommended architectural fixes' },
]

export function CLISection() {
  return (
    <section className="py-32 bg-background border-t border-white/[0.03]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
              06 — Control
            </span>
            <h2 className="text-editorial text-5xl md:text-6xl font-semibold text-white mb-8">
              Engineered for <br />
              <span className="text-gradient-vibrant">terminal-first</span> workflows.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed mb-12 max-w-lg">
              Prix isn't just a dashboard. It's a powerful CLI that lives where you do. Integrate it into your pre-commit hooks or run it locally for instant feedback.
            </p>
            
            <div className="space-y-6">
              {commands.map((c, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-pointer">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <div>
                    <code className="text-sm font-mono text-white/90 font-bold tracking-tight">{c.cmd}</code>
                    <p className="text-xs text-white/40 mt-1 font-medium">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full -z-10" />
            <div className="bg-[#050507] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden font-mono text-[13px]">
              <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <span className="text-[10px] text-white/20 uppercase tracking-widest">prix_cli_v1.4</span>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex gap-3">
                  <span className="text-primary">$</span>
                  <span className="text-white/80">prix review --deep</span>
                </div>
                <div className="text-white/40 animate-pulse">Running semantic analysis across 42 modules...</div>
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <span className="text-secondary">✔</span>
                    <span className="text-white/80">AST Mapping Complete</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-secondary">✔</span>
                    <span className="text-white/80">Dependency Graph Validated</span>
                  </div>
                  <div className="flex gap-3 text-primary">
                    <ChevronRight className="w-4 h-4" />
                    <span>3 Architectural flaws found. Fixes generated.</span>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-white/80 font-bold mb-2">Recommendation [REF_042]:</p>
                  <p className="text-white/40 leading-relaxed">Circular dependency detected between <span className="text-primary">/auth</span> and <span className="text-primary">/user</span>. Use <span className="text-secondary">prix fix --ref-042</span> to inject an interface bridge.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">$</span>
                  <span className="w-1.5 h-4 bg-primary animate-blink" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}