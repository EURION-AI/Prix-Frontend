import * as dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import { initializeDatabase } from '../lib/db'

async function run() {
  console.log('Running database migrations...')
  try {
    await initializeDatabase()
    console.log('Migrations complete.')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

run()
