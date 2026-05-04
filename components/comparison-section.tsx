'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, X, Zap, Cpu, Search, Brain, Shield, DollarSign, Infinity } from 'lucide-react'

const comparisonData = [
  {
    feature: 'Monthly Pricing',
    prix: '$6.99',
    codeRabbit: '$60',
    qodo: '$38',
    icon: DollarSign
  },
  {
    feature: 'PR Fixes / Month',
    prix: 'Unlimited',
    codeRabbit: 'Limited',
    qodo: 'Limited',
    icon: Infinity
  },
  {
    feature: 'Auto PR Fixing',
    prix: 'Yes (Context-Aware)',
    codeRabbit: 'Partial (Basic)',
    qodo: 'No',
    icon: Zap
  },
  {
    feature: 'Speed / Latency',
    prix: 'Sub-second',
    codeRabbit: 'Standard',
    qodo: 'Standard',
    icon: Cpu
  },
  {
    feature: 'Full Repo Scanning',
    prix: 'Integrated (AST-based)',
    codeRabbit: 'File-based',
    qodo: 'File-based',
    icon: Search
  },
  {
    feature: 'SEO Optimization',
    prix: 'Integrated',
    codeRabbit: 'No',
    qodo: 'No',
    icon: Brain
  },
  {
    feature: 'Autonomous Logic',
    prix: 'Agentic Workflows',
    codeRabbit: 'Scripted',
    qodo: 'Static Analysis',
    icon: Shield
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
          className="flex flex-col items-center text-center mb-20"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-4 block font-bold">
            04 — Benchmark
          </span>
          <h2 className="text-editorial text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
            The new standard in<br />
            <span className="text-gradient-vibrant">autonomous engineering.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl">
            Prix isn't just another reviewer. It's an agentic engine designed to outpace and out-think traditional static tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.02]">
            <div className="p-8 font-bold text-white/40 text-xs uppercase tracking-widest">Core Capabilities</div>
            <div className="p-8 bg-primary/5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Prix" width={24} height={24} className="rounded-md" />
                <span className="text-lg font-bold text-white tracking-tight uppercase">Prix</span>
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Winner</span>
            </div>
            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold text-white/60">CodeRabbit</span>
            </div>
            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold text-white/60">Qodo</span>
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-white/[0.05] last:border-0 hover:bg-white/[0.01] transition-colors"
            >
              <div className="p-8 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-white/40" />
                </div>
                <span className="font-semibold text-white/80">{row.feature}</span>
              </div>
              
              <div className="p-8 bg-primary/[0.02] flex items-center justify-center flex-col gap-1">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{row.prix}</span>
                </div>
              </div>

              <div className="p-8 flex items-center justify-center text-center">
                <span className="text-xs text-white/40 font-medium">{row.codeRabbit}</span>
              </div>

              <div className="p-8 flex items-center justify-center text-center">
                <span className="text-xs text-white/40 font-medium">{row.qodo}</span>
              </div>
            </motion.div>
          ))}
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