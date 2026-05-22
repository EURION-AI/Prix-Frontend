'use client'

import { motion } from 'framer-motion'
import { EyeSlash as EyeOff, Lock, CheckCircle as FileCheck, ShieldCheck } from '@phosphor-icons/react'

const securityFeatures = [
  {
    title: "Zero-Retention Architecture",
    description: "Your source code is never stored on our disks. We perform real-time analysis and purge all review data immediately after processing.",
    icon: EyeOff,
    highlight: "Privacy by Design"
  },
  {
    title: "SSL-Grade Encryption",
    description: "End-to-end TLS 1.3 encryption ensures your intellectual property is protected during transit between GitHub and our inference engine.",
    icon: Lock,
    highlight: "E2E Protected"
  },
  {
    title: "Secure Infrastructure",
    description: "Built with security best practices and regular monitoring to ensure your code remains protected throughout the review process.",
    icon: FileCheck,
    highlight: "Security First"
  }
]

export function SecuritySection() {
  return (
    <section className="section-padding bg-[#0a0a0f] border-t border-white/[0.03]">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">
            Architected for <br />
            <span className="text-primary">absolute security.</span>
          </h2>
          <p className="section-subtitle">
            <span className="text-primary font-bold">Prix</span> is built on a zero-trust foundation, ensuring your intellectual property remains private, secure, and ephemeral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1 }}
              className="card-base p-8"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-8">
                  <feature.icon className="w-6 h-6 text-white/40" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 md:p-8 card-base flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
              <ShieldCheck className="w-7 h-7 text-white/30" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Enterprise-Grade Security</h4>
              <p className="text-sm text-white/40">Built with security best practices and encryption standards.</p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-center">
              <p className="text-xl font-bold text-white">256-bit</p>
              <p className="text-xs text-white/40">AES Encryption</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">99.9%</p>
              <p className="text-xs text-white/40">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
