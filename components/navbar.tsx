'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none"
    >
      <div className="flex items-center justify-between w-full max-w-7xl pointer-events-auto bg-[#050507]/80 backdrop-blur-md px-8 py-4 rounded-xl border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.png" 
              alt="Prix" 
              width={48} 
              height={48} 
              priority
              className="rounded-lg object-contain" 
            />
            <span className="text-sm font-bold tracking-tight text-white uppercase">Prix</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/demo" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Demo</Link>
            <Link href="/features" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Features</Link>
            <Link href="/blog" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Blog</Link>
            <Link href="/#pricing" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Pricing</Link>
            <Link href="/affiliate" className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-all duration-200">Earn Free</Link>
            <Link href="/feedback" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Feedback</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-[11px] font-bold uppercase tracking-wider text-black hover:text-black/80 transition-all duration-200 px-6 py-2.5 bg-white rounded-lg hover:bg-white/90 font-medium"
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}