'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Command as CommandIcon } from 'lucide-react'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none"
    >
      <div className="flex items-center justify-between w-full max-w-7xl pointer-events-auto bg-[#050507]/80 backdrop-blur-md px-8 py-4 rounded-xl border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-10 flex-1">
          <Link 
            href="/" 
            className="flex items-center gap-3 group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image 
              src="/logo.png" 
              alt="Prix" 
              width={40} 
              height={40} 
              priority
              className="rounded-lg object-contain" 
            />
            <span className="text-sm font-bold tracking-tight text-white uppercase hidden lg:block">Prix</span>
          </Link>

          {/* Search Bar with Logo */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative group">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Image src="/logo.png" alt="" width={16} height={16} className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
              type="text" 
              placeholder="Search features, docs, or PRs..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 pl-10 pr-10 text-xs text-white/80 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/40 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/40 font-mono">K</kbd>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-8">
            <Link href="/demo" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Demo</Link>
            <Link href="/features" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Features</Link>
            <Link href="/blog" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Blog</Link>
            <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-200">Pricing</Link>
            <Link href="/affiliate" className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-all duration-200">Earn Free</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NavbarAuthButton />
        </div>
      </div>
    </motion.nav>
  )
}

function NavbarAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    setIsLoggedIn(!!userCookie)
  }, [])

  return (
    <Link 
      href={isLoggedIn ? "/dashboard" : "/login"} 
      className="text-[11px] font-bold uppercase tracking-wider text-black hover:text-black/80 transition-all duration-200 px-6 py-2.5 bg-white rounded-lg hover:bg-white/90 font-medium"
    >
      {isLoggedIn ? "Profile" : "Start Free"}
    </Link>
  )
}