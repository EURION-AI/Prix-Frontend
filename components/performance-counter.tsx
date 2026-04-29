'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PerformanceCounter() {
  const [count, setCount] = useState(128420)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-baseline gap-2">
        <span suppressHydrationWarning className="text-3xl font-bold text-white tabular-nums tracking-tighter">
          {mounted ? count.toLocaleString('en-US') : '128,420'}
        </span>
        <span className="text-secondary text-xs font-bold uppercase tracking-wider">Seconds</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
        Saved per PR review cycle
      </p>
    </div>
  )
}
