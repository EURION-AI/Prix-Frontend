export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

const homepage = `# Prix AI - AI-Powered GitHub PR Reviewer | Ship Code Faster

Prix automatically reviews your GitHub pull requests, suggests fixes, and raises PRs — helping you ship faster with fewer bugs.

Prix understands your codebase architecture. Get automatic fixes, implementation plans, and actionable guidance before your users do.

## Key Features

- **Auto-Fix & Planning** — Automatic bug detection and fix generation
- **Architecture Analysis** — Understands your codebase context and patterns
- **Security Scanning** — Detects vulnerabilities before they ship
- **PR Automation** — Reviews every PR automatically

## How It Works

1. Install the GitHub app
2. Open a pull request
3. Prix automatically reviews and suggests fixes
4. Apply fixes with !prix fix command
5. Generate implementation plans with !prix plan

## Pricing

- **Free**: 15 PR reviews, 3 issue plans, 3 auto fixes per month
- **Starter**: $6.99/mo — 400 reviews, 50 issue plans, unlimited fixes
- **Pro**: $9.99/mo — Unlimited reviews, plans, and fixes

Start free at https://www.prixai.xyz/login`

const pricing = `# Prix AI Pricing — AI Code Review Plans for Every Team

## Free
- 15 PR reviews per month
- 3 issue plans
- 3 auto fixes
- GitHub integration
- Community support
- **$0/mo**

## Starter
- 400 PR reviews per month
- 50 issue plans
- Unlimited auto fixes
- Priority support
- Advanced security scanning
- **$6.99/mo**

## Pro
- Unlimited PR reviews
- Unlimited issue plans
- Unlimited auto fixes
- Priority support
- Advanced security scanning
- Architecture analysis
- Team features
- **$9.99/mo**

Get started at https://www.prixai.xyz/login`

const features = `# AI Code Review Features | Prix AI — Automated PR Analysis & Fix Generation

The platform that fixes, plans, and accelerates your workflow. Ship code faster with fixes, implementation plans, and actionable engineering steps built into your development process.

## Auto-Fix (prix fix)
Automatically generates fixes for bugs and issues found in your code. Prix understands your codebase architecture and creates production-ready fixes.

## Implementation Plans (prix plan)
Get step-by-step implementation plans for new features, refactors, and architecture changes. Plans include file-by-file breakdowns with code snippets.

## Security Scanning
Automatically detects SQL injection, XSS, hardcoded secrets, and other security vulnerabilities. Scanning is baked into every code review.

## Architecture Analysis
Prix understands your entire codebase — dependencies, patterns, and conventions — giving context-aware feedback.

## Seamless GitHub Integration
Install the GitHub app, open a PR, and Prix handles the rest. Automatic reviews on every pull request.

Get started at https://www.prixai.xyz/login`

const blogIndex = `# Blog | Prix AI - Insights on AI Code Review & Engineering Velocity

Articles, guides, and best practices for modern engineering teams focused on velocity and code quality.

## Latest Posts

1. **Getting Started with AI Code Review: A Complete Guide for 2026**
   - New to AI-powered code review? This comprehensive guide covers everything from setup to best practices.
   - Read: https://www.prixai.xyz/blog/ai-code-review-guide-2026

2. **AI Code Review Best Practices for Engineering Teams**
   - Learn proven best practices for implementing AI code review in your workflow.
   - Read: https://www.prixai.xyz/blog/ai-code-review-best-practices

3. **How to Reduce Code Review Time by 80% with AI**
   - Discover how AI-powered code review automation can reduce review time by 80%.
   - Read: https://www.prixai.xyz/blog/reduce-code-review-time

4. **How to Fix Security Vulnerabilities with Automated Code Review**
   - Learn how AI code review tools detect SQL injection, XSS, hardcoded secrets.
   - Read: https://www.prixai.xyz/blog/security-vulnerabilities-automated-review

5. **Why Manual Code Reviews Are Slowing Your Team Down**
   - Discover the hidden costs of manual code reviews and their impact on velocity.
   - Read: https://www.prixai.xyz/blog/manual-code-review-problems

6. **Reducing Technical Debt with AI-Powered Code Analysis**
   - Discover how AI code review identifies code smells and refactoring opportunities.
   - Read: https://www.prixai.xyz/blog/technical-debt-ai-analysis`

const blogAiCodeReviewGuide = `# Getting Started with AI Code Review: A Complete Guide for 2026

**Published**: May 4, 2026 | **Reading time**: 8 min

New to AI-powered code review? This comprehensive 2026 guide covers everything from setup to best practices, helping your team achieve 80% faster review cycles and higher code quality.

## What is AI Code Review?

AI code review uses machine learning models to analyze pull requests automatically. Unlike traditional linters that check syntax, AI reviewers understand code semantics, architecture patterns, and business logic.

## Why AI Code Review Matters

- 80% faster review cycles
- 95% bug detection rate
- Zero false positives with proper tuning
- Consistent reviews every time
- 24/7 availability

## Setting Up Prix AI

1. Install the Prix GitHub app from GitHub Marketplace
2. Select repositories to monitor
3. Open a pull request — Prix automatically reviews it
4. Use !prix fix for auto-generated fixes
5. Use !prix plan for implementation plans

## Best Practices

- Start with a few repositories before scaling
- Review AI suggestions critically in the beginning
- Use !prix plan for complex features
- Combine AI review with human oversight for critical systems

Read the full article at https://www.prixai.xyz/blog/ai-code-review-guide-2026`

const blogAiCodeReviewBestPractices = `# AI Code Review Best Practices for Engineering Teams

**Published**: Jan 10, 2024 | **Updated**: Apr 24, 2026 | **Reading time**: 9 min

Learn proven best practices for implementing AI code review in your workflow. Discover how top engineering teams maximize code quality and development velocity with automated PR analysis.

## Key Best Practices

1. **Start Small** — Begin with non-critical repositories
2. **Set Clear Review Standards** — Define what the AI should flag
3. **Review AI Feedback** — Treat AI as a junior reviewer at first
4. **Customize Rules** — Tailor detection to your stack
5. **Combine with Human Review** — AI handles routine checks, humans focus on architecture
6. **Measure Impact** — Track review time, bug catch rate, and developer satisfaction

## Common Pitfalls to Avoid

- Relying solely on AI without human oversight
- Not configuring AI for your specific tech stack
- Ignoring AI suggestions without investigation
- Using AI review as a bottleneck rather than an accelerator

Read the full article at https://www.prixai.xyz/blog/ai-code-review-best-practices`

const blogReduceReviewTime = `# How to Reduce Code Review Time by 80% with AI

**Published**: Jan 15, 2024 | **Updated**: Apr 24, 2026 | **Reading time**: 8 min

Discover how AI-powered code review automation can reduce review time by 80%, eliminate bottlenecks, and help development teams ship faster.

## The Review Time Problem

Traditional code reviews take 4-24 hours on average. Backlogs grow, context is lost, and developers context-switch repeatedly. AI code review solves this by providing instant first-pass analysis.

## How AI Reduces Review Time

- **Instant Analysis**: AI reviews within seconds of PR creation
- **Automated Bug Detection**: Catches common bugs without human effort
- **Fix Generation**: Suggests fixes that reviewers can approve with one click
- **Parallel Review**: AI reviews while humans review architecture
- **Reduced Back-and-Forth**: AI catches style and logic issues early

## Implementation Strategy

1. Deploy AI review on every PR automatically
2. Configure severity thresholds
3. Train team on !prix fix and !prix plan commands
4. Measure and iterate

Read the full article at https://www.prixai.xyz/blog/reduce-code-review-time`

const blogSecurityVulnerabilities = `# How to Fix Security Vulnerabilities with Automated Code Review

**Published**: Apr 28, 2026 | **Reading time**: 10 min

Security breaches cost companies millions. Learn how AI code review tools detect SQL injection, XSS, hardcoded secrets, and vulnerabilities before they reach production.

## Vulnerabilities AI Can Detect

- **SQL Injection**: Unsanitized user input in database queries
- **Cross-Site Scripting (XSS)**: Unescaped output in templates
- **Hardcoded Secrets**: API keys, tokens, passwords in source code
- **Insecure Dependencies**: Outdated packages with known CVEs
- **Path Traversal**: Unsafe file path operations
- **Insecure Deserialization**: Unsafe data deserialization patterns

## Why Traditional Scanning Falls Short

- Static analysis tools have high false positive rates
- DAST tools only catch runtime issues
- Manual security review is slow and expensive
- SAST tools miss context-dependent vulnerabilities

Read the full article at https://www.prixai.xyz/blog/security-vulnerabilities-automated-review`

const blogManualReviewProblems = `# Why Manual Code Reviews Are Slowing Your Team Down

**Published**: Jan 5, 2024 | **Updated**: Apr 24, 2026 | **Reading time**: 11 min

Discover the hidden costs of manual code reviews and how they impact your engineering velocity, team morale, and bottom line.

## The Hidden Costs

- **Time Drain**: Senior engineers spend 4-8 hours/week on reviews
- **Context Switching**: Developers lose 23 minutes per interruption
- **Inconsistency**: Different reviewers catch different issues
- **Bottlenecks**: Reviews wait on specific individuals
- **Burnout**: Review fatigue leads to rubber-stamping
- **Delayed Shipments**: Features wait days for approval

## Why Teams Switch to AI

- Instant feedback on every PR
- Consistent standards across the team
- 80% reduction in review time
- Senior engineers freed for architecture work
- Happier, more productive development teams

Read the full article at https://www.prixai.xyz/blog/manual-code-review-problems`

const blogTechnicalDebt = `# Reducing Technical Debt with AI-Powered Code Analysis

**Published**: Apr 18, 2026 | **Reading time**: 10 min

Technical debt slowing your feature delivery? Discover how AI code review identifies code smells, complexity hotspots, and refactoring opportunities automatically.

## Types of Technical Debt AI Can Detect

- **Code Smells**: Long methods, large classes, excessive nesting
- **Complexity Hotspots**: Cyclomatic complexity, deep nesting
- **Dead Code**: Unused imports, functions, variables
- **Inconsistent Patterns**: Mixed coding conventions
- **Duplicated Code**: Copy-paste violations
- **Poor Error Handling**: Missing try-catch, swallowed exceptions

## The Technical Debt Problem

- 40% of development time spent understanding existing code
- Technical debt slows feature delivery by 30-50%
- Most teams don't measure or track debt systematically

## How AI Helps

- Automatic debt discovery on every PR
- Prioritized fix suggestions
- Trend tracking over time
- Prevents new debt from being introduced

Read the full article at https://www.prixai.xyz/blog/technical-debt-ai-analysis`

const markdownContent: Record<string, string> = {
  index: homepage,
  pricing,
  features,
  blog: blogIndex,
  'blog/ai-code-review-guide-2026': blogAiCodeReviewGuide,
  'blog/ai-code-review-best-practices': blogAiCodeReviewBestPractices,
  'blog/reduce-code-review-time': blogReduceReviewTime,
  'blog/security-vulnerabilities-automated-review': blogSecurityVulnerabilities,
  'blog/manual-code-review-problems': blogManualReviewProblems,
  'blog/technical-debt-ai-analysis': blogTechnicalDebt,
}

export function getMarkdownForSlug(slug: string): string | null {
  const normalized = slug.replace(/^\/+|\/+$/g, '') || 'index'
  return markdownContent[normalized] ?? null
}

export function isSupportedSlug(slug: string): boolean {
  const normalized = slug.replace(/^\/+|\/+$/g, '') || 'index'
  return normalized in markdownContent
}
