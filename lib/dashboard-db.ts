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

    await sql`
      CREATE TABLE IF NOT EXISTS user_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        user_id VARCHAR(100),
        session_id VARCHAR(100) NOT NULL,
        page_url TEXT,
        referrer TEXT,
        user_agent TEXT,
        ip_hash VARCHAR(64),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS revenue_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        customer_id VARCHAR(100),
        github_id INTEGER,
        subscription_tier VARCHAR(20),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS affiliate_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        affiliate_id VARCHAR(100) NOT NULL,
        affiliate_code VARCHAR(50),
        referrer_id VARCHAR(100),
        commission_amount DECIMAL(10, 2) DEFAULT 0,
        conversion_status VARCHAR(20) DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

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
      CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events(created_at)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_events_type_created ON user_events(event_type, created_at)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date_cat ON daily_aggregates(date, metric_category)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_revenue_events_type ON revenue_events(event_type)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_revenue_events_type_created ON revenue_events(event_type, created_at)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_affiliate_events_type_created ON affiliate_events(event_type, created_at)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_affiliate_events_affiliate ON affiliate_events(affiliate_id)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_revenue_events_github ON revenue_events(github_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_events_session ON user_events(session_id)
    `

    console.log('Dashboard database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize dashboard database:', error)
    throw error
  }
}

export async function addRevenueGithubIdColumn() {
  try {
    const result = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'revenue_events'
      AND column_name = 'github_id'
    `
    if (result.length === 0) {
      await sql`
        ALTER TABLE revenue_events ADD COLUMN github_id INTEGER
      `
      console.log('Added github_id column to revenue_events')
    }
  } catch (error) {
    console.error('Failed to add github_id column:', error)
  }
}

export async function addUserEventIndexes() {
  try {
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_events_session ON user_events(session_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id)
    `
  } catch (error) {
    console.error('Failed to add user_events indexes:', error)
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
      VALUES (${metricType}, ${metricName}, ${value}, ${JSON.stringify(metadata || {})})
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
  const deletedUserEvents = await sql`
    DELETE FROM user_events
    WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
    RETURNING id
  `
  console.log(`Archived ${deletedUserEvents.length} user_events older than ${daysToKeep} days`)

  const deletedAffiliateEvents = await sql`
    DELETE FROM affiliate_events
    WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
    AND event_type = 'click'
    RETURNING id
  `
  console.log(`Archived ${deletedAffiliateEvents.length} old click events`)

  return {
    userEventsArchived: deletedUserEvents.length,
    affiliateEventsArchived: deletedAffiliateEvents.length
  }
}

export async function backfillRevenueGithubId() {
  const result = await sql`
    UPDATE revenue_events
    SET github_id = NULLIF(SUBSTRING(customer_id FROM 5), '')::INTEGER
    WHERE customer_id LIKE 'user_%'
    AND github_id IS NULL
    RETURNING id
  `
  console.log(`Backfilled github_id for ${result.length} revenue_events`)
  return result.length
}