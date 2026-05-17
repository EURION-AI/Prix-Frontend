import * as dotenv from 'dotenv'
dotenv.config()
// Import db after dotenv config to ensure env vars are loaded
const { sql } = require('../lib/db.ts')

interface TableRow {
  table_name: string
}

async function verifyDB() {
  console.log('--- Database Verification ---')
  try {
    // Check connection
    const result = await sql`SELECT 1 as connected`
    console.log('Connection Status: SUCCESS')
    
    // List tables
    const tables: TableRow[] = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('\nExisting Tables:')
    tables.forEach(t => console.log(`- ${t.table_name}`))
    
    // Check for user_events specifically (should be gone or I should drop it)
    const hasUserEvents = tables.some(t => t.table_name === 'user_events')
    if (hasUserEvents) {
      console.log('\nWarning: user_events table still exists in DB. Dropping it now...')
      await sql`DROP TABLE user_events CASCADE`
      console.log('user_events table dropped.')
    } else {
      console.log('\nuser_events table not found (Correct).')
    }

    // Report Table Details
    console.log('\n--- Table Details ---')
    for (const table of tables.filter(t => t.table_name !== 'user_events')) {
      const count = await sql`SELECT COUNT(*) FROM ${sql(table.table_name)}`
      console.log(`${table.table_name}: ${count[0].count} rows`)
    }

  } catch (error) {
    console.error('Connection Status: FAILED')
    console.error('Error Details:', error)
  } finally {
    process.exit(0)
  }
}

verifyDB()
