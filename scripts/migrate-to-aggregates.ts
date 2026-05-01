import * as dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import { sql } from '../lib/db'

async function migrate() {
  console.log('Starting migration to daily aggregates...')

  try {
    // 1. Ensure daily_aggregates table exists (it should after lib/db update)
    // 2. Backfill visitors from user_events
    console.log('Backfilling visitors from user_events...')
    
    // Check if user_events table exists first
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_events'
      )
    `
    
    if (tableCheck[0].exists) {
      const historicalStats = await sql`
        SELECT 
          DATE(created_at) as event_date,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          COUNT(*) as total_hits
        FROM user_events
        WHERE event_type = 'page_view'
        GROUP BY DATE(created_at)
      `

      for (const row of historicalStats) {
        await sql`
          INSERT INTO daily_aggregates (date, metric_category, metric_name, total_value, count)
          VALUES (${row.event_date}, 'visitors', 'unique_visitors', ${row.unique_visitors}, ${row.total_hits})
          ON CONFLICT (date, metric_category, metric_name) DO NOTHING
        `
      }
      console.log(`Migrated stats for ${historicalStats.length} days.`)
    } else {
      console.log('user_events table not found, skipping backfill.')
    }

    console.log('Migration successfully completed.')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
