import { cookies } from 'next/headers'
import { sql } from './db'

export interface InstallationValidationResult {
  valid: boolean
  reason?: string
  status?: 'not_found' | 'access_revoked' | 'empty' | 'error' | 'connected'
  installationId?: number | null
}

/**
 * Validates a GitHub App installation by checking if it exists and is accessible.
 * This ensures we don't rely on stale installation IDs.
 */
export async function validateGitHubInstallation(
  installationId: number | null,
  token: string | null
): Promise<InstallationValidationResult> {
  if (!installationId) {
    return { valid: false, reason: 'No installation ID provided', status: 'error' }
  }

  if (!token) {
    return { valid: false, reason: 'No GitHub token available', status: 'error' }
  }

  try {
    const response = await fetch(
      `https://api.github.com/user/installations/${installationId}/repositories?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )

    if (response.status === 404) {
      return { 
        valid: false, 
        reason: 'Installation not found (app was uninstalled)',
        status: 'not_found'
      }
    }

    if (response.status === 403) {
      return { 
        valid: false, 
        reason: 'Installation access revoked',
        status: 'access_revoked'
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      return { 
        valid: false, 
        reason: `GitHub API error: ${response.status} - ${errorText}`,
        status: 'error'
      }
    }

    const data = await response.json()
    
    // If the installation exists but has no repositories, it's still "valid"
    // but we should flag it so the UI can prompt the user to add repositories.
    if (!data.repositories || data.repositories.length === 0) {
      return { 
        valid: true, 
        installationId,
        status: 'empty',
        reason: 'Installation exists but has no accessible repositories'
      }
    }

    return { valid: true, installationId, status: 'connected' }
  } catch (error) {
    console.error('Error validating GitHub installation:', error)
    return { valid: false, reason: 'Failed to validate installation', status: 'error' }
  }
}

/**
 * Marks a user's GitHub installation as disconnected in the database.
 * This is called when we detect an invalid installation.
 */
export async function markInstallationDisconnected(githubId: number): Promise<void> {
  try {
    await sql`
      UPDATE users
      SET installation_status = 'disconnected',
          github_installation_id = NULL,
          selected_repos = '[]'::jsonb,
          updated_at = NOW()
      WHERE github_id = ${githubId}
    `
    console.log(`[INSTALLATION] Marked installation as disconnected for github_id: ${githubId}`)
  } catch (error) {
    console.error('Failed to mark installation as disconnected:', error)
  }
}

/**
 * Updates a user's installation status to connected.
 * This is called after successful installation/mount.
 */
export async function markInstallationConnected(
  githubId: number,
  installationId: number
): Promise<void> {
  try {
    await sql`
      UPDATE users
      SET installation_status = 'connected',
          github_installation_id = ${installationId},
          updated_at = NOW()
      WHERE github_id = ${githubId}
    `
    console.log(`[INSTALLATION] Marked installation as connected for github_id: ${githubId}, installation_id: ${installationId}`)
  } catch (error) {
    console.error('Failed to mark installation as connected:', error)
  }
}

/**
 * Gets the current installation status for a user.
 */
export async function getInstallationStatus(githubId: number): Promise<{
  status: string
  installationId: number | null
}> {
  try {
    const result = await sql`
      SELECT installation_status, github_installation_id
      FROM users
      WHERE github_id = ${githubId}
    `
    
    if (result.length === 0) {
      return { status: 'disconnected', installationId: null }
    }

    return {
      status: result[0].installation_status || 'disconnected',
      installationId: result[0].github_installation_id
    }
  } catch (error) {
    console.error('Failed to get installation status:', error)
    return { status: 'disconnected', installationId: null }
  }
}

/**
 * Validates and cleans up invalid mounted repositories.
 * Removes repos that are no longer accessible through the installation.
 */
export async function cleanupInvalidRepos(
  githubId: number,
  installationId: number | null,
  token: string | null
): Promise<void> {
  if (!installationId || !token) {
    // If no installation, clear all repos
    await sql`
      UPDATE users
      SET selected_repos = '[]'::jsonb,
          updated_at = NOW()
      WHERE github_id = ${githubId}
    `
    return
  }

  try {
    // Get accessible repos from GitHub
    const response = await fetch(
      `https://api.github.com/user/installations/${installationId}/repositories?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      // If we can't fetch repos, clear selection
      await sql`
        UPDATE users
        SET selected_repos = '[]'::jsonb,
            updated_at = NOW()
        WHERE github_id = ${githubId}
      `
      return
    }

    const data = await response.json()
    const accessibleRepoNames = new Set(
      data.repositories.map((repo: any) => repo.full_name)
    )

    // Get current selected repos from database
    const userResult = await sql`
      SELECT selected_repos
      FROM users
      WHERE github_id = ${githubId}
    `

    if (userResult.length === 0) return

    const currentRepos = userResult[0].selected_repos || []
    const validRepos = currentRepos.filter((repo: string) =>
      accessibleRepoNames.has(repo)
    )

    // Update with only valid repos
    if (validRepos.length !== currentRepos.length) {
      await sql`
        UPDATE users
        SET selected_repos = ${sql.json(validRepos)},
            updated_at = NOW()
        WHERE github_id = ${githubId}
      `
      console.log(
        `[INSTALLATION] Cleaned up ${currentRepos.length - validRepos.length} invalid repos for github_id: ${githubId}`
      )
    }
  } catch (error) {
    console.error('Error cleaning up invalid repos:', error)
  }
}
