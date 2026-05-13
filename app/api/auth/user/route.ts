import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { rateLimiters } from '@/lib/enhanced-rate-limit'
import { getUserByGithubId } from '@/lib/user-store'

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
    let cookieData
    try {
      const decodedCookie = userCookie.includes('%') ? decodeURIComponent(userCookie) : userCookie
      cookieData = JSON.parse(decodedCookie)
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const githubId = cookieData.id || cookieData.githubId
    if (!githubId) {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 })
    }

    // Fetch FRESH data from database
    const dbUser = await getUserByGithubId(githubId)
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return only safe user data
    const safeUserData = {
      id: dbUser.githubId,
      username: dbUser.username,
      name: dbUser.username, // Fallback if name is missing in store
      email: dbUser.email,
      avatarUrl: dbUser.avatarUrl,
      selectedRepos: dbUser.selectedRepos || [],
      prsReviewed: dbUser.prsReviewed || 0,
      plan: dbUser.plan || 'free',
      githubInstallationId: dbUser.githubInstallationId || null,
      installationStatus: dbUser.installationStatus || 'disconnected',
      planExpiresAt: dbUser.planExpiresAt || null,
      planStartedAt: dbUser.planStartedAt || null,
      hasActiveSubscription: !!dbUser.subscriptionId,
    }

    return NextResponse.json({ user: safeUserData })
  } catch (error) {
    console.error('[AUTH] Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
