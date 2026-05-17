'use client'

import { motion } from 'framer-motion'

export function VisionSection() {
  return (
    <section className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="section-title text-5xl md:text-[80px] leading-[0.9]">
              Engineering <br />as an <span className="text-primary">art.</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="text-xl text-white/50 leading-relaxed max-w-lg mb-8">
              <span className="text-primary font-bold">Prix</span> is built for teams who treat software not just as a product, but as a craft.
            </p>
            <div className="space-y-6">
              <div className="h-px w-full bg-white/[0.06]" />
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="text-white font-bold mb-2">Our Mission</h4>
                  <p className="text-sm text-white/40 leading-relaxed">To eliminate the friction between intent and execution through automated code analysis and fix generation.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Our Standards</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Absolute precision. Zero false positives. Enterprise-grade security by default.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
