import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const content = `# Prix AI — AI-Powered GitHub PR Reviewer

> Prix automatically reviews GitHub pull requests, catches bugs, suggests fixes, and raises PRs — helping engineering teams ship faster with fewer bugs.

## Site Structure

- **/** — Homepage. Hero: "AI Code Review That Ships Fixed Code — Every PR. Every Time."
- **/pricing** — Pricing plans: Free (15 reviews/mo), Starter ($6.99/mo, 400 reviews), Pro ($9.99/mo, unlimited)
- **/features** — Feature overview: auto-fix, architecture analysis, security scanning, PR planning
- **/blog** — Engineering blog index
- **/blog/ai-code-review-guide-2026** — Complete guide to AI code review for 2026
- **/blog/ai-code-review-best-practices** — Best practices for AI code review in teams
- **/blog/reduce-code-review-time** — How to reduce review time by 80% with AI
- **/blog/security-vulnerabilities-automated-review** — Detecting security vulns with automated review
- **/blog/manual-code-review-problems** — Problems with manual code reviews
- **/blog/technical-debt-ai-analysis** — Reducing technical debt with AI analysis
- **/compare** — Prix vs GitHub Copilot vs Manual code review
- **/changelog** — Product changelog and updates
- **/contact** — Contact and support
- **/demo** — How Prix AI works documentation
- **/affiliate** — Affiliate program
- **/legal/terms** — Terms of Service
- **/legal/privacy** — Privacy Policy
- **/legal/cookies** — Cookie Policy
- **/legal/security** — Security practices

## Markdown Twin

Every key page has a markdown twin available at \`/markdown/<slug>\` with \`Content-Type: text/markdown\`. These are designed for AI crawlers and LLM consumption.

| HTML Page | Markdown Twin |
|-----------|---------------|
| / | /markdown |
| /pricing | /markdown/pricing |
| /features | /markdown/features |
| /blog | /markdown/blog |
| /blog/* | /markdown/blog/* |

## Key Features

- Automatic PR review with bug detection
- Automated fix generation (!prix fix)
- Implementation planning (!prix plan)
- Security vulnerability scanning
- Architecture-aware analysis
- GitHub integration with automatic PR analysis

## Technology

- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4
- Payments: Razorpay, PayPal
- Deployment: Vercel/Netlify`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  })
}
