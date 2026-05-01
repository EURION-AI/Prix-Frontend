import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserCount, getNewUsersCount, getUsersByPlan } from '@/lib/user-store'
import { checkDashboardAuth } from '@/lib/dashboard-auth'

export async function GET(request: Request) {
  const authError = checkDashboardAuth(request)
  if (authError) return authError;

  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24H'

  const daysMap: Record<string, number> = {
    '24H': 1,
    '7D': 7,
    '1M': 30,
    '3M': 90,
    'ALL': 365
  }
  const days = daysMap[timeRange] || 1

  try {
    const totalUsers = await getUserCount()
    const newUsers = await getNewUsersCount(days)
    const usersByPlan = await getUsersByPlan()

    const visitorsResult = await sql`
      SELECT COALESCE(SUM(total_value), 0)::int as visitors
      FROM daily_aggregates
      WHERE metric_category = 'visitors'
      AND date > NOW() - INTERVAL '${days} days'
    `

    const sessionsResult = await sql`
      SELECT COALESCE(SUM(total_value), 0)::int as sessions
      FROM daily_aggregates
      WHERE metric_category = 'sessions'
      AND date > NOW() - INTERVAL '${days} days'
    `

    const pageViewsResult = await sql`
      SELECT COALESCE(SUM(total_value), 0)::int as page_views
      FROM daily_aggregates
      WHERE metric_category = 'page_views'
      AND date > NOW() - INTERVAL '${days} days'
    `

    const revenueResult = await sql`
      SELECT COALESCE(SUM(amount), 0)::int as mrr
      FROM revenue_events
      WHERE event_type IN ('subscription', 'subscription_renewed', 'purchase')
      AND created_at > NOW() - INTERVAL '${days} days'
    `

    const affiliateResult = await sql`
      SELECT COALESCE(SUM(commission_amount), 0)::int as affiliate_revenue
      FROM affiliate_events
      WHERE event_type = 'commission_paid'
      AND created_at > NOW() - INTERVAL '${days} days'
    `

    const affiliateCountResult = await sql`
      SELECT COUNT(*)::int as count FROM affiliate_users
    `

    const visitors = visitorsResult[0]?.visitors || 0
    const sessions = sessionsResult[0]?.sessions || 0
    const pageViews = pageViewsResult[0]?.page_views || 0
    const mrr = revenueResult[0]?.mrr || 0
    const affiliateRevenue = affiliateResult[0]?.affiliate_revenue || 0
    const payingCustomers = (usersByPlan['pro'] || 0) + (usersByPlan['enterprise'] || 0)
    const activeAffiliates = affiliateCountResult[0]?.count || 0

    const trialUsers = usersByPlan['free'] || 0
    const trialToPaidRate = totalUsers > 0 ? (payingCustomers / totalUsers * 100) : 0

    return NextResponse.json({
      visitors: visitors,
      sessions: sessions,
      pageViews: pageViews,
      signups: newUsers,
      payingCustomers: payingCustomers,
      mrr: mrr,
      arr: mrr * 12,
      trialToPaidRate: trialToPaidRate,
      activeAffiliates: activeAffiliates,
      affiliateRevenue: affiliateRevenue,
      visitorsChart: await getVisitorsChartData(days),
      revenueChart: await getRevenueChartData(days),
      topWebsites: await getTopWebsites(days),
    })
  } catch (error) {
    console.error('Database error, falling back to defaults:', error)
    return NextResponse.json(getDefaultData(days))
  }
}

async function getVisitorsChartData(days: number) {
  try {
    const result = await sql`
      SELECT
        date,
        total_value::int as visitors
      FROM daily_aggregates
      WHERE metric_category = 'visitors'
      AND date > NOW() - INTERVAL '${days} days'
      ORDER BY date
    `

    if (result.length > 0) {
      return result.map(row => ({
        date: row.date.toISOString().split('T')[0],
        value: row.visitors,
      }))
    }
  } catch (e) {
    console.error('Error getting visitors chart:', e)
  }
  return generateDefaultChartData('visitors', days)
}

async function getRevenueChartData(days: number) {
  try {
    const result = await sql`
      SELECT
        DATE(created_at) as date,
        SUM(amount)::int as revenue
      FROM revenue_events
      WHERE event_type IN ('subscription', 'subscription_renewed', 'purchase')
      AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    if (result.length > 0) {
      return result.map(row => ({
        date: row.date.toISOString().split('T')[0],
        value: row.revenue / 100,
      }))
    }
  } catch (e) {
    console.error('Error getting revenue chart:', e)
  }
  return generateDefaultChartData('revenue', days)
}

async function getTopWebsites(days: number) {
  // We no longer track individual page URLs in our DB for efficiency.
  return []
}

function generateDefaultChartData(type: string, days: number) {
  return []
}

function getDefaultData(days: number) {
  return {
    visitors: 0,
    sessions: 0,
    pageViews: 0,
    signups: 0,
    payingCustomers: 0,
    mrr: 0,
    arr: 0,
    trialToPaidRate: 0,
    activeAffiliates: 0,
    affiliateRevenue: 0,
    visitorsChart: [],
    revenueChart: [],
    topWebsites: [],
  }
}