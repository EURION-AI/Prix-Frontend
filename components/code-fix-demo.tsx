'use client'

import { motion } from 'framer-motion'
import { Check, X, Terminal, FileCode, ArrowRight } from 'lucide-react'

export function CodeFixDemo() {
  return (
    <div className="relative w-full max-w-xl xl:max-w-2xl bg-[#0a0a0c] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden group">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-mono text-white/40 tracking-tight">auth-provider.tsx</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">AI Analysis</span>
          </div>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 sm:p-6 font-mono text-[11px] sm:text-[13px] leading-relaxed">
        <div className="space-y-1">
          <div className="flex gap-4 text-white/20">
            <span className="w-4 select-none">12</span>
            <span className="text-white/80">export function AuthProvider(&#123; children &#125;) &#123;</span>
          </div>
          <div className="flex gap-4 text-white/20">
            <span className="w-4 select-none">13</span>
            <span className="text-white/80">  const [user, setUser] = useState(null)</span>
          </div>
          
          {/* The Fix */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="relative"
          >
            <div className="flex gap-4 bg-red-500/10 border-l-2 border-red-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-red-500/40 select-none">14</span>
              <span className="text-red-400/80 line-through decoration-red-500/50">  useEffect(() =&gt; &#123; fetchUser() &#125;, [])</span>
            </div>
            <div className="flex gap-4 bg-green-500/10 border-l-2 border-green-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-green-500/40 select-none">15</span>
              <span className="text-green-400/90 font-semibold">  useEffect(() =&gt; &#123; </span>
            </div>
            <div className="flex gap-4 bg-green-500/10 border-l-2 border-green-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-green-500/40 select-none">16</span>
              <span className="text-green-400/90 font-semibold">    const controller = new AbortController();</span>
            </div>
            <div className="flex gap-4 bg-green-500/10 border-l-2 border-green-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-green-500/40 select-none">17</span>
              <span className="text-green-400/90 font-semibold">    fetchUser(&#123; signal: controller.signal &#125;);</span>
            </div>
            <div className="flex gap-4 bg-green-500/10 border-l-2 border-green-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-green-500/40 select-none">18</span>
              <span className="text-green-400/90 font-semibold">    return () =&gt; controller.abort();</span>
            </div>
            <div className="flex gap-4 bg-green-500/10 border-l-2 border-green-500/50 py-1 -mx-6 px-6">
              <span className="w-4 text-green-500/40 select-none">19</span>
              <span className="text-green-400/90 font-semibold">  &#125;, [])</span>
            </div>
          </motion.div>

          <div className="flex gap-4 text-white/20">
            <span className="w-4 select-none">20</span>
            <span className="text-white/80">  return &lt;Context.Provider value=&#123;user&#125;&gt;&#123;children&#125;&lt;/Context.Provider&gt;</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Memory Leak Prevented</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] text-white/40">Analysis: Architecture-aware cleanup pattern</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[10px] font-bold text-white/80">
          Apply Fix
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Floating Badge */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 p-4 rounded-2xl bg-glass-vibrant shadow-2xl border border-white/10 backdrop-blur-xl z-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Prix Engine</p>
            <p className="text-[9px] text-white/40">Fixing architectural debt...</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
