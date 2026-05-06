import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('github_user')

  // 1. Redirection Logic for Home Page
  // We only redirect if they are trying to visit specific pages while logged out,
  // or if they are already logged in and visiting login.
  // BUT the root homepage should ALWAYS be accessible.
  
  if (pathname === '/login' && userCookie) {
    try {
      // Basic validation to ensure the cookie is valid JSON
      JSON.parse(userCookie.value)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // If cookie is malformed, don't redirect to allow user to re-authenticate
    }
  }

  // 2. Security Headers Logic
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Development mode requires 'unsafe-eval' for React debugging
  // Production builds never use eval()
  const isDev = process.env.NODE_ENV === 'development'
  const scriptSrc = isDev 
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com"
    : "'self' 'unsafe-inline' https://checkout.razorpay.com"

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https: https://api.razorpay.com https://lumberjack.razorpay.com;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|.*\\.png$).*)',
  ],
}
