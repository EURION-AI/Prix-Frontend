import { NextResponse } from 'next/server'

export function checkDashboardAuth(request: Request): NextResponse | null {
  const dashboardSecret = request.cookies.get('dashboard_session')?.value

  if (!dashboardSecret) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const expectedSecret = process.env.DASHBOARD_SECRET || process.env.ADMIN_SECRET

  if (!expectedSecret || dashboardSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }

  return null
}

export function setDashboardCookie(response: NextResponse, secret: string): void {
  response.cookies.set('dashboard_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
}