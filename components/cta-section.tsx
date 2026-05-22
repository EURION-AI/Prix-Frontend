'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] mb-10 inline-flex">
              <span className="text-white/40 text-xs font-semibold">Free to start. No credit card required.</span>
            </div>

            <h2 className="section-title mb-6 leading-[1]">
              Ship your next PR<br />
              <span className="text-primary">with fixes auto-generated.</span>
            </h2>

            <p className="text-white/50 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Automatic fixes. Implementation plans. Actionable steps.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Button
                size="lg"
                asChild
                className="h-14 px-10 rounded-xl btn-premium text-lg font-bold group w-full sm:w-auto"
              >
                <Link href="/login">
                  <span className="flex items-center gap-2">
                    Start for Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/40">
                <div className="flex items-center gap-1">
                  <div className="p-0.5 rounded-full border border-white/20">
                    <Check className="w-3 h-3 text-white/60" />
                  </div>
                  <span>Free forever</span>
                </div>
                <span className="text-white/20">•</span>
                <span>5 min setup</span>
                <span className="text-white/20">•</span>
                <span>No credit card</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Prix"
              width={300}
              height={300}
              className="w-48 h-48 md:w-64 md:h-64 object-contain opacity-60"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
