'use client'

import { Clock, Warning as AlertTriangle, CurrencyDollar as DollarSign, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'

export function ProblemSection() {
  return (
    <section className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="section-container">
        <div className="section-header mb-20">
          <h2 className="section-title max-w-3xl mx-auto text-center mb-6">
            Manual fixes and debugging are slowing<br />
            <span className="text-primary">your entire team down.</span>
          </h2>
          <p className="section-subtitle">
            Fixing bugs manually creates bottlenecks. Critical issues slip through. Security vulnerabilities reach production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center">
                <Clock className="w-5 h-5 text-white/40" />
              </div>
            </div>

            <p className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tighter">4-24h</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Average PR Review Time</p>
            <p className="text-sm text-white/40 leading-relaxed">Senior developers spend half their week reviewing code instead of writing it.</p>
          </div>

          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white/40" />
              </div>
            </div>

            <p className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tighter">67%</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Bugs Found Post-Merge</p>
            <p className="text-sm text-white/40 leading-relaxed">Most security vulnerabilities and bugs are discovered after code reaches production.</p>
          </div>

          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white/40" />
              </div>
            </div>

            <p className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tighter">$2.3M</p>
            <p className="text-sm font-semibold text-white/70 mb-2">Avg Security Breach Cost</p>
            <p className="text-sm text-white/40 leading-relaxed">Undetected vulnerabilities cost companies millions in damages and reputation.</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-6">Sound familiar?</p>
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/features"
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
            >
              See how Prix fixes it
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
