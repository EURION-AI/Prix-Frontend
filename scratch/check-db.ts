import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const sql = postgres(process.env.DATABASE_URL!)

async function check() {
  try {
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'subscription_id'
    `
    console.log('subscription_id check:', result.length > 0 ? 'EXISTS' : 'MISSING')

    const result2 = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'razorpay_subscription_id'
    `
    console.log('razorpay_subscription_id check:', result2.length > 0 ? 'EXISTS' : 'MISSING')
    
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

check()
