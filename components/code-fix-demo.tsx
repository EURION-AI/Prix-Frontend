'use client'

import { useState } from 'react'
import { Check, FileCode } from 'lucide-react'

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
    <div className="w-full bg-[#0a0a0c] rounded-lg border border-white/[0.08] overflow-hidden">
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
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${isFixed ? 'bg-green-500/10 border-green-500/20' : 'border-white/[0.08] bg-white/[0.03]'}`}>
          <span className={`text-[9px] font-bold uppercase tracking-wider ${isFixed ? 'text-green-400' : 'text-white/40'}`}>
            {isFixed ? 'Fixed' : 'Issue detected'}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 font-mono text-[11px] sm:text-[13px] leading-relaxed min-h-[280px]">
        {!isFixed ? (
          <div className="space-y-1.5">
            {BUGGY_CODE.map((line, i) => (
              <div key={i} className={`flex gap-6 ${line.error ? 'bg-red-500/5 -mx-8 px-8 border-l-2 border-red-500/50 py-1' : ''}`}>
                <span className="w-4 text-white/10 select-none text-right">{line.line}</span>
                <span className={line.error ? 'text-red-400' : 'text-white/70'}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {CLEAN_CODE.map((line, i) => (
              <div
                key={i}
                className={`flex gap-6 ${line.fixed ? 'bg-green-500/5 -mx-8 px-8 border-l-2 border-green-500/50 py-1' : ''}`}
              >
                <span className="w-4 text-white/10 select-none text-right">{line.line}</span>
                <span className={line.fixed ? 'text-green-400 font-medium' : 'text-white/70'}>{line.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isFixed ? 'bg-green-500' : 'bg-white/30'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isFixed ? 'text-green-400' : 'text-white/30'}`}>
            {isFixed ? 'Memory leak prevented' : 'Architecture debt'}
          </span>
        </div>
        <button
          onClick={handleFix}
          disabled={isFixed || isAnimating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold transition-colors ${
            isFixed
              ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default'
              : 'border-white/[0.08] text-white/60 hover:text-white/80 hover:border-white/[0.15]'
          }`}
        >
          {isFixed ? (
            <>
              <Check className="w-3 h-3" />
              Fix applied
            </>
          ) : (
            <>{isAnimating ? 'Fixing...' : 'Apply fix'}</>
          )}
        </button>
      </div>
    </div>
  )
}
