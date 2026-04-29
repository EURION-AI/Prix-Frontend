import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  const websites = [
    {
      id: 'site_1',
      name: 'acme-corp.dev',
      uniqueVisitors: 4829 * multiplier,
      sessions: 8234 * multiplier,
      pageViews: 28456 * multiplier,
      bounceRate: 42.3,
      avgSessionDuration: 187,
      pagesPerSession: 3.5,
      scrollDepth: 58,
      exitRate: 28,
      newVsReturning: { new: 62, returning: 38 },
      geography: [
        { country: 'United States', visitors: 2456 },
        { country: 'United Kingdom', visitors: 892 },
        { country: 'Germany', visitors: 543 },
        { country: 'Canada', visitors: 421 },
        { country: 'France', visitors: 312 },
      ],
      devices: [
        { type: 'Desktop', visitors: 68 },
        { type: 'Mobile', visitors: 28 },
        { type: 'Tablet', visitors: 4 },
      ],
      trafficSources: [
        { source: 'Direct', visitors: 1823 },
        { source: 'Organic Search', visitors: 1456 },
        { source: 'Referral', visitors: 892 },
        { source: 'Social', visitors: 445 },
        { source: 'Email', visitors: 213 },
      ],
      campaigns: [
        { name: 'Summer Launch', visitors: 1245, conversions: 89 },
        { name: 'Product Update', visitors: 876, conversions: 45 },
        { name: 'Holiday Promo', visitors: 654, conversions: 23 },
      ],
      topReferrers: [
        { domain: 'github.com', visitors: 2345 },
        { domain: 'twitter.com', visitors: 1234 },
        { domain: 'reddit.com', visitors: 567 },
      ],
      trafficTrendChart: generateTrendData(30),
    },
    {
      id: 'site_2',
      name: 'startup-io.app',
      uniqueVisitors: 3245 * multiplier,
      sessions: 5623 * multiplier,
      pageViews: 19234 * multiplier,
      bounceRate: 38.7,
      avgSessionDuration: 212,
      pagesPerSession: 3.8,
      scrollDepth: 62,
      exitRate: 24,
      newVsReturning: { new: 71, returning: 29 },
      geography: [
        { country: 'United States', visitors: 1567 },
        { country: 'India', visitors: 654 },
        { country: 'Brazil', visitors: 432 },
        { country: 'UK', visitors: 321 },
        { country: 'Australia', visitors: 187 },
      ],
      devices: [
        { type: 'Desktop', visitors: 72 },
        { type: 'Mobile', visitors: 24 },
        { type: 'Tablet', visitors: 4 },
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: 2100 },
        { source: 'Direct', visitors: 1234 },
        { source: 'Social', visitors: 789 },
        { source: 'Referral', visitors: 456 },
        { source: 'Email', visitors: 234 },
      ],
      campaigns: [
        { name: 'Beta Launch', visitors: 987, conversions: 78 },
        { name: 'Feature Announcement', visitors: 654, conversions: 34 },
      ],
      topReferrers: [
        { domain: 'producthunt.com', visitors: 1234 },
        { domain: 'hackernews.com', visitors: 567 },
        { domain: 'twitter.com', visitors: 345 },
      ],
      trafficTrendChart: generateTrendData(30),
    },
  ]

  return NextResponse.json({ websites })
}

function generateTrendData(days: number) {
  const points = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(1000 + Math.random() * 500),
    })
  }
  return points
}