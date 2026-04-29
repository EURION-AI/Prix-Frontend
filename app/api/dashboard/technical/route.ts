import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  return NextResponse.json({
    pageLoadTime: 1245,
    ttfb: 234,
    apiResponseTime: 156,
    errorRate: 0.12,
    uptime: 99.97,
    coreWebVitals: {
      lcp: 2100,
      fid: 45,
      cls: 0.08,
    },
    pageLoadChart: generateChartData(1200, 300, 30),
    errorRateChart: generateChartData(0.12, 0.05, 30),
    uptimeHistory: generateUptimeData(30),
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
      value: parseFloat((baseValue + (Math.random() - 0.5) * variance).toFixed(2)),
    })
  }
  return points
}

function generateUptimeData(days: number) {
  const points = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      value: 99.5 + Math.random() * 0.5,
    })
  }
  return points
}