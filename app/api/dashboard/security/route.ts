import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const multiplier = timeRange === '24H' ? 1 : timeRange === '7D' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365

  return NextResponse.json({
    failedLogins: 34 * multiplier,
    suspiciousSignups: 12 * multiplier,
    multipleAccountsPerIp: 8 * multiplier,
    affiliateClickSpikes: 5 * multiplier,
    riskScores: [
      { type: 'Payment Fraud', score: 3.2 },
      { type: 'Account Sharing', score: 5.1 },
      { type: 'Fake Signups', score: 2.8 },
      { type: 'Click Fraud', score: 4.5 },
    ],
    suspiciousActivityChart: generateChartData(15, 10, 30),
    fraudHeatmap: generateFraudHeatmap(),
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
      value: Math.floor(baseValue + Math.random() * variance),
    })
  }
  return points
}

function generateFraudHeatmap() {
  const heatmap = []
  const now = new Date()
  for (let h = 0; h < 24; h++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(now)
      date.setDate(date.getDate() - d)
      heatmap.push({
        time: `${date.toISOString().split('T')[0]} ${h.toString().padStart(2, '0')}:00`,
        affiliateId: `aff_${Math.floor(Math.random() * 100)}`,
        risk: Math.random() * 10,
      })
    }
  }
  return heatmap
}