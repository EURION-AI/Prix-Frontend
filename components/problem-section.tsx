'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react'

export function ProblemSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-white/[0.03]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" />

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/30 mb-6 block font-bold">
            The Problem
          </span>
          <h2 className="text-editorial text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Manual fixes and debugging are slowing<br />
            <span className="text-primary">your entire team down.</span>
          </h2>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Fixing bugs manually creates bottlenecks. Critical issues slip through. Security vulnerabilities reach production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative p-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">01 — Time</span>
            </div>

            <p className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tighter">4-24h</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Average PR Review Time</p>
            <p className="text-sm text-white/40 leading-relaxed">Senior developers spend half their week reviewing code instead of writing it.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative p-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">02 — Quality</span>
            </div>

            <p className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tighter">67%</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Bugs Found Post-Merge</p>
            <p className="text-sm text-white/40 leading-relaxed">Most security vulnerabilities and bugs are discovered after code reaches production.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative p-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">03 — Cost</span>
            </div>

            <p className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tighter">$2.3M</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Avg Security Breach Cost</p>
            <p className="text-sm text-white/40 leading-relaxed">Undetected vulnerabilities cost companies millions in damages and reputation.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-white/30 text-sm uppercase tracking-widest mb-6">Sound familiar?</p>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-2 text-primary">
              <span className="text-lg">There&apos;s a better way</span>
              <ArrowRight className="w-5 h-5" />
            </div>
            
            <a 
              href="/features" 
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300"
            >
              See how Prix fixes it
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}