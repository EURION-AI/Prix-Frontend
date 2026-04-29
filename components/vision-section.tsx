'use client'

import { motion } from 'framer-motion'

export function VisionSection() {
  return (
    <section className="py-48 bg-[#030305] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
              08 — The Vision
            </span>
            <h2 className="text-editorial text-5xl md:text-[90px] font-bold text-white mb-12 leading-[0.85]">
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
            <p className="text-2xl text-muted-foreground leading-relaxed max-w-lg mb-8">
              <span className="text-primary font-bold">Prix</span> is built for teams who treat software not just as a product, but as a craft.
            </p>
            <div className="space-y-6">
              <div className="h-px w-full bg-white/10" />
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-white font-bold mb-2">Our Mission</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">To eliminate the friction between intent and execution through agentic structural reasoning.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2 text-secondary">Our Standards</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Absolute precision. Zero false positives. Enterprise-grade security by default.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
