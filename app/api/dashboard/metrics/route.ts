import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { recordMetric } from '@/lib/dashboard-db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { metricType, metricName, value, metadata } = body

    if (!metricType || !metricName || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: metricType, metricName, value' },
        { status: 400 }
      )
    }

    await recordMetric(metricType, metricName, value, metadata)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record metric:', error)
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const metricType = searchParams.get('metricType')
  const metricName = searchParams.get('metricName')
  const hours = parseInt(searchParams.get('hours') || '24')

  if (!metricType || !metricName) {
    return NextResponse.json(
      { error: 'Missing required query params: metricType, metricName' },
      { status: 400 }
    )
  }

  try {
    const result = await sql`
      SELECT * FROM dashboard_metrics
      WHERE metric_type = ${metricType}
      AND metric_name = ${metricName}
      AND recorded_at > NOW() - INTERVAL '${hours} hours'
      ORDER BY recorded_at DESC
      LIMIT 1000
    `

    return NextResponse.json({ metrics: result })
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}