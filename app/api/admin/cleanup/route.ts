import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
  try {
    await sql`ALTER TABLE users DROP COLUMN IF EXISTS selected_repo`
    return NextResponse.json({ success: true, message: 'Legacy column dropped successfully' })
  } catch (error: any) {
    console.error('Cleanup failed:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
