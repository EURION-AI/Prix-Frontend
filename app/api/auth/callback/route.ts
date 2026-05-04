import { NextRequest, NextResponse } from 'next/server'
import { addReferral, getAffiliateUserByCode } from '@/lib/affiliate-store-db'
import { sql } from '@/lib/db'
import { hashIP, generateAffiliateCode } from '@/lib/affiliate'
import { getEnhancedClientIP, rateLimiters } from '@/lib/enhanced-rate-limit'
import { validateAffiliateCode } from '@/lib/validation'

function validateState(state: string): boolean {
  // Validate state format: timestamp_nonce_randomhex
  const stateRegex = /^[a-z0-9]+_[a-f0-9]{32}_[a-f0-9]+$/
  if (!stateRegex.test(state)) {
    return false
  }
  
  const parts = state.split('_')
  if (parts.length !== 3) {
    return false
  }
  
  // Validate timestamp (should be recent, within 10 minutes)
  const timestamp = parseInt(parts[0], 36)
  const now = Date.now()
  const maxAge = 10 * 60 * 1000 // 10 minutes
  
  if (now - timestamp > maxAge) {
    return false
  }
  
  return true
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`

interface GitHubTokenResponse {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
}

interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
  avatar_url: string
  bio: string | null
}

export async function GET(request: NextRequest) {
  const ip = getEnhancedClientIP(request)
  const rateLimitResult = rateLimiters.auth(`${ip}:GET`)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url))
  }

  if (!code || !returnedState) {
    return NextResponse.redirect(new URL('/login?error=missing_params', request.url))
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url))
  }

  const storedState = request.cookies.get('oauth_state')?.value
  if (!storedState || storedState !== returnedState) {
    console.error('[AUTH] OAuth state mismatch', { stored: storedState?.substring(0, 20) + '...', returned: returnedState?.substring(0, 20) + '...' })
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url))
  }

  // Additional state validation
  if (!validateState(returnedState)) {
    console.error('[AUTH] OAuth state validation failed', { state: returnedState?.substring(0, 20) + '...' })
    return NextResponse.redirect(new URL('/login?error=invalid_state_format', request.url))
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    })

    const tokenData: GitHubTokenResponse = await tokenResponse.json()

    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const accessToken = tokenData.access_token

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=user_fetch_failed', request.url))
    }

    const userData: GitHubUser = await userResponse.json()

    if (!userData.id || !userData.login || typeof userData.login !== 'string' || userData.login.length < 1) {
      return NextResponse.redirect(new URL('/login?error=invalid_user', request.url))
    }

    let isNewUser = false
    // Check if user exists and create/update records
    const existingUser = await sql`SELECT id FROM users WHERE github_id = ${userData.id}`
    if (existingUser.length === 0) {
      isNewUser = true
    }

    // Create or update main user record
    const userId = `user_${Date.now()}_${userData.id}_${crypto.randomUUID().split('-')[0]}`
    await sql`INSERT INTO users (id, github_id, username, email, avatar_url)
      VALUES (${userId}, ${userData.id}, ${userData.login.substring(0, 100)}, ${userData.email || null}, ${userData.avatar_url || null})
      ON CONFLICT (github_id) DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
    `

    // Create or update affiliate record
    const affId = `aff_${Date.now()}_${userData.id}_${crypto.randomUUID().split('-')[0]}`
    const affCode = generateAffiliateCode(userData.login)
    await sql`INSERT INTO affiliate_users (id, github_id, username, affiliate_code)
      VALUES (${affId}, ${userData.id}, ${userData.login.substring(0, 50)}, ${affCode})
      ON CONFLICT (github_id) DO UPDATE SET
        username = EXCLUDED.username
    `

    const affiliateCode = request.cookies.get('affiliate_code')?.value
    let referralMessage = ''
    if (affiliateCode && typeof affiliateCode === 'string' && validateAffiliateCode(affiliateCode)) {
      if (isNewUser) {
        try {
          const affiliate = await getAffiliateUserByCode(affiliateCode)
          if (affiliate) {
            const clientIP = getEnhancedClientIP(request)
            const ipHash = await hashIP(clientIP)
            await addReferral(affiliateCode, userData.id, userData.login, ipHash)

            await sql`
              INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
              VALUES (
                'conversion',
                ${affiliate.id},
                ${affiliateCode},
                0,
                'completed',
                ${JSON.stringify({
                  newUserId: userData.id,
                  newUsername: userData.login,
                  referredAt: new Date().toISOString(),
                })},
                NOW()
              )
            `
          }
        } catch (err) {
          console.error('Failed to track referral:', err)
        }
      } else {
        referralMessage = '?message=account_exists_no_referral'
      }
    }

    const response = NextResponse.redirect(new URL(`/dashboard${referralMessage}`, request.url))

    response.cookies.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const userRecord = await sql`SELECT selected_repos, prs_reviewed, plan FROM users WHERE github_id = ${userData.id}`
    const selectedRepos = userRecord[0]?.selected_repos || []
    const prsReviewed = userRecord[0]?.prs_reviewed || 0
    const plan = userRecord[0]?.plan || 'free'

    response.cookies.set('github_user', JSON.stringify({
      id: userData.id,
      username: userData.login,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatar_url,
      selectedRepos,
      prsReviewed,
      plan,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    response.cookies.delete('oauth_state')
    response.cookies.delete('affiliate_code')

    return response
  } catch (err) {
    console.error('GitHub OAuth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}