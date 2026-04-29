'use client'

import Image from 'next/image'
import { Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Security', href: '/legal/security' },
  ],
}

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="bg-[#0b0b0f] border-t border-white/5 pt-20 pb-10">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Prix" width={56} height={56} className="rounded-xl" />
              <span className="text-xl font-bold tracking-tight text-white">Prix</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Auto-fixes bugs, generates implementation plans, and accelerates your development workflow. No configuration required.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label} 
                  href={social.href} 
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-primary/30 transition-all group"
                >
                  <social.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white mb-6 tracking-wider uppercase">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-white/40 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/30 tracking-wide">
            © {new Date().getFullYear()} Prix Technologies Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}