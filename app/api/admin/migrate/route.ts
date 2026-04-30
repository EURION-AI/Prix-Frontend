import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db'

export async function GET(request: Request) {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: 'Database migrated successfully' })
  } catch (error: any) {
    console.error('Migration failed:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
