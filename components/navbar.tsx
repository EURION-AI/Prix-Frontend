'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const navLinks = [
    { href: '/demo', label: 'Demo' },
    { href: '/features', label: 'Features' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/feedback', label: 'Feedback' },
    { href: '/affiliate', label: 'Earn Free', isHighlight: true },
  ]

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 md:p-6 pointer-events-none"
      >
        <div className="flex items-center justify-between w-full max-w-7xl pointer-events-auto bg-[#050507]/80 backdrop-blur-md px-4 md:px-8 py-4 rounded-xl border border-white/[0.08] shadow-2xl">
          <div className="flex items-center gap-4 md:gap-10 flex-1">
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
              <span className="text-sm font-bold tracking-tight text-white uppercase hidden md:block">Prix</span>
            </Link>

            <div className="hidden xl:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    link.isHighlight 
                      ? 'text-primary hover:text-primary/80' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden xl:block">
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
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0a0a0f] border-l border-white/10 z-[99] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-sm font-bold tracking-tight text-white uppercase">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                      link.isHighlight
                        ? 'text-primary bg-primary/10 hover:bg-primary/15'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
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
      <div className="w-[100px] h-[38px] bg-white/5 rounded-lg animate-pulse" />
    )
  }

  return (
    <Link
      href={isLoggedIn ? "/dashboard/profile" : "/login"}
      className="text-[11px] font-bold uppercase tracking-wider text-black hover:text-black/80 transition-all duration-200 px-6 py-2.5 bg-white rounded-lg hover:bg-white/90 font-medium"
    >
      {isLoggedIn ? "Profile" : "Start Free"}
    </Link>
  )
}