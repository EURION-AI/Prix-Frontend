'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Terminal, Copy, Shield, Zap, ArrowRight, Check, ExternalLink, GitPullRequest } from 'lucide-react'

export function DemoSection() {
  const [isFixed, setIsFixed] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleApplyFix = () => {
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      setIsFixed(true)
    }, 1200) // Slightly longer for more "tactile" feel
  }
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1])
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])

  const auditLogs = [
    { id: '#128', type: 'Security', status: 'Fixed', time: '2m ago' },
    { id: '#127', type: 'Performance', status: 'Nominal', time: '15m ago' },
    { id: '#126', type: 'Architecture', status: 'Warning', time: '1h ago' },
  ]

  return (
    <section ref={containerRef} className="relative min-h-[120vh] bg-background py-32 overflow-hidden">
      {/* Surgical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-surgical-wide" />

      <div className="sticky top-[15%] w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div 
          style={{ opacity, scale, y }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Surgical Header */}
          <div className="flex flex-col items-center mb-20 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20 mb-8 font-bold">
              01 — THE ENGINE
            </span>
            <h2 className="text-editorial text-5xl md:text-6xl font-semibold text-white max-w-2xl leading-[1.05]">
              Reviews that understand <br />
              <span className="text-primary">architectural intent.</span>
            </h2>
          </div>

          {/* Elite Mockup Window */}
          <motion.div 
            animate={isApplying ? { 
              scale: [1, 1.005, 1], 
              filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
              boxShadow: [
                '0 40px 100px rgba(0,0,0,0.9)',
                '0 40px 100px rgba(236, 72, 153, 0.1)',
                '0 40px 100px rgba(0,0,0,0.9)'
              ]
            } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-xl hairline-border bg-card shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden relative group/window"
          >
            {/* Window Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />

            {/* Window Controls */}
            <div className="bg-[#16161a] px-6 py-4 border-b border-white/[0.05] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.05] border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.05] border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.05] border border-white/10" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-3.5 h-3.5 text-white/20" />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                    prix_analysis / pull / 124
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-3 py-1 rounded bg-secondary/10 border border-secondary/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                  <span className="text-[9px] font-mono text-secondary font-bold uppercase tracking-widest">
                    AST_NOMINAL
                  </span>
                </div>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex relative z-10 min-h-[480px]">
              {/* Minimal Sidebar with Diff Counts */}
              <div className="w-20 border-r border-white/[0.05] flex flex-col items-center py-8 gap-8 bg-[#0e0e11]/50">
                <div className="flex flex-col items-center gap-2 group/diff">
                  <div className="w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.05] flex items-center justify-center transition-colors group-hover/diff:border-secondary/30">
                    <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full" />
                  </div>
                  <span className="text-[8px] font-mono text-secondary font-bold">+12</span>
                </div>
                <div className="flex flex-col items-center gap-2 group/diff">
                  <div className="w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.05] flex items-center justify-center transition-colors group-hover/diff:border-red-500/30">
                    <div className="w-1.5 h-1.5 bg-red-500/40 rounded-full" />
                  </div>
                  <span className="text-[8px] font-mono text-red-500/60 font-bold">-4</span>
                </div>
                <div className="w-5 h-5 rounded-md bg-white/[0.02] border border-white/[0.03] opacity-20" />
                <div className="mt-auto mb-8 flex flex-col items-center gap-4">
                   <div className="w-6 h-6 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                      <Copy className="w-3 h-3 text-white/20" />
                   </div>
                </div>
              </div>

              <div className="p-10 font-mono text-[13px] leading-[1.7] flex-grow overflow-hidden">
                <div className="space-y-1.5 opacity-30 mb-6">
                  <div className="text-[#64748b] text-[11px]">@@ -42,12 +42,20 @@</div>
                  <div className="text-white">export async function handleAuth(req, res) {'{'}</div>
                </div>

                {/* Tactical Diff with Shimmer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`relative mt-2 transition-all duration-700 ${isApplying ? 'shimmer brightness-125' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {!isFixed ? (
                      <motion.div
                        key="diff"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -12, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: 'circOut' }}
                        className="space-y-1"
                      >
                        <div className="text-red-400/80 border-l-2 border-red-500/40 pl-6 py-1 bg-red-500/5">- if (!token) return res.status(401).send();</div>
                        <div className="text-secondary/90 border-l-2 border-secondary/40 pl-6 py-1 bg-secondary/5">+ if (!token) {'{'}</div>
                        <div className="text-secondary/90 border-l-2 border-secondary/40 pl-6 py-1 bg-secondary/5">+   return res.status(401).json({'{'} error: 'Unauthorized' {'}'});</div>
                        <div className="text-secondary/90 border-l-2 border-secondary/40 pl-6 py-1 bg-secondary/5">+ {'}'}</div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="fixed"
                        initial={{ opacity: 0, x: 12, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="bg-primary/5 text-white border-l-2 border-primary/60 pl-6 py-4 rounded-r-lg relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                           <Shield className="w-12 h-12 text-primary" />
                        </div>
                        <div className="text-primary/40 text-[11px] mb-2 uppercase tracking-widest font-bold">// ARCHITECTURE CORRECTED</div>
                        <div className="text-white/80">if (!token) {'{'}</div>
                        <div className="text-white/80">  return res.status(401).json({'{'} error: 'Unauthorized' {'}'});</div>
                        <div className="text-white/80">{'}'}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* AI Reasoning - Surgical & Tactile */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                  className="mt-12 ml-12 relative"
                >
                  <div className="absolute -left-12 top-6 w-10 h-px bg-primary/30" />
                  <div className="bg-[#16161a] border border-white/[0.08] rounded-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm hover:border-primary/30 transition-all group/comment relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        <Terminal className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Control Flow Analysis</span>
                      {isFixed && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="ml-auto"
                        >
                          <Check className="w-4 h-4 text-secondary" />
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-white/50 text-[12px] leading-[1.6] mb-6 relative z-10">
                      {isFixed
                        ? "Structural integrity validated. Enforced JSON response pattern aligns with enterprise API standards."
                        : "Heuristic match: API consistency violation. Auth failures must return structured JSON to ensure client-side resilience."}
                      {/* Consider dynamic content based on actual audit findings */}
                    </p>
                    
                    <div className="flex gap-6 relative z-10">
                      <motion.button 
                        onClick={handleApplyFix}
                        disabled={isFixed || isApplying}
                        whileHover={{ scale: isFixed ? 1 : 1.02 }}
                        whileTap={{ scale: isFixed ? 1 : 0.98 }}
                        className={`text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${isFixed ? 'text-secondary cursor-default' : 'text-primary hover:text-white'}`}
                      >
                        {isApplying ? "APPLYING_AST_FIX..." : isFixed ? "FIX_APPLIED" : "Apply Fix"}
                        {!isFixed && !isApplying && <ArrowRight className="w-3.5 h-3.5" />}
                        {isFixed && <Check className="w-3.5 h-3.5" />}
                      </motion.button>
                      {!isFixed && (
                        <button className="text-[10px] uppercase tracking-widest text-white/20 font-bold hover:text-white transition-colors">
                          Ignore
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Technical Audit Log Overlay - Modernized */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-20">
                <AnimatePresence>
                   {auditLogs.map((log, i) => (
                     <motion.div 
                       key={log.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 1 + (i * 0.1) }}
                       className="bg-[#0e0e11]/90 backdrop-blur-xl border border-white/[0.08] px-4 py-2.5 rounded-lg flex items-center gap-4 shadow-2xl pointer-events-auto group/log cursor-pointer hover:border-white/20 transition-colors"
                     >
                       <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Fixed' ? 'bg-secondary shadow-[0_0_8px_rgba(34,197,94,0.6)]' : log.status === 'Warning' ? 'bg-amber-500' : 'bg-white/20'}`} />
                       <div className="flex flex-col">
                         <span className="text-[9px] font-mono text-white/80 font-bold uppercase tracking-widest">PR {log.id}</span>
                         <span className="text-[8px] font-mono text-white/30 uppercase">{log.type} • {log.time}</span>
                       </div>
                       <ExternalLink className="w-3 h-3 text-white/10 group-hover/log:text-white/40 transition-colors ml-2" />
                     </motion.div>
                   ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
