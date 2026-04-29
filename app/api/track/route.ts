import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { rateLimit } from '@/lib/security'
import { hashIP } from '@/lib/affiliate'

export async function POST(request: Request) {
  const rateLimitResult = rateLimit(request, 60)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const body = await request.json()
    const { eventType, pageUrl, referrer, metadata } = body

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
    }

    const validEventTypes = ['page_view', 'click', 'conversion', 'signup', 'purchase']
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    const userCookie = request.cookies.get('github_user')?.value
    let userId: string | null = null

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie)
        userId = user.id
      } catch (e) {
      }
    }

    const sessionId = request.cookies.get('session_id')?.value || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const ipHash = await hashIP(ip)

    try {
      await sql`
        INSERT INTO user_events (event_type, user_id, session_id, page_url, referrer, user_agent, ip_hash, metadata, created_at)
        VALUES (
          ${eventType},
          ${userId},
          ${sessionId},
          ${pageUrl || null},
          ${referrer || null},
          ${userAgent},
          ${ipHash},
          ${JSON.stringify(metadata || {})},
          NOW()
        )
      `
    } catch (dbError) {
      console.warn('Database tracking error (skipping):', dbError instanceof Error ? dbError.message : 'Unknown error')
      // Continue even if database is down for tracking
    }

    const response = NextResponse.json({ success: true, sessionId })
    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2,
        path: '/',
      })
    }
    return response
  } catch (error) {
    console.error('Event tracking error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}