import { NextResponse, NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { checkDashboardAuth } from '@/lib/dashboard-auth'
import { rateLimiters } from '@/lib/enhanced-rate-limit'
import { logAdmin } from '@/lib/security-logging'

export async function GET(request: NextRequest) {
  // Add authentication check
  const authError = checkDashboardAuth(request)
  if (authError) return authError

  // Add rate limiting for admin operations
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const rateLimitResult = rateLimiters.admin(`${ip}:admin`)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    // Log the admin operation
    logAdmin('Database cleanup initiated', { 
      operation: 'DROP_COLUMN', 
      table: 'users', 
      column: 'selected_repo' 
    }, request)
    
    await sql`ALTER TABLE users DROP COLUMN IF EXISTS selected_repo`
    
    logAdmin('Database cleanup completed successfully', { 
      operation: 'DROP_COLUMN_SUCCESS',
      table: 'users',
      column: 'selected_repo'
    }, request)
    return NextResponse.json({ success: true, message: 'Legacy column dropped successfully' })
  } catch (error: any) {
    console.error('[ADMIN] Cleanup failed:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
