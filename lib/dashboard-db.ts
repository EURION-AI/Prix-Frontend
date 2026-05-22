import { sql } from './db'

export async function initializeDashboardDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_metrics (
        id SERIAL PRIMARY KEY,
        metric_type VARCHAR(50) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(15, 2) NOT NULL,
        metadata JSONB,
        recorded_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(metric_type, metric_name, recorded_at)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS daily_aggregates (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        metric_category VARCHAR(50) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        total_value DECIMAL(15, 2) NOT NULL,
        count INTEGER DEFAULT 1,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date, metric_category, metric_name)
      )
    `

    // Table revenue_events and affiliate_events are now managed in lib/db.ts

    await sql`
      CREATE INDEX IF NOT EXISTS idx_metrics_type_name ON dashboard_metrics(metric_type, metric_name)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_metrics_recorded ON dashboard_metrics(recorded_at)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date ON daily_aggregates(date)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date_cat ON daily_aggregates(date, metric_category)
    `

    console.log('Dashboard metrics tables initialized successfully')
  } catch (error) {
    console.error('Failed to initialize dashboard metrics database:', error)
    throw error
  }
}

export async function recordMetric(
  metricType: string,
  metricName: string,
  value: number,
  metadata?: Record<string, any>
) {
  try {
    await sql`
      INSERT INTO dashboard_metrics (metric_type, metric_name, metric_value, metadata)
      VALUES (${metricType}, ${metricName}, ${value}, ${sql.json(metadata || {})})
    `
  } catch (error) {
    console.error('Failed to record metric:', error)
  }
}

export async function getMetrics(
  metricType: string,
  metricName: string,
  hoursBack: number = 24
) {
  const result = await sql`
    SELECT * FROM dashboard_metrics
    WHERE metric_type = ${metricType}
    AND metric_name = ${metricName}
    AND recorded_at > NOW() - INTERVAL '${hoursBack} hours'
    ORDER BY recorded_at DESC
  `
  return result
}

export async function getDailyAggregates(
  category: string,
  metricName: string,
  daysBack: number = 30
) {
  const result = await sql`
    SELECT * FROM daily_aggregates
    WHERE metric_category = ${category}
    AND metric_name = ${metricName}
    AND date > NOW() - INTERVAL '${daysBack} days'
    ORDER BY date DESC
  `
  return result
}

export async function archiveOldEvents(daysToKeep: number = 90) {
  const deletedAffiliateEvents = await sql`
    DELETE FROM affiliate_events
    WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
    AND event_type = 'click'
    RETURNING id
  `
  console.log(`Archived ${deletedAffiliateEvents.length} old click events`)

  return {
    affiliateEventsArchived: deletedAffiliateEvents.length
  }
}

export async function backfillRevenueGithubId() {
  // Uses BIGINT now from lib/db.ts
  const result = await sql`
    UPDATE revenue_events
    SET github_id = NULLIF(SUBSTRING(customer_id FROM 5), '')::BIGINT
    WHERE customer_id LIKE 'user_%'
    AND github_id IS NULL
    RETURNING id
  `
  console.log(`Backfilled github_id for ${result.length} revenue_events`)
  return result.length
}