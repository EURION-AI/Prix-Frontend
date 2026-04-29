import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  return NextResponse.json({
    mrr: 42500,
    arr: 510000,
    arpa: 49.99,
    expansionRevenue: 4200 * multiplier,
    contractionRevenue: 890 * multiplier,
    activeSubs: 847,
    trialUsers: 234,
    freeUsers: 4521,
    churnRate: 2.3,
    revenueChurn: 1.8,
    nrr: 118,
    grr: 96,
    mrrChart: generateChartData(42500, 3000, 30),
    churnNewChart: generateChartData(25, 10, 30),
    customerSegments: [
      { name: 'Enterprise', value: 145 },
      { name: 'Professional', value: 389 },
      { name: 'Starter', value: 313 },
    ],
  })
}

function generateChartData(baseValue: number, variance: number, days: number) {
  const points = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
    })
  }
  return points
}