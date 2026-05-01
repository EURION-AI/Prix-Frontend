import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { rateLimit } from '@/lib/security'

export async function POST(request: Request) {
  // Very strict rate limit for visits (1 per minute per IP)
  const rateLimitResult = rateLimit(request, 1)
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ success: false, message: 'Rate limited' }, { status: 429 })
  }

  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Upsert into daily_aggregates for 'visitors' category
    await sql`
      INSERT INTO daily_aggregates (date, metric_category, metric_name, total_value, count)
      VALUES (${today}, 'visitors', 'unique_visitors', 1, 1)
      ON CONFLICT (date, metric_category, metric_name)
      DO UPDATE SET total_value = daily_aggregates.total_value + 1, count = daily_aggregates.count + 1
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track visit:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
