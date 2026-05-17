import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'


export const metadata: Metadata = {
  title: 'Blog | Prix AI - Insights on AI Code Review & Engineering Velocity',
  description: 'Explore our latest articles on AI code review best practices, engineering productivity, and how to accelerate your development workflow.',
  keywords: ['AI code review blog', 'engineering productivity', 'developer velocity', 'automated PR review', 'code quality insights'],
  alternates: {
    canonical: 'https://www.prixai.xyz/blog',
    types: {
      'text/markdown': '/markdown/blog',
    },
  },
}

const blogs = [
  {
    title: 'Getting Started with AI Code Review: A Complete Guide for 2026',
    description: 'New to AI-powered code review? This comprehensive guide covers everything from setup to best practices, helping your team achieve 80% faster review cycles and higher code quality.',
    date: 'May 4, 2026',
    readTime: '8 min read',
    category: 'Guide',
    href: '/blog/ai-code-review-guide-2026',
    image: '/blog/ai-code-review-guide-2026/og-image.jpg',
    color: 'primary'
  },
  {
    title: 'How to Fix Security Vulnerabilities with Automated Code Review',
    description: 'Security breaches cost companies millions. Learn how AI code review tools detect SQL injection, XSS, and hardcoded secrets before they reach production.',
    date: 'April 28, 2026',
    readTime: '6 min read',
    category: 'Security',
    href: '/blog/security-vulnerabilities-automated-review',
    image: '/blog/security-vulnerabilities-automated-review/og-image.jpg',
    color: 'red'
  },
  {
    title: 'Reducing Technical Debt with AI-Powered Code Analysis',
    description: 'Technical debt slowing your feature delivery? Discover how AI code review identifies code smells, complexity hotspots, and refactoring opportunities automatically.',
    date: 'April 18, 2026',
    readTime: '7 min read',
    category: 'Best Practices',
    href: '/blog/technical-debt-ai-analysis',
    image: '/blog/technical-debt-ai-analysis/og-image.jpg',
    color: 'primary'
  },
  {
    title: 'How to Reduce Code Review Time by 80% with AI',
    description: 'Manual code reviews are killing your team\'s velocity. Learn how leading engineering teams use AI-powered automated PR review to eliminate bottlenecks and ship code 5x faster.',
    date: 'April 12, 2026',
    readTime: '5 min read',
    category: 'Productivity',
    href: '/blog/reduce-code-review-time',
    image: '/blog/reduce-code-review-time/og-image.jpg',
    color: 'primary'
  },
  {
    title: 'AI Code Review Best Practices for Engineering Teams',
    description: 'Implementing AI code review tools successfully requires more than just installation. Learn the proven strategies that top engineering teams use to maximize code quality.',
    date: 'April 8, 2026',
    readTime: '7 min read',
    category: 'Best Practices',
    href: '/blog/ai-code-review-best-practices',
    image: '/blog/ai-code-review-best-practices/og-image.jpg',
    color: 'primary'
  },
  {
    title: 'Why Manual Code Reviews Are Slowing Your Team Down',
    description: 'Code review backlog killing your velocity? Discover why traditional review processes fail at scale and how AI-powered tools solve the core problems.',
    date: 'April 2, 2026',
    readTime: '4 min read',
    category: 'Engineering',
    href: '/blog/manual-code-review-problems',
    image: '/blog/manual-code-review-problems/og-image.jpg',
    color: 'red'
  }
]

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      
      <main className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Blog</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-[-0.03em]">
              Engineering <span className="text-gradient-vibrant">Insights</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Articles, guides, and best practices for modern engineering teams focused on velocity and code quality.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <Link 
                key={index} 
                href={blog.href}
                className="group flex flex-col card-base hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={blog.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-semibold' : 'bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold'}>
                      {blog.category}
                    </Badge>
                    <span className="text-[10px] text-white/30 font-medium">{blog.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                        <Calendar className="w-3 h-3" />
                        {blog.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
