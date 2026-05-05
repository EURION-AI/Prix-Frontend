import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


export const metadata: Metadata = {
  title: 'Blog | Prix AI - Insights on AI Code Review & Engineering Velocity',
  description: 'Explore our latest articles on AI code review best practices, engineering productivity, and how to accelerate your development workflow.',
  keywords: ['AI code review blog', 'engineering productivity', 'developer velocity', 'automated PR review', 'code quality insights'],
  alternates: {
    canonical: './',
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Engineering <span className="text-gradient-vibrant">Insights</span>
            </h1>
            <p className="text-xl text-white/60">
              Articles, guides, and best practices for modern engineering teams focused on velocity and code quality.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <Link 
                key={index} 
                href={blog.href}
                className="group flex flex-col bg-white/[0.1] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-white/[0.15] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] bg-white/5 relative overflow-hidden">
                  <Image 
                    src={blog.image} 
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className={blog.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}>
                      {blog.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-white/40 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {blog.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                  
                  <p className="text-white/60 mb-8 line-clamp-3 leading-relaxed">
                    {blog.description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-primary font-semibold group/link">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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
