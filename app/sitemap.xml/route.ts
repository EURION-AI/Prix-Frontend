import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://www.prixai.xyz'
  const now = new Date().toISOString()

  const urls = [
    { url: baseUrl, changefreq: 'weekly', priority: 1 },
    { url: `${baseUrl}/pricing`, changefreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/features`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/feedback`, changefreq: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/login`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/checkout`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/demo`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/affiliate`, changefreq: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog/reduce-code-review-time`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-01-15T00:00:00.000Z' },
    { url: `${baseUrl}/blog/ai-code-review-best-practices`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-01-10T00:00:00.000Z' },
    { url: `${baseUrl}/blog/manual-code-review-problems`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-01-05T00:00:00.000Z' },
    { url: `${baseUrl}/blog/ai-code-review-guide-2026`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-02-01T00:00:00.000Z' },
    { url: `${baseUrl}/blog/technical-debt-ai-analysis`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-02-15T00:00:00.000Z' },
    { url: `${baseUrl}/blog/security-vulnerabilities-automated-review`, changefreq: 'monthly', priority: 0.8, lastmod: '2024-03-01T00:00:00.000Z' },
    { url: `${baseUrl}/compare`, changefreq: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/changelog`, changefreq: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/legal/terms`, changefreq: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, changefreq: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/cookies`, changefreq: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/security`, changefreq: 'monthly', priority: 0.3 },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod || now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Vercel-CDN-Cache-Control': 'no-cache',
    },
  })
}
