'use client'

import { motion } from 'framer-motion'
import { Code2, Zap, Cpu, Terminal, Activity, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'

export function TechnicalSection() {
  const [latency, setLatency] = useState(42.04)

  useEffect(() => {
    const interval = setInterval(() => {
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
      icon: <Cpu className="w-3 h-3 text-secondary" />
    },
    { 
      label: 'Privacy', 
      value: 'Zero Storage', 
      desc: 'Code analyzed, not stored',
      icon: <Lock className="w-3 h-3 text-white/40" />
    },
  ]

  return (
    <section id="technical" className="section-padding bg-[#0a0a0f] relative border-t border-white/[0.03]">
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="section-title mb-8">
              Architectural <br />
              <span className="text-white">code intelligence.</span>
            </h2>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 mb-12">
              <div className="flex items-center gap-3 mb-4 text-white/40">
                <Terminal className="w-4 h-4" />
                <span className="text-xs text-white/40">Project Initialization</span>
              </div>
              <code className="text-base font-mono text-primary flex items-center gap-4">
                <span className="text-white/20 select-none">$</span> npx prix@latest init
              </code>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {benchmarks.map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      {item.icon}
                    </div>
                    <span className="text-xs text-white/40">{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums tracking-tighter">
                    {item.value}
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
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
            <div className="bg-[#121218] rounded-xl border border-white/[0.08] p-8 overflow-hidden font-mono">
              <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-5">
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white/40">Engine_Config.yaml</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {configSnippet.map((c, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-white/10 text-[13px] select-none w-6">{i + 1}</span>
                    <span className={`${c.color} text-[14px] font-medium`}>{c.line}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
