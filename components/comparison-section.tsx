'use client'

import Image from 'next/image'
import { Check, Lightning as Zap, MagnifyingGlass as Search, Brain, Shield, CurrencyDollar as DollarSign, Command, Cpu } from '@phosphor-icons/react'

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
    <section id="benchmark" className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">
            The new standard in code review.
          </h2>
          <p className="section-subtitle">
            Prix combines AST-level analysis with LLM reasoning to catch what static analysis tools miss — and fixes it automatically.
          </p>
        </div>

        {/* Desktop View: Wide Grid Table */}
        <div className="hidden md:block border border-white/[0.05] rounded-xl overflow-hidden">
          <div className="-mx-6 lg:mx-0 overflow-x-auto">
            <div className="min-w-[580px] lg:min-w-0 px-6 lg:px-0 pb-2">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-white/10">
                <div className="p-5 md:p-8 font-bold text-white/40 text-[10px] md:text-xs uppercase tracking-widest">Core Capabilities</div>
                <div className="p-5 md:p-8 bg-primary/5 flex flex-col items-center justify-center gap-1 md:gap-3">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Prix" width={20} height={20} className="rounded-md md:w-6 md:h-6" />
                    <span className="text-sm md:text-lg font-bold text-white tracking-tight uppercase">Prix</span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">Winner</span>
                </div>
                <div className="p-5 md:p-8 flex flex-col items-center justify-center gap-2">
                  <span className="text-[11px] md:text-sm font-bold text-white/60">CodeRabbit</span>
                </div>
                <div className="p-5 md:p-8 flex flex-col items-center justify-center gap-2">
                  <span className="text-[11px] md:text-sm font-bold text-white/60">Qodo</span>
                </div>
              </div>

              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-white/[0.05] last:border-0"
                >
                  <div className="p-5 md:p-8 flex items-center gap-3 md:gap-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <row.icon className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
                    </div>
                    <span className="text-[11px] md:text-sm font-semibold text-white/80 leading-tight">{row.feature}</span>
                  </div>
                  
                  <div className="p-5 md:p-8 bg-primary/[0.02] flex items-center justify-center flex-col gap-1">
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

                  <div className="p-5 md:p-8 flex items-center justify-center text-center">
                    {row.feature === 'Monthly Pricing' ? (
                      <span className="text-sm md:text-lg text-red-400 font-bold">{row.codeRabbit}</span>
                    ) : (
                      <span className="text-[9px] md:text-xs text-white/40 font-medium leading-tight">{row.codeRabbit}</span>
                    )}
                  </div>

                  <div className="p-5 md:p-8 flex items-center justify-center text-center">
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
        </div>

        {/* Mobile View: Stacked Comparison Cards */}
        <div className="block md:hidden space-y-4">
          {comparisonData.map((row, index) => (
            <div key={index} className="bg-[#0e0e14]/60 border border-white/[0.06] rounded-xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-white/40" />
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">{row.feature}</h4>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Prix Column */}
                <div className="bg-primary/[0.04] border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    Prix <Check className="w-2.5 h-2.5" />
                  </span>
                  <span className={`text-xs font-bold leading-snug ${row.feature === 'Monthly Pricing' ? 'text-green-400' : 'text-white'}`}>
                    {row.prix}
                  </span>
                </div>

                {/* CodeRabbit Column */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">
                    Rabbit
                  </span>
                  <span className={`text-[10px] font-medium leading-snug ${row.feature === 'Monthly Pricing' ? 'text-red-400/90 font-bold text-xs' : 'text-white/50'}`}>
                    {row.codeRabbit}
                  </span>
                </div>

                {/* Qodo Column */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">
                    Qodo
                  </span>
                  <span className={`text-[10px] font-medium leading-snug ${row.feature === 'Monthly Pricing' ? 'text-red-400/90 font-bold text-xs' : 'text-white/50'}`}>
                    {row.qodo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-white/20">
            Benchmark data based on internal testing and publicly available features as of April 2026.
          </p>
        </div>
      </div>
    </section>
  )
}
