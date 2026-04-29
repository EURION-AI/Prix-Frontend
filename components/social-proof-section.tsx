'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "Prix cut our PR review time by 80%. The auto-fix feature is a game changer for our open source projects.",
    name: "ShaikhWarsi",
    handle: "@ShaikhWarsi",
    role: "Open Source Maintainer",
    initials: "SW"
  },
  {
    quote: "Finally an AI tool that actually fixes code instead of just pointing out problems. Our team ships faster with Prix.",
    name: "Rachit Tiwari",
    handle: "@RachitTiwari",
    role: "Software Engineer",
    initials: "RT"
  }
]

export function SocialProofSection() {
  return (
    <section className="py-32 bg-background border-y border-white/[0.03]">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-2xl"
              >
                <blockquote className="text-lg text-white/80 leading-relaxed mb-6">
                  <span className="text-primary">&quot;</span>
                  {testimonial.quote}
                  <span className="text-primary">&quot;</span>
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/40">{testimonial.handle}</p>
                    <p className="text-xs text-primary mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Integrations</span>
            <div className="flex items-center gap-10 opacity-40">
              {['GitHub', 'GitLab', 'VS Code', 'JetBrains'].map((brand) => (
                <span key={brand} className="text-sm font-bold text-white/50">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}