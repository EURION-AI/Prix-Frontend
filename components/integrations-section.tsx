'use client'

import { motion } from 'framer-motion'
import { Github, Code2, Terminal, Globe, Smartphone, Coffee } from 'lucide-react'

const integrations = [
  { name: 'GitHub', icon: Github, color: '#ffffff' },
  { name: 'VS Code', icon: Code2, color: '#007ACC' },
  { name: 'JetBrains', icon: Coffee, color: '#FF318C' },
  { name: 'GitLab', icon: Globe, color: '#FC6D26' },
  { name: 'Bitbucket', icon: Smartphone, color: '#0052CC' },
  { name: 'CLI', icon: Terminal, color: '#22C55E' },
]

export function IntegrationsSection() {
  return (
    <section className="py-32 bg-[#030305] border-y border-white/5 overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-24 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary mb-8 block font-bold">
            06 — Ecosystem
          </span>
          <h2 className="text-editorial text-5xl md:text-7xl font-bold text-white mb-8">
            Works where <br />
            <span className="text-primary">you do.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            Prix integrates natively with your existing development stack. No context switching required.
          </p>
        </div>

        <div className="relative">
          {/* Marquee-like movement */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {integrations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-4 group"
              >
                <div 
                  className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:glow-pink"
                >
                  <item.icon className="w-8 h-8 text-white/40 group-hover:text-white transition-colors duration-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10" />
        </div>
      </div>
    </section>
  )
}
