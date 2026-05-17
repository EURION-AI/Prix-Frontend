'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { List as Menu, X } from '@phosphor-icons/react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navLinks = [
    { href: '/demo', label: 'Demo' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/affiliate', label: 'Affiliate' },
    { href: '/feedback', label: 'Feedback' },
  ]

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? 'navbar-glass' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto px-6 py-4 md:py-5">
          <Link 
            href="/" 
            className="flex items-center gap-3 group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Prix" 
                width={28} 
                height={28} 
                priority
                className="rounded-lg object-contain brightness-110" 
              />
            </div>
            <span className="text-base font-black tracking-tighter text-white">Prix</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/90 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-white/60 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <NavbarAuthButton />
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[98]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0a0a0f]/95 backdrop-blur-xl border-l border-white/[0.06] z-[99] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <span className="text-xs font-bold tracking-tight text-white uppercase">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 text-white/60 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg text-sm font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-white/10">
                <NavbarAuthButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavbarAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/user')
        setIsLoggedIn(response.ok)
      } catch {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="w-[90px] h-[34px] bg-white/5 rounded-md animate-pulse" />
    )
  }

  return (
    <Link
      href={isLoggedIn ? "/dashboard" : "/login"}
      className="text-[10px] font-semibold uppercase tracking-wider text-black hover:text-black/80 transition-all duration-200 px-5 py-2.5 bg-white rounded-lg hover:bg-white/90"
    >
      {isLoggedIn ? "Dashboard" : "Start Free"}
    </Link>
  )
}
