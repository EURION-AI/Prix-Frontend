import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`

function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
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

  const response = NextResponse.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}` })
  
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })

  return response
}