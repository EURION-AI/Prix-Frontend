'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10 inline-flex">
              <Image src="/logo.png" alt="Prix" width={20} height={20} className="rounded-md" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Free to start. No credit card required.</span>
            </div>

            <h2 className="text-editorial text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1]">
              Ship your next PR<br />
              <span className="text-primary">with fixes auto-generated.</span>
            </h2>

            <p className="text-white/50 text-lg md:text-xl mb-10 max-w-lg">
              Automatic fixes. Implementation plans. Actionable steps.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Button
                size="lg"
                className="h-14 px-10 rounded-full bg-white text-black hover:bg-white/90 transition-all text-lg font-bold group"
              >
                <span className="flex items-center gap-2">
                  Start for Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/40">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Free forever</span>
                </div>
                <span className="text-white/20">•</span>
                <span>5 min setup</span>
                <span className="text-white/20">•</span>
                <span>No credit card</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-all"
                onClick={() => window.open('/feedback', '_blank')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Share Feedback
              </Button>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-primary transition-colors px-4 py-2"
              >
                Read the Blog
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <Image
                src="/logo.png"
                alt="Prix"
                width={400}
                height={400}
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
