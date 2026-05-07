import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import crypto from 'crypto'
import {
  markInstallationDisconnected,
  markInstallationConnected,
} from '@/lib/github-installation'

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

/**
 * Verify GitHub webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!GITHUB_WEBHOOK_SECRET) {
    console.error('GITHUB_WEBHOOK_SECRET not configured')
    return false
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET)
  const digest = `sha256=${hmac.update(payload).digest('hex')}`
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

/**
 * Handle installation deleted event
 * When user uninstalls the GitHub App, mark their installation as disconnected
 */
async function handleInstallationDeleted(payload: any) {
  const installationId = payload.installation?.id
  const sender = payload.sender
  const repositories = payload.repositories || []

  if (!installationId || !sender) {
    console.error('[WEBHOOK] Invalid installation.deleted payload')
    return
  }

  console.log('[INSTALLATION REMOVED]', {
    user: sender.login,
    githubId: sender.id,
    installationId,
    repoCount: repositories.length,
  })

  try {
    // Mark all users with this installation as disconnected
    const result = await sql`
      UPDATE users
      SET installation_status = 'disconnected',
          github_installation_id = NULL,
          selected_repos = '[]'::jsonb,
          updated_at = NOW()
      WHERE github_installation_id = ${installationId}
      RETURNING github_id, username
    `

    console.log(
      `[WEBHOOK] Marked ${result.length} users as disconnected for installation ${installationId}`
    )

    for (const user of result) {
      console.log(
        `[WEBHOOK] User ${user.username} (github_id: ${user.github_id}) marked as disconnected`
      )
    }
  } catch (error) {
    console.error('[WEBHOOK] Failed to handle installation.deleted:', error)
  }
}

/**
 * Handle installation created event
 * When user installs the GitHub App, mark their installation as connected
 */
async function handleInstallationCreated(payload: any) {
  const installationId = payload.installation?.id
  const sender = payload.sender

  if (!installationId || !sender) {
    console.error('[WEBHOOK] Invalid installation.created payload')
    return
  }

  console.log('[INSTALLATION CREATED]', {
    user: sender.login,
    githubId: sender.id,
    installationId,
  })

  try {
    // Update user with new installation ID
    const result = await sql`
      UPDATE users
      SET installation_status = 'connected',
          github_installation_id = ${installationId},
          updated_at = NOW()
      WHERE github_id = ${sender.id}
      RETURNING github_id, username
    `

    if (result.length > 0) {
      console.log(
        `[WEBHOOK] User ${result[0].username} (github_id: ${result[0].github_id}) marked as connected with installation ${installationId}`
      )
    }
  } catch (error) {
    console.error('[WEBHOOK] Failed to handle installation.created:', error)
  }
}

/**
 * Handle installation_repositories added/removed events
 * When user adds/removes repo access, clean up invalid selections
 */
async function handleInstallationRepositoriesChanged(payload: any) {
  const installationId = payload.installation?.id
  const action = payload.action // 'added' or 'removed'
  const sender = payload.sender

  if (!installationId || !sender) {
    console.error('[WEBHOOK] Invalid installation_repositories payload')
    return
  }

  console.log('[REPOSITORIES CHANGED]', {
    user: sender.login,
    githubId: sender.id,
    installationId,
    action,
  })

  // Note: We don't automatically clean up repos here since we validate on dashboard load
  // This event is logged for monitoring purposes
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256')
    const payload = await request.text()

    if (!signature) {
      console.error('[WEBHOOK] Missing signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    if (!verifySignature(payload, signature)) {
      console.error('[WEBHOOK] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(payload)
    const eventType = request.headers.get('x-github-event')

    console.log(`[WEBHOOK] Received event: ${eventType}`)

    switch (eventType) {
      case 'installation':
        if (data.action === 'deleted') {
          await handleInstallationDeleted(data)
        } else if (data.action === 'created') {
          await handleInstallationCreated(data)
        }
        break

      case 'installation_repositories':
        await handleInstallationRepositoriesChanged(data)
        break

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
