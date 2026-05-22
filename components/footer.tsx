'use client'

import Image from 'next/image'
import Link from 'next/link'
import { XLogo as Twitter, LinkedinLogo as Linkedin } from '@phosphor-icons/react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
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

export function Footer() {
  return (
    <footer className="bg-black pt-16 pb-10 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Prix" width={40} height={40} className="rounded-lg" />
              <span className="text-lg font-bold tracking-tight text-white">Prix</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Auto-fixes bugs, generates implementation plans, and accelerates your development workflow. No configuration required.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-white mb-5 tracking-wider uppercase">{category}</h4>
              <ul className="space-y-3">
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

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Prix Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/prix_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Follow Prix AI on X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/eurion-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Follow Prix AI on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
