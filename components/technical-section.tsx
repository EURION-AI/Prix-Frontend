'use client'

import { motion } from 'framer-motion'
import { Code2, Zap, ShieldCheck, Cpu, Terminal, Activity, Lock, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export function TechnicalSection() {
  const [latency, setLatency] = useState(42.04)

  useEffect(() => {
    const interval = setInterval(() => {
      // Create a jitter of +/- 0.05ms for a realistic feel
      setLatency(42.04 + (Math.random() * 4 - 2))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const configSnippet = [
    { line: 'version: 1.4', color: 'text-white/40' },
    { line: 'engine: architectural-v2', color: 'text-primary' },
    { line: 'analysis:', color: 'text-white' },
    { line: '  depth: full-graph', color: 'text-secondary' },
    { line: '  logic_consistency: true', color: 'text-secondary' },
    { line: '  dependency_cascade: enabled', color: 'text-secondary' },
    { line: 'rules:', color: 'text-white' },
    { line: '  - security/owasp-top-10', color: 'text-white/60' },
    { line: '  - architecture/pattern-integrity', color: 'text-white/60' }
  ]

  const benchmarks = [
    { 
      label: 'Reasoning Latency', 
      value: `${latency.toFixed(2)}ms`, 
      desc: 'Average AST analysis time',
      icon: <Activity className="w-3 h-3 text-primary" />
    },
    { 
      label: 'Contextual Recall', 
      value: '100%', 
      desc: 'Cross-file dependency mapping',
      icon: <Globe className="w-3 h-3 text-secondary" />
    },
    { 
      label: 'Privacy', 
      value: 'Zero Storage', 
      desc: 'Code analyzed, not stored',
      icon: <Lock className="w-3 h-3 text-white/40" />
    },
  ]

  return (
    <section id="technical" className="py-32 bg-background relative border-t border-white/[0.03] overflow-hidden">
      {/* Zone-specific dense grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-surgical-dense" />
      
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
              07 — Technical Core
            </span>
            <h2 className="text-editorial text-4xl md:text-6xl font-semibold text-white mb-10 leading-[1.05]">
              Architectural <br />
              <span className="text-gradient-vibrant">code intelligence.</span>
            </h2>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 mb-16 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-6 text-white/40 relative z-10">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Project Initialization</span>
              </div>
              <code className="text-lg font-mono text-primary flex items-center gap-4 relative z-10 font-bold">
                <span className="text-white/20 select-none">$</span> npx prix@latest init
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-6 bg-primary ml-1 shadow-[0_0_10px_var(--primary)]" 
                />
              </code>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {benchmarks.map((item, i) => (
                <div key={i} className="flex flex-col gap-4 group/bench">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold">{item.label}</span>
                  </div>
                  <div className="text-3xl font-bold text-white tabular-nums tracking-tighter">
                    {item.value}
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed font-medium group-hover/bench:text-white/60 transition-colors">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="bg-[#050507] rounded-3xl border border-white/[0.08] p-10 shadow-2xl overflow-hidden font-mono">
              <div className="flex items-center justify-between mb-8 border-b border-white/[0.05] pb-6">
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-primary" />
                  <span className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-bold">Engine_Config.yaml</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                  <div className="w-1 h-1 rounded-full bg-secondary" />
                  <span className="text-[9px] text-secondary font-bold uppercase tracking-widest">Optimized</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {configSnippet.map((c, i) => (
                  <div key={i} className="flex gap-6 group/line">
                    <span className="text-white/10 text-[13px] select-none w-6">{i + 1}</span>
                    <span className={`${c.color} text-[14px] font-medium group-hover/line:translate-x-1 transition-transform`}>{c.line}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">System Status: Active</span>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
