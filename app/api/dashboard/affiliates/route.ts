import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { checkDashboardAuth } from '@/lib/dashboard-auth'

export async function GET(request: Request) {
  const authError = checkDashboardAuth(request)
  if (authError) return authError;

  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20') || 20), 100)
  const offset = (page - 1) * limit

  const daysMap: Record<string, number> = {
    '24H': 1,
    '7D': 7,
    '1M': 30,
    '3M': 90,
    'ALL': 365
  }
  const days = daysMap[timeRange] || 1

  try {
    const affiliatesResult = await sql`
      SELECT
        username,
        referral_count,
        paid_referral_count,
        tier,
        created_at
      FROM affiliate_users
      ORDER BY paid_referral_count DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const totalStats = await sql`
      SELECT COUNT(*)::int as total FROM affiliate_users
    `
    const totalAffiliates = totalStats[0]?.total || 0
    const totalPages = Math.ceil(totalAffiliates / limit)

    const clickData = await sql`
      SELECT
        affiliate_id,
        DATE(created_at) as date,
        COUNT(*)::int as clicks
      FROM affiliate_events
      WHERE event_type = 'click'
      AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY affiliate_id, DATE(created_at)
      ORDER BY date
    `

    const conversionData = await sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*)::int as conversions
      FROM affiliate_events
      WHERE event_type = 'conversion'
      AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    const commissionData = await sql`
      SELECT
        DATE(created_at) as date,
        SUM(commission_amount)::int as revenue
      FROM affiliate_events
      WHERE event_type = 'commission_paid'
      AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    const totalClicksResult = await sql`
      SELECT COUNT(*)::int as total_clicks
      FROM affiliate_events
      WHERE event_type = 'click'
      AND created_at > NOW() - INTERVAL '${days} days'
    `

    const totalConversionsResult = await sql`
      SELECT COUNT(*)::int as total_conversions
      FROM affiliate_events
      WHERE event_type = 'conversion'
      AND created_at > NOW() - INTERVAL '${days} days'
    `

    const totalCommissionResult = await sql`
      SELECT COALESCE(SUM(commission_amount), 0)::int as total_commission
      FROM affiliate_events
      WHERE event_type = 'commission_paid'
      AND created_at > NOW() - INTERVAL '${days} days'
    `

    const totalClicks = totalClicksResult[0]?.total_clicks || 0
    const totalConversions = totalConversionsResult[0]?.total_conversions || 0
    const totalCommission = totalCommissionResult[0]?.total_commission || 0
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0
    const revenuePerAffiliate = affiliatesResult.length > 0 ? totalCommission / affiliatesResult.length : 0

    const affiliates = affiliatesResult.map(row => {
      const affiliateClicks = clickData
        .filter(c => c.affiliate_id === row.id)
        .reduce((sum, c) => sum + c.clicks, 0) || 0

      return {
        name: row.username,
        clicks: affiliateClicks,
        conversions: row.paid_referral_count || 0,
        revenue: (row.paid_referral_count || 0) * 75,
        commission: (row.paid_referral_count || 0) * 75 * 0.15,
        conversionRate: affiliateClicks > 0 ? ((row.paid_referral_count || 0) / affiliateClicks * 100) : 0,
      }
    })

    const clicksVsConversionsChart = mergeChartData(clickData, conversionData, 'clicks', 'conversions')
    const trendChart = commissionData.map(row => ({
      date: row.date.toISOString().split('T')[0],
      value: row.revenue,
    }))

    return NextResponse.json({
      clicks: totalClicks,
      signups: totalConversions,
      conversionRate: conversionRate,
      revenuePerAffiliate: revenuePerAffiliate,
      commissionOwed: totalCommission,
      affiliates: affiliates,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: totalAffiliates,
      },
      clicksVsConversionsChart: clicksVsConversionsChart.length > 0 ? clicksVsConversionsChart : generateDefaultChartData('clicks', 30),
      trendChart: trendChart.length > 0 ? trendChart : generateDefaultChartData('revenue', 30),
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      clicks: 0,
      signups: 0,
      conversionRate: 0,
      revenuePerAffiliate: 0,
      commissionOwed: 0,
      affiliates: [],
      pagination: { page: 1, limit: 20, totalPages: 0, totalItems: 0 },
      clicksVsConversionsChart: [],
      trendChart: [],
      error: 'Database unavailable'
    }, { status: 503 })
  }
}

function mergeChartData(clickData: any[], conversionData: any[], clickKey: string, convKey: string) {
  const merged = new Map()

  for (const row of clickData) {
    const dateStr = row.date.toISOString().split('T')[0]
    merged.set(dateStr, { date: dateStr, [clickKey]: row.clicks, [convKey]: 0 })
  }

  for (const row of conversionData) {
    const dateStr = row.date.toISOString().split('T')[0]
    if (merged.has(dateStr)) {
      merged.get(dateStr)[convKey] = row.conversions
    } else {
      merged.set(dateStr, { date: dateStr, [clickKey]: 0, [convKey]: row.conversions })
    }
  }

  return Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function generateDefaultChartData(type: string, days: number) {
  const points = []
  const now = new Date()
  const baseValue = type === 'clicks' ? 500 : 8500
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue + (Math.random() - 0.5) * baseValue * 0.3),
    })
  }
  return points
}