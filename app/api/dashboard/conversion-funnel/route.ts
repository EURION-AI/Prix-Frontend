import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  const stages = [
    { name: 'Visitors', count: Math.floor(12847 * multiplier), conversionRate: 100 },
    { name: 'Sign-ups', count: Math.floor(1247 * multiplier), conversionRate: 9.71 },
    { name: 'Trial Started', count: Math.floor(892 * multiplier), conversionRate: 71.53 },
    { name: 'Trial to Paid', count: Math.floor(234 * multiplier), conversionRate: 26.24 },
    { name: 'Active Subscribers', count: Math.floor(847 * multiplier), conversionRate: 6.59 },
  ]

  for (let i = 1; i < stages.length; i++) {
    stages[i].conversionRate = parseFloat(((stages[i].count / stages[i - 1].count) * 100).toFixed(2))
  }

  return NextResponse.json({
    stages,
    overallConversionRate: 6.59,
    dropoffChart: generateDropoffData(),
  })
}

function generateDropoffData() {
  const points = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      value: 5.5 + Math.random() * 2,
    })
  }
  return points
}