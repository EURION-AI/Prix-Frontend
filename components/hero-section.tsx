'use client'

import { motion } from 'framer-motion'
import { ConversationScreenshot } from './github-screenshots'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, PlayCircle, Lightning as Zap } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function HeroSection() {
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const loginHref = refCode ? `/login?ref=${refCode}` : '/login'

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-6">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative z-[60] w-full max-w-[1400px] mx-auto pt-20 md:pt-28 pb-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-[clamp(2rem,5.2vw,4.25rem)] font-bold text-white mb-6 leading-[1.02] tracking-tight max-w-2xl"
            >
              <span className="block lg:hidden">
                AI code review<br />
                That ships fixed code.<br />
                Every PR. Every time.
              </span>
              <span className="hidden lg:block">
                AI code review that<br />
                Ships fixed code.<br />
                Every PR. Every time.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-lg text-[18px] text-white/50 leading-relaxed mb-10 font-medium mx-auto lg:mx-0"
            >
              Prix AI understands your codebase architecture. Get automatic fixes, implementation plans, and actionable guidance before your users do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-6 mb-10 w-full"
            >
              <div className="w-full sm:w-auto flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="h-12 px-9 rounded-xl btn-premium text-sm font-bold group w-full sm:w-auto"
                >
                  <Link href={loginHref}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Free
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 px-4 sm:px-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all"
                >
                  <Link href="/features">
                    Explore Features
                  </Link>
                </Button>

                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 text-white/50 hover:text-white transition-colors font-bold group py-2 sm:py-0"
                >
                  <span className="text-sm">Watch Demo</span>
                  <PlayCircle className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center lg:justify-start gap-x-2 gap-y-2 sm:gap-8 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-white/30 w-full"
            >
              {['5-min setup', 'Free forever plan', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full -z-10" />
            <div className="w-full max-w-[560px] xl:max-w-[580px]">
              <ConversationScreenshot />
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-14 py-5 px-5 md:px-10 rounded-2xl bg-white/[0.015] border border-white/[0.05] flex items-center justify-between gap-8 w-full overflow-x-auto overflow-y-hidden"
        >
          <div className="flex items-center gap-6 border-r border-white/10 pr-10 shrink-0">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Built for engineering teams</span>
          </div>

          <div className="flex flex-1 items-center justify-between gap-4 md:gap-8 px-2 text-white/45 transition-colors duration-300 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image src="/logos/nextjs.svg" alt="Next.js" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">Next.js</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/logos/typescript.svg" alt="TypeScript" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">TypeScript</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/logos/python.svg" alt="Python" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">Python</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/logos/fastapi.svg" alt="FastAPI" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">FastAPI</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/logos/react.svg" alt="React" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">React</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/logos/rails.svg" alt="Rails" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-bold">Rails</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
