'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, X, Zap, Cpu, Search, Brain, Shield, DollarSign, Command } from 'lucide-react'

const comparisonData = [
  {
    feature: 'Monthly Pricing',
    prix: 'From $6.99',
    codeRabbit: '$60',
    qodo: '$38',
    icon: DollarSign
  },
  {
    feature: 'Auto-Fix PR Creation',
    prix: 'Yes (!prix fix)',
    codeRabbit: 'Suggestions Only',
    qodo: 'No Auto-Fix',
    icon: Zap
  },
  {
    feature: 'AST Analysis',
    prix: 'Multi-Language (TS/JS)',
    codeRabbit: 'Basic Pattern',
    qodo: 'File-based',
    icon: Search
  },
  {
    feature: 'Semantic Confidence',
    prix: 'Confidence Scoring',
    codeRabbit: 'Static Rules',
    qodo: 'Basic Checks',
    icon: Brain
  },
  {
    feature: 'Deduplication',
    prix: 'Semantic Hashing',
    codeRabbit: 'Text-based',
    qodo: 'No Dedup',
    icon: Shield
  },
  {
    feature: 'GitHub Commands',
    prix: '!prix fix/plan',
    codeRabbit: 'Dashboard Only',
    qodo: 'No Commands',
    icon: Command
  },
  {
    feature: 'Context Memory',
    prix: 'File-level Cache',
    codeRabbit: 'Session Only',
    qodo: 'No Memory',
    icon: Cpu
  }
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
          className="flex flex-col items-center text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-6xl font-semibold text-white leading-tight mb-4 md:mb-6">
            The new standard in autonomous engineering.
          </h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl">
            Prix isn't just another reviewer. It's an agentic engine designed to outpace and out-think traditional static tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.05] rounded-3xl shadow-2xl"
        >
          <div className="-mx-6 lg:mx-0 overflow-x-auto">
            <div className="min-w-[640px] lg:min-w-0 px-6 lg:px-0">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.02]">
                <div className="p-4 md:p-8 font-bold text-white/40 text-[10px] md:text-xs uppercase tracking-widest">Core Capabilities</div>
                <div className="p-4 md:p-8 bg-primary/5 flex flex-col items-center justify-center gap-1 md:gap-3">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Prix" width={20} height={20} className="rounded-md md:w-6 md:h-6" />
                    <span className="text-sm md:text-lg font-bold text-white tracking-tight uppercase">Prix</span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Winner</span>
                </div>
                <div className="p-4 md:p-8 flex flex-col items-center justify-center gap-2">
                  <span className="text-[11px] md:text-sm font-bold text-white/60">CodeRabbit</span>
                </div>
                <div className="p-4 md:p-8 flex flex-col items-center justify-center gap-2">
                  <span className="text-[11px] md:text-sm font-bold text-white/60">Qodo</span>
                </div>
              </div>

              {/* Table Rows */}
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-white/[0.05] last:border-0 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="p-4 md:p-8 flex items-center gap-2 md:gap-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <row.icon className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
                    </div>
                    <span className="text-[11px] md:text-sm font-semibold text-white/80 leading-tight">{row.feature}</span>
                  </div>
                  
                  <div className="p-4 md:p-8 bg-primary/[0.02] flex items-center justify-center flex-col gap-1">
                    {row.feature === 'Monthly Pricing' ? (
                      <div className="flex items-center gap-1 md:gap-2 text-green-400 font-bold">
                        <Check className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-sm md:text-lg">{row.prix}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 md:gap-2 text-primary font-bold">
                        <Check className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-sm">{row.prix}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-8 flex items-center justify-center text-center">
                    {row.feature === 'Monthly Pricing' ? (
                      <span className="text-sm md:text-lg text-red-400 font-bold">{row.codeRabbit}</span>
                    ) : (
                      <span className="text-[9px] md:text-xs text-white/40 font-medium leading-tight">{row.codeRabbit}</span>
                    )}
                  </div>

                  <div className="p-4 md:p-8 flex items-center justify-center text-center">
                    {row.feature === 'Monthly Pricing' ? (
                      <span className="text-sm md:text-lg text-red-400 font-bold">{row.qodo}</span>
                    ) : (
                      <span className="text-[9px] md:text-xs text-white/40 font-medium leading-tight">{row.qodo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            * Benchmark data based on internal testing and publicly available features as of April 2026.
          </p>
        </div>
      </div>
    </section>
  )
}