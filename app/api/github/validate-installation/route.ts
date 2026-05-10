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

    // If no installation ID, check if user previously had one (disconnected) or never had one (oauth-only)
    if (!user.githubInstallationId) {
      // Only show disconnected warning if user previously had an installation
      // OAuth-only users without App installation are not "disconnected" - they're using OAuth
      if (user.installationStatus === 'connected') {
        // This is a recovery case - installation was somehow cleared but status says connected
        return NextResponse.json({
          valid: false,
          reason: 'Installation not found (may have been uninstalled)',
          installationStatus: 'disconnected'
        })
      }
      // User never had an App installation - this is fine for OAuth users
      // Don't show the "disconnected" warning, just return valid: true with no installationId
      return NextResponse.json({
        valid: true,
        reason: 'OAuth login only - GitHub App not installed',
        installationStatus: 'oauth_only',
        installationId: null
      })
    }

    // Validate the installation
    const validation = await validateGitHubInstallation(
      user.githubInstallationId,
      token || null
    )

    if (!validation.valid) {
      // ONLY mark as disconnected if we are sure the installation is gone or revoked
      // Don't disconnect on transient errors or API failures
      if (validation.status === 'not_found' || validation.status === 'access_revoked') {
        await markInstallationDisconnected(githubId)
      }
      
      const isDisconnected = validation.status === 'not_found' || validation.status === 'access_revoked'
      
      return NextResponse.json({
        valid: false,
        reason: validation.reason,
        installationStatus: isDisconnected ? 'disconnected' : 'error'
      })
    }

    // Clean up invalid repos only if we are fully connected
    if (validation.status === 'connected') {
      await cleanupInvalidRepos(githubId, user.githubInstallationId, token || null)
    }

    return NextResponse.json({
      valid: true,
      installationId: user.githubInstallationId,
      installationStatus: validation.status || 'connected',
      reason: validation.reason
    })
  } catch (error) {
    console.error('Error validating installation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
