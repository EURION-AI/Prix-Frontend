import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  return NextResponse.json({
    dau: 2847 * multiplier,
    wau: 12450 * multiplier,
    mau: 45230 * multiplier,
    features: [
      { name: 'PR Review', users: 12456, timeSpent: 485 },
      { name: 'Code Analysis', users: 9823, timeSpent: 312 },
      { name: 'Security Scan', users: 7654, timeSpent: 198 },
      { name: 'Auto Fix', users: 5432, timeSpent: 156 },
      { name: 'Analytics Dashboard', users: 4321, timeSpent: 89 },
    ],
    cohortRetention: [
      { cohort: 'Week 0', week0: 100, week1: 72, week2: 58, week3: 45, week4: 38 },
      { cohort: 'Week 1', week0: 100, week1: 68, week2: 52, week3: 41, week4: 35 },
      { cohort: 'Week 2', week0: 100, week1: 75, week2: 61, week3: 48, week4: 0 },
      { cohort: 'Week 3', week0: 100, week1: 70, week2: 55, week3: 0, week4: 0 },
      { cohort: 'Week 4', week0: 100, week1: 73, week2: 0, week3: 0, week4: 0 },
    ],
    dauWauMauChart: generateTrendData(30),
    featureUsageChart: generateFeatureUsageData(),
  })
}

function generateTrendData(days: number) {
  const points = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      dau: Math.floor(2500 + Math.random() * 500),
      wau: Math.floor(11000 + Math.random() * 2000),
      mau: Math.floor(42000 + Math.random() * 5000),
    })
  }
  return points
}

function generateFeatureUsageData() {
  const features = ['PR Review', 'Code Analysis', 'Security Scan', 'Auto Fix', 'Analytics']
  const points = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dataPoint: Record<string, string | number> = { date: date.toISOString().split('T')[0] }
    features.forEach(f => {
      dataPoint[f] = Math.floor(3000 + Math.random() * 2000)
    })
    points.push(dataPoint)
  }
  return points
}