import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventType, userId, sessionId, pageUrl, referrer, userAgent, ipHash, metadata } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'Missing required field: eventType' },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO user_events (event_type, user_id, session_id, page_url, referrer, user_agent, ip_hash, metadata)
      VALUES (
        ${eventType},
        ${userId || null},
        ${sessionId || null},
        ${pageUrl || null},
        ${referrer || null},
        ${userAgent || null},
        ${ipHash || null},
        ${JSON.stringify(metadata || {})}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record event:', error)
    return NextResponse.json(
      { error: 'Failed to record event' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('eventType')
  const hours = parseInt(searchParams.get('hours') || '24')

  try {
    let query = sql`
      SELECT * FROM user_events
      WHERE created_at > NOW() - INTERVAL '${hours} hours'
    `

    if (eventType) {
      query = sql`
        SELECT * FROM user_events
        WHERE event_type = ${eventType}
        AND created_at > NOW() - INTERVAL '${hours} hours'
        ORDER BY created_at DESC
        LIMIT 1000
      `
    }

    const result = await query
    return NextResponse.json({ events: result })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}