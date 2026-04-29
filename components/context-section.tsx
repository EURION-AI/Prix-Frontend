'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Network, Database, Layers, ArrowUpRight, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

const codebaseData = [
  { name: 'api/auth.ts', type: 'Logic', connections: 12 },
  { name: 'schema/user.prisma', type: 'Data', connections: 8 },
  { name: 'hooks/useAuth.tsx', type: 'Frontend', connections: 5 },
  { name: 'lib/db.ts', type: 'Infrastructure', connections: 15 },
  { name: 'components/Navbar.tsx', type: 'UI', connections: 3 },
  { name: 'middleware.ts', type: 'Security', connections: 22 },
]

export function ContextSection() {
  const [activeFeatureId, setActiveFeatureId] = useState<number | null>(null)

  useEffect(() => {
    const handleHover = (e: CustomEvent) => setActiveFeatureId(e.detail.id)
    window.addEventListener('feature-hover', handleHover as EventListener)
    return () => window.removeEventListener('feature-hover', handleHover as EventListener)
  }, [])

  return (
    <section id="context" className="py-32 bg-background relative overflow-hidden border-t border-white/[0.03]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 font-bold block">
              03 — Codebase Intelligence
            </span>
            <h2 className="text-editorial text-4xl md:text-5xl font-semibold text-white mb-10 leading-tight">
              Full-graph <br />
              <span className="text-primary">structural awareness.</span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-12 max-w-lg">
              <span className="text-primary font-bold">Prix</span> maps your entire repository into a high-dimensional graph. It understands how a change in your core schema cascades through your API and frontend layers.
            </p>

            <div className="space-y-6">
              <div className="flex gap-6 group">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Network className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Cross-file Dependency Mapping</h4>
                  <p className="text-xs text-white/30 leading-relaxed">Detect side effects across unrelated modules before they reach production.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Database className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Schema Integrity Analysis</h4>
                  <p className="text-xs text-white/30 leading-relaxed">Ensures type safety and data consistency across your entire stack.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Visual Graph Mockup - Elite Execution */}
            <div className="bg-[#111114] border border-white/[0.08] rounded-2xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden group relative min-h-[550px]">
              <div className="absolute inset-0 grid-surgical-dense opacity-[0.02]" />
              
              {/* Branding Label */}
              <div className="absolute top-8 left-10 flex items-center gap-4 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white font-bold">PRIX_CORE_GRAPH</span>
              </div>

              {/* High Fidelity Graph */}
              <div className="relative h-[400px] w-full flex items-center justify-center mt-8">
                {/* Reasoning Pulse Rings */}
                <AnimatePresence>
                  {activeFeatureId !== null && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={`pulse-${i}`}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 2.5, opacity: [0, 0.1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.4,
                            ease: "easeOut" 
                          }}
                          className="absolute w-40 h-40 rounded-full border border-primary/30"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Core Engine Node */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 rounded-full border border-white/[0.03] flex items-center justify-center"
                >
                  <div className="w-40 h-40 rounded-full border border-primary/10 flex items-center justify-center bg-primary/[0.02] backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center bg-primary/[0.03]">
                      <Layers className="w-8 h-8 text-primary opacity-60" />
                    </div>
                  </div>
                </motion.div>
                
                {/* Connection Orbits */}
                {[1, 2].map((orbit) => (
                  <div 
                    key={orbit}
                    className="absolute rounded-full border border-white/[0.03]"
                    style={{ 
                      width: `${orbit * 220}px`, 
                      height: `${orbit * 220}px`,
                    }}
                  />
                ))}

                {/* Real Data Nodes */}
                {codebaseData.map((node, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50 + i * 8, repeat: Infinity, ease: "linear", delay: i * -4 }}
                    className="absolute w-full h-full pointer-events-none"
                    style={{ transform: `rotate(${i * 60}deg)` }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      animate={{ 
                        scale: activeFeatureId === i ? 1.5 : 1,
                        borderColor: activeFeatureId === i ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.08)',
                        backgroundColor: activeFeatureId === i ? 'rgba(236,72,153,0.08)' : '#0a0a0c',
                        boxShadow: activeFeatureId === i ? '0 0 30px rgba(236,72,153,0.2)' : 'none'
                      }}
                      className="w-14 h-14 rounded-xl bg-[#0a0a0c] border border-white/[0.08] flex flex-col items-center justify-center absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-crosshair group/node hover:border-primary/50 transition-all duration-500 shadow-xl"
                    >
                      <motion.div 
                        animate={{ 
                          scale: activeFeatureId === i ? [1, 1.8, 1] : [1, 1.4, 1],
                          opacity: activeFeatureId === i ? 1 : [0.4, 0.8, 0.4],
                        }}
                        transition={{ 
                          duration: activeFeatureId === i ? 0.8 : 4, 
                          repeat: Infinity, 
                          ease: "easeInOut"
                        }}
                        className={`w-2 h-2 rounded-full ${activeFeatureId === i ? 'bg-primary shadow-[0_0_10px_rgba(236,72,153,1)]' : 'bg-white/20'}`} 
                      />
                      
                      <span className="text-[7px] font-mono text-white/20 mt-2 uppercase tracking-tighter opacity-0 group-hover/node:opacity-100 transition-opacity">
                        {node.type}
                      </span>
                      
                      {/* Technical Tooltip - Dampened Animation */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ 
                          opacity: activeFeatureId === i ? 1 : 0, 
                          y: activeFeatureId === i ? -45 : -35,
                          scale: activeFeatureId === i ? 1 : 0.95
                        }}
                        className="absolute pointer-events-none bg-[#16161a] border border-primary/40 px-3 py-1.5 rounded-md whitespace-nowrap shadow-2xl z-50"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-mono text-white font-bold">{node.name}</span>
                          <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest font-bold">
                            {node.connections} CONNECTIONS
                          </span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#16161a] border-r border-b border-primary/40 rotate-45" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Structural Analysis Overlay */}
              <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between border-t border-white/[0.03] pt-6">
                <div className="flex gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Graph Density</span>
                    <span className="text-xs font-mono text-white/60 font-bold">0.84 ρ</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Cyclomatic Complexity</span>
                    <span className="text-xs font-mono text-white/60 font-bold">LOW</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-primary/5 border border-primary/10">
                   <Activity className="w-3 h-3 text-primary animate-pulse" />
                   <span className="text-[8px] font-mono text-primary uppercase tracking-widest font-bold">Real-time AST Mapping</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
