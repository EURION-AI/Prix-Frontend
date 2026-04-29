'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Lock, FileCheck, EyeOff, Zap, Shield } from 'lucide-react'

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
    title: "SOC 2 Type II Certified",
    description: "Our security controls and operational processes are independently audited annually to meet the highest industry standards for data protection.",
    icon: FileCheck,
    highlight: "Enterprise Ready"
  }
]

export function SecuritySection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden border-t border-white/[0.03]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-8"
          >
            <Shield className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Trust Infrastructure</span>
          </motion.div>
          
          <h2 className="text-editorial text-5xl md:text-7xl font-bold text-white mb-8 tracking-[-0.04em] leading-[1.05]">
            Architected for <br />
            <span className="text-primary">absolute security.</span>
          </h2>
          <p className="text-white/40 max-w-2xl text-lg leading-relaxed font-medium">
            <span className="text-primary font-bold">Prix</span> is built on a zero-trust foundation, ensuring your intellectual property remains private, secure, and ephemeral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1 }}
              className="group relative p-10 rounded-2xl border border-white/[0.08] bg-[#111114] hover:border-secondary/40 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 grid-surgical-dense opacity-[0.02]" />
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-700 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <feature.icon className="w-7 h-7 text-secondary" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-secondary transition-colors duration-500">
                  {feature.title}
                </h3>
                
                <p className="text-white/40 text-sm leading-[1.7] mb-10 group-hover:text-white/60 transition-colors duration-500">
                  {feature.description}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-secondary/80">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Enterprise-Grade Compliance</h4>
              <p className="text-sm text-muted-foreground">Certified for SOC 2 Type II and GDPR compliance standards.</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">256-bit</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">AES Encryption</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Uptime SLA</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
