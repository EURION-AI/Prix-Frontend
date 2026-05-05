import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { rateLimiters } from '@/lib/enhanced-rate-limit'

export async function GET(request: Request) {
  // Apply rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const rateLimitResult = rateLimiters.standard(`${ip}:GET`)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('github_user')?.value
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse and validate user data
    let userData
    try {
      userData = JSON.parse(userCookie)
    } catch (parseError) {
      console.error('[AUTH] Failed to parse user cookie:', parseError)
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Validate required fields
    if (!userData.id || !userData.username) {
      console.error('[AUTH] Invalid user data structure:', { id: userData.id, username: userData.username })
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 })
    }

    // Return only safe user data (exclude sensitive info if any)
    const safeUserData = {
      id: userData.id,
      username: userData.username,
      name: userData.name || null,
      email: userData.email || null,
      avatarUrl: userData.avatarUrl || null,
      selectedRepos: userData.selectedRepos || [],
      prsReviewed: userData.prsReviewed || 0,
      plan: userData.plan || 'free',
      githubInstallationId: userData.githubInstallationId || null
    }

    return NextResponse.json({ user: safeUserData })
  } catch (error) {
    console.error('[AUTH] Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
