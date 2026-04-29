import { NextResponse } from 'next/server'
import { getClientIP, checkRateLimit } from './rate-limit'

export function csrfCheck(request: Request): NextResponse | null {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    if (origin) {
      try {
        const originUrl = new URL(origin)
        if (originUrl.host !== host) {
          console.error('CSRF: Origin mismatch', { origin: originUrl.host, host })
          return NextResponse.json(
            { error: 'Invalid origin' },
            { status: 403 }
          )
        }
      } catch {
        console.error('CSRF: Invalid origin URL')
        return NextResponse.json(
          { error: 'Invalid origin' },
          { status: 403 }
        )
      }
    }
  }
  
  return null
}

export function rateLimit(request: Request, customLimit = 30): { allowed: boolean; response?: NextResponse } {
  const ip = getClientIP(request)
  const identifier = `${ip}:${request.method}`
  const result = checkRateLimit(identifier)
  
  if (!result.allowed) {
    const response = NextResponse.json(
      { error: 'Too many requests. Please try again later.', retryAfter: Math.ceil(result.resetIn / 1000) },
      { status: 429 }
    )
    response.headers.set('Retry-After', Math.ceil(result.resetIn / 1000).toString())
    response.headers.set('X-RateLimit-Remaining', '0')
    response.headers.set('X-RateLimit-Reset', result.resetIn.toString())
    return { allowed: false, response }
  }
  
  return { allowed: true }
}

export function addSecurityHeaders(response: NextResponse, remaining: number, resetIn: number): NextResponse {
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString())
  return response
}