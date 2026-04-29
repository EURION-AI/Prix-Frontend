'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Code, Brain, Zap, Check, X } from 'lucide-react'

const features = [
  { name: 'Auto-fix generation', icon: Zap },
  { name: 'Implementation plans', icon: Brain },
  { name: 'Task breakdowns', icon: Check },
  { name: 'Architecture proposals', icon: Code },
  { name: 'Zero-config setup', icon: Zap },
  { name: 'Multi-repo support', icon: Code },
]

const competitors = [
  { name: 'CodeRabbit', issues: ['Reviews only, no auto-fix', 'No implementation plans', 'No task breakdowns', 'Surface-level analysis only'] },
  { name: 'GitHub Copilot', issues: ['Code completion only', 'No PR review capability', 'No auto-fix generation', 'No planning engine'] },
  { name: 'SonarQube', issues: ['Static analysis only', 'High false positives', 'Complex configuration', 'No implementation plans'] },
]

export function ComparisonSection() {
  return (
    <section id="benchmark" className="py-32 bg-background relative overflow-hidden border-t border-white/[0.03]">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start mb-16 max-w-2xl"
        >
          <h2 className="text-editorial text-4xl md:text-5xl font-semibold text-white leading-tight">
            Why teams switch to<br />
            <span className="text-primary">Prix over competitors</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-4 border-b border-white/[0.05]">
            <div className="p-6 border-r border-white/[0.05]">
              <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Capability</span>
            </div>
            <div className="p-6 border-r border-white/[0.05] bg-primary/5">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="Prix" 
                  width={36} 
                  height={36} 
                  className="rounded-md object-contain" 
                />
                <span className="text-sm font-bold text-white">Prix</span>
              </div>
            </div>
            <div className="p-6 border-r border-white/[0.05]">
              <span className="text-sm font-bold text-white/40">CodeRabbit</span>
            </div>
            <div className="p-6">
              <span className="text-sm font-bold text-white/40">GitHub Copilot</span>
            </div>
          </div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-4 border-b border-white/[0.03] last:border-0"
            >
              <div className="p-5 border-r border-white/[0.05] flex items-center gap-3">
                <feature.icon className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
                <span className="text-sm text-white/60">{feature.name}</span>
              </div>
              <div className="p-5 border-r border-white/[0.05] bg-primary/5 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="p-5 border-r border-white/[0.05] flex items-center justify-center">
                <X className="w-5 h-5 text-white/20" />
              </div>
              <div className="p-5 flex items-center justify-center">
                <X className="w-5 h-5 text-white/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {competitors.map((comp, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
              <h4 className="text-sm font-bold text-white/40 mb-4">{comp.name}</h4>
              <div className="space-y-2">
                {comp.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/30">
                    <X className="w-3 h-3 text-red-400/40" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}