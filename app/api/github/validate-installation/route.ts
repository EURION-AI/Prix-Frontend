import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByGithubId } from '@/lib/user-store'
import { 
  validateGitHubInstallation, 
  markInstallationDisconnected,
  cleanupInvalidRepos 
} from '@/lib/github-installation'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value
    const userCookie = cookieStore.get('github_user')?.value

    if (!userCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userData = JSON.parse(userCookie)
    const githubId = userData.githubId || userData.id

    if (!githubId) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
    }

    // Get fresh user data from database
    const user = await getUserByGithubId(githubId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If no installation ID, return disconnected
    if (!user.githubInstallationId) {
      return NextResponse.json({
        valid: false,
        reason: 'No installation found',
        installationStatus: 'disconnected'
      })
    }

    // Validate the installation
    const validation = await validateGitHubInstallation(
      user.githubInstallationId,
      token || null
    )

    if (!validation.valid) {
      // Mark as disconnected if validation fails
      await markInstallationDisconnected(githubId)
      
      return NextResponse.json({
        valid: false,
        reason: validation.reason,
        installationStatus: 'disconnected'
      })
    }

    // Clean up invalid repos
    await cleanupInvalidRepos(githubId, user.githubInstallationId, token || null)

    return NextResponse.json({
      valid: true,
      installationId: user.githubInstallationId,
      installationStatus: 'connected'
    })
  } catch (error) {
    console.error('Error validating installation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
