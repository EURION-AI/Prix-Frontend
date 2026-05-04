'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Terminal, FileCode, ArrowRight, Zap, AlertCircle } from 'lucide-react'

const BUGGY_CODE = [
  { line: 12, text: 'export function AuthProvider({ children }) {' },
  { line: 13, text: '  const [user, setUser] = useState(null)' },
  { line: 14, text: '  useEffect(() => { fetchUser() }, [])', error: true },
  { line: 15, text: '  return <Context.Provider value={user}>{children}</Context.Provider>' },
  { line: 16, text: '}' },
]

const CLEAN_CODE = [
  { line: 12, text: 'export function AuthProvider({ children }) {' },
  { line: 13, text: '  const [user, setUser] = useState(null)' },
  { line: 14, text: '  useEffect(() => {', fixed: true },
  { line: 15, text: '    const controller = new AbortController();', fixed: true },
  { line: 16, text: '    fetchUser({ signal: controller.signal });', fixed: true },
  { line: 17, text: '    return () => controller.abort();', fixed: true },
  { line: 18, text: '  }, [])', fixed: true },
  { line: 19, text: '  return <Context.Provider value={user}>{children}</Context.Provider>' },
  { line: 20, text: '}' },
]

export function CodeFixDemo() {
  const [isFixed, setIsFixed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFix = () => {
    if (isFixed || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setIsFixed(true)
      setIsAnimating(false)
    }, 1500)
  }

  return (
    <div className="relative w-full max-w-xl xl:max-w-2xl bg-[#0a0a0c] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden group">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-mono text-white/40 tracking-tight uppercase">auth-provider.tsx</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-colors ${isFixed ? 'bg-green-500/10 border-green-500/20' : 'bg-primary/10 border-primary/20'}`}>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${isFixed ? 'text-green-400' : 'text-primary'}`}>
              {isFixed ? 'Optimized' : 'Issue Detected'}
            </span>
          </div>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-6 sm:p-8 font-mono text-[11px] sm:text-[13px] leading-relaxed relative min-h-[280px]">
        <AnimatePresence mode="wait">
          {!isFixed ? (
            <motion.div 
              key="buggy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              {BUGGY_CODE.map((line, i) => (
                <div key={i} className={`flex gap-6 ${line.error ? 'bg-red-500/5 -mx-8 px-8 border-l-2 border-red-500/50 py-1' : ''}`}>
                  <span className="w-4 text-white/10 select-none text-right">{line.line}</span>
                  <span className={line.error ? 'text-red-400' : 'text-white/70'}>
                    {line.text}
                    {line.error && <AlertCircle className="inline-block w-3 h-3 ml-2 text-red-500/50" />}
                  </span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="clean"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5"
            >
              {CLEAN_CODE.map((line, i) => (
                <motion.div 
                  key={i} 
                  initial={line.fixed ? { opacity: 0, x: -10 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-6 ${line.fixed ? 'bg-green-500/5 -mx-8 px-8 border-l-2 border-green-500/50 py-1' : ''}`}
                >
                  <span className="w-4 text-white/10 select-none text-right">{line.line}</span>
                  <span className={line.fixed ? 'text-green-400 font-medium' : 'text-white/70'}>{line.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Wiper Animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div 
              initial={{ top: -20, opacity: 0 }}
              animate={{ top: '100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                Applying Agentic Fix...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isFixed ? 'bg-secondary' : 'bg-red-500 animate-pulse'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isFixed ? 'text-secondary' : 'text-red-400'}`}>
              {isFixed ? 'Memory Leak Prevented' : 'Architecture Debt'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] text-white/40">
            {isFixed ? 'Applied context-aware cleanup pattern' : 'Missing AbortController in useEffect'}
          </span>
        </div>
        <button 
          onClick={handleFix}
          disabled={isFixed || isAnimating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[10px] font-bold ${
            isFixed 
            ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default' 
            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 active:scale-95'
          }`}
        >
          {isFixed ? (
            <>
              <Check className="w-3 h-3" />
              Fix Applied
            </>
          ) : (
            <>
              {isAnimating ? 'Fixing...' : 'Apply Fix'}
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* Floating Badge */}
      <motion.div 
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute -top-6 -right-6 p-4 rounded-2xl bg-glass-vibrant shadow-2xl border border-white/10 backdrop-blur-xl z-20 hidden sm:block"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFixed ? 'bg-green-500/20' : 'bg-primary/20'}`}>
            <Terminal className={`w-5 h-5 ${isFixed ? 'text-green-400' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Prix Engine</p>
            <p className="text-[9px] text-white/40">
              {isFixed ? 'Security scan: Clean' : 'Fixing architectural debt...'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
