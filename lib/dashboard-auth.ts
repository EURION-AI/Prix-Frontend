import { NextResponse } from 'next/server'
import crypto from 'crypto'

const sessions = new Map<string, { createdAt: number }>()

export function checkDashboardAuth(request: Request): NextResponse | null {
  const sessionToken = request.cookies.get('dashboard_session')?.value

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const session = sessions.get(sessionToken)
  if (!session) {
    return NextResponse.json(
      { error: 'Invalid or expired session' },
      { status: 401 }
    )
  }

  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(sessionToken)
    return NextResponse.json(
      { error: 'Session expired' },
      { status: 401 }
    )
  }

  return null
}

export function setDashboardCookie(response: NextResponse, _secret: string): void {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { createdAt: Date.now() })
  response.cookies.set('dashboard_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
}
