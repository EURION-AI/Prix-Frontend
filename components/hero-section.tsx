'use client'

import { motion } from 'framer-motion'
import { CodeFixDemo } from './code-fix-demo'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-[60] w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-32 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8 xl:gap-16 2xl:gap-20 items-center min-h-[calc(100vh-200px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Engineering Assistant • Auto-Fix & Planning</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-editorial text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold text-white mb-8 leading-[1.05] tracking-tight max-w-4xl"
            >
              Ship code that&apos;s already fixed.<br />
              <span className="text-white">Plans generated. Every PR.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl text-base sm:text-lg md:text-xl text-white/50 leading-relaxed mb-10"
            >
              Prix understands your codebase architecture. Get automatic fixes, implementation plans, and actionable guidance before your users do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-5 mb-10"
            >
              <Button
                size="lg"
                asChild
                className="h-14 px-8 rounded-xl btn-premium text-base group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              >
                <Link href="/login">
                  <span className="relative z-10 flex items-center gap-3 font-semibold">
                    Start Free. No Credit Card.
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-base transition-all duration-300"
              >
                <Link href="/features">
                  Explore Features
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="h-14 px-8 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Link href="#demo">
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm text-white/40"
            >
              {['5-min setup', 'Free forever plan', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-3xl blur-xl opacity-30" />
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-2 border border-white/10">
                <CodeFixDemo />
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}