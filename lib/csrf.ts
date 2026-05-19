import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CSRF_TOKEN_COOKIE = 'csrf_token'
const CSRF_HEADER = 'x-csrf-token'
const TOKEN_LENGTH = 32

export function generateCSRFToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function setCSRFTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function getCSRFTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_COOKIE)?.value
}

export async function validateCSRFToken(request: Request): Promise<NextResponse | null> {
  const method = request.method
  
  // Skip CSRF validation for GET, HEAD, OPTIONS
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER)
  
  // Get token from cookie
  const cookieToken = await getCSRFTokenFromCookie()

  if (!headerToken || !cookieToken) {
    console.error('[CSRF] Missing tokens', { 
      hasHeader: !!headerToken, 
      hasCookie: !!cookieToken 
    })
    return NextResponse.json(
      { error: 'CSRF token required' },
      { status: 403 }
    )
  }

  if (headerToken !== cookieToken) {
    console.error('[CSRF] Token mismatch', { 
      header: headerToken.substring(0, 8) + '...', 
      cookie: cookieToken.substring(0, 8) + '...' 
    })
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  return null
}


export function addCSRFTokenToResponse(response: NextResponse): { response: NextResponse, token: string } {
  const token = generateCSRFToken()
  setCSRFTokenCookie(response, token)
  response.headers.set('X-CSRF-Token', token)
  return { response, token }
}
