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
    let userCookie = cookieStore.get('github_user')?.value
    
    if (!userCookie) {
      console.error('[AUTH] No github_user cookie found')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse and validate user data
    let userData
    try {
      // Handle potential URI encoding from legacy client-side cookie setting
      const decodedCookie = userCookie.includes('%') ? decodeURIComponent(userCookie) : userCookie
      userData = JSON.parse(decodedCookie)
    } catch (parseError) {
      console.error('[AUTH] Failed to parse user cookie:', parseError, { 
        cookieLength: userCookie?.length,
        isEncoded: userCookie?.includes('%')
      })
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
      githubInstallationId: userData.githubInstallationId || null,
      installationStatus: userData.installationStatus || 'disconnected'
    }

    return NextResponse.json({ user: safeUserData })
  } catch (error) {
    console.error('[AUTH] Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
