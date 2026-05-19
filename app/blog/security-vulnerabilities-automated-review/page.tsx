import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, User, ArrowLeft, ArrowRight, CheckCircle, Shield, AlertTriangle, Lock, Eye, Bug, FileCode, Terminal } from 'lucide-react'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/jsonld'

const vulnerabilities = [
  {
    icon: Bug,
    title: 'SQL Injection',
    severity: 'Critical',
    description: 'Unsanitized user input directly concatenated into SQL queries. Can expose entire databases.',
    example: `// VULNERABLE CODE
const query = "SELECT * FROM users WHERE id = " + req.body.userId;
db.query(query);`,
    fix: `// SECURE CODE
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [req.body.userId]);`,
  },
  {
    icon: Eye,
    title: 'Cross-Site Scripting (XSS)',
    severity: 'High',
    description: 'User input rendered without escaping allows attackers to inject malicious scripts.',
    example: `// VULNERABLE CODE
element.innerHTML = userInput;`,
    fix: `// SECURE CODE
element.textContent = userInput;
// Or use proper sanitization:
element.innerHTML = DOMPurify.sanitize(userInput);`,
  },
  {
    icon: Lock,
    title: 'Hardcoded Secrets',
    severity: 'Critical',
    description: 'API keys, passwords, and tokens committed to source code. Exposed in every commit history.',
    example: `// VULNERABLE CODE
const API_KEY = "sk-1234567890abcdef";
const dbPassword = "SuperSecret123!";`,
    fix: `// SECURE CODE
const API_KEY = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;`,
  },
  {
    icon: Terminal,
    title: 'Command Injection',
    severity: 'Critical',
    description: 'User input passed directly to shell commands. Attackers can execute arbitrary system commands.',
    example: `// VULNERABLE CODE
exec("ping " + userInput);`,
    fix: `// SECURE CODE
execFile("ping", [userInput], { timeout: 5000 });`,
  },
]

const stats = [
  { value: '$4.45M', label: 'Avg Breach Cost', icon: AlertTriangle },
  { value: '280 days', label: 'Avg Detection Time', icon: Clock },
  { value: '95%', label: 'Preventable with AI', icon: Shield },
  { value: '<5 min', label: 'Fix Time', icon: CheckCircle },
]

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <BreadcrumbJsonLd items={[{ label: 'Blog', href: '/blog' }, { label: 'Security Vulnerabilities Automated Review', href: '/blog/security-vulnerabilities-automated-review' }]} />
      
      <article className="pt-32 pb-20 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12">


            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Security</Badge>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Calendar className="w-4 h-4" />
                April 28, 2026
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Clock className="w-4 h-4" />
                6 min read
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              How to Fix <span className="text-red-400">Security Vulnerabilities</span> with Automated Code Review
            </h1>
            
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Security breaches cost companies millions. Learn how AI code review tools detect SQL injection, XSS, hardcoded secrets, and vulnerabilities before they reach production.
            </p>

            <div className="flex items-center gap-4 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Prix Team
              </div>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <Icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-white/80">
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">The Security Crisis in Modern Development</h2>
                <p className="text-lg leading-relaxed mb-4">
                  In 2025, the average cost of a data breach reached <strong>$4.45 million</strong>. What's more alarming: the average time to detect a breach is <strong>280 days</strong>. By the time you discover the vulnerability, the damage is done.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Here's the kicker: <strong>95% of security vulnerabilities in production code could have been caught during code review</strong>. The problem isn't that developers don't care about security—it's that manual review processes can't possibly catch every issue across thousands of lines of code.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Common Vulnerabilities AI Catches Instantly</h2>
                <div className="space-y-6">
                  {vulnerabilities.map((vuln, index) => {
                    const Icon = vuln.icon
                    return (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-white">{vuln.title}</h3>
                                <Badge className={vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className="text-white/60">{vuln.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-black/30">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Vulnerable Code
                              </div>
                              <pre className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-white/70 overflow-x-auto">
                                <code>{vuln.example}</code>
                              </pre>
                            </div>
                            <div>
                              <div className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Secure Fix
                              </div>
                              <pre className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-white/70 overflow-x-auto">
                                <code>{vuln.fix}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">How AI Security Code Review Works</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Pattern Matching:</strong> Identifies known dangerous patterns like unsanitized input
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Data Flow Analysis:</strong> Tracks user input through the application to find injection points
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Secret Detection:</strong> Uses entropy analysis and regex patterns to find API keys and passwords
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Context Awareness:</strong> Understands your framework (React, Django, etc.) and framework-specific vulnerabilities
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Continuous Learning:</strong> Updates detection rules based on new CVEs and attack patterns
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Real-World Impact</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
                  <blockquote className="text-xl text-white/80 italic mb-6">
                    "We caught a SQL injection vulnerability in a PR that had already passed two human reviewers. The AI flagged it in seconds. That one catch probably saved us from a breach that would have exposed 50,000 customer records."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Security Lead</div>
                      <div className="text-white/60 text-sm">FinTech Company, 200+ Engineers</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Security Best Practices with AI Review</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold flex-shrink-0">1</div>
                    <div>
                      <strong className="text-white">Enable All Security Rules</strong>
                      <p className="text-white/60">Don't cherry-pick. Enable SQL injection, XSS, secrets detection, and all security checks from day one.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold flex-shrink-0">2</div>
                    <div>
                      <strong className="text-white">Block PRs on Critical Issues</strong>
                      <p className="text-white/60">Configure your CI/CD to prevent merging when critical vulnerabilities are detected.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold flex-shrink-0">3</div>
                    <div>
                      <strong className="text-white">Scan Dependencies Too</strong>
                      <p className="text-white/60">Use AI tools that also check for vulnerable dependencies (npm, pip, etc.) not just your code.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold flex-shrink-0">4</div>
                    <div>
                      <strong className="text-white">Educate, Don't Just Enforce</strong>
                      <p className="text-white/60">Choose tools that explain why something is vulnerable and how to fix it—building security knowledge across your team.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Don't Wait for a Breach</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Every day without automated security review is another day vulnerabilities can slip into production. The cost of prevention is minimal compared to the cost of a breach—financially, reputationally, and legally.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Modern AI code review tools make enterprise-grade security scanning accessible to teams of any size. There's no excuse for shipping vulnerable code in 2026.
                </p>
              </section>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-red-500/20 to-red-500/5 border border-red-500/20 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Secure Your Codebase Today</h3>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Join hundreds of teams using Prix to catch security vulnerabilities before they reach production.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-11 px-8 rounded-xl bg-red-500 hover:bg-red-600 w-fit">
                <Link href="/login">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white w-fit">
                <Link href="/demo">See Security Demo</Link>
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/blog/technical-debt-ai-analysis" className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">Reducing Technical Debt with AI-Powered Code Analysis</h4>
                <p className="text-white/60 text-sm">Keep your codebase healthy and maintainable.</p>
              </Link>
              <Link href="/blog/ai-code-review-guide-2026" className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">AI Code Review: Complete Guide for 2026</h4>
                <p className="text-white/60 text-sm">Everything you need to get started with AI code review.</p>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              See how Prix compares to GitHub Copilot and manual review →
            </Link>
          </div>
        </div>
      </article>
      
      <Footer />
      
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Fix Security Vulnerabilities with Automated Code Review',
            description: 'Learn how AI code review tools detect SQL injection, XSS, hardcoded secrets before production.',
            author: {
              '@type': 'Organization',
              name: 'Prix Team',
              url: 'https://www.prixai.xyz',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Prix',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.prixai.xyz/logo.png',
              },
            },
            datePublished: '2026-04-28',
            dateModified: '2026-04-28',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.prixai.xyz/blog/security-vulnerabilities-automated-review',
            },
            image: {
              '@type': 'ImageObject',
              url: 'https://www.prixai.xyz/blog/security-vulnerabilities-automated-review/og-image.jpg',
              width: 1200,
              height: 630,
            },
            keywords: ['security vulnerabilities', 'automated code review', 'SQL injection', 'XSS prevention'],
          }),
        }}
      />
    </div>
  )
}
