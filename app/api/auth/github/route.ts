import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '') : ''
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${baseUrl}/api/auth/callback`

function generateState(): string {
  // Increase entropy to 64 bytes (512 bits) for stronger security
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  
  // Add timestamp and nonce for additional entropy
  const timestamp = Date.now().toString(36)
  const nonce = crypto.randomUUID().replace(/-/g, '')
  
  // Combine all entropy sources
  const randomHex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${timestamp}_${nonce}_${randomHex}`
}

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

export async function GET(request: Request) {
  const ip = getClientIP(request)
  const rateLimitResult = checkRateLimit(`oauth:${ip}`)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many OAuth requests. Please try again later.' },
      { status: 429 }
    )
  }

  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: 'OAuth not configured' },
      { status: 500 }
    )
  }

  const state = generateState()
  const scope = 'read:user user:email repo'
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope,
    state,
  })

  const host = request.headers.get('host') || ''
  const cookieDomain = host.endsWith('prixai.xyz') ? '.prixai.xyz' : undefined

  const response = NextResponse.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}` })
  
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
    domain: cookieDomain,
  })

  return response
}