import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('github_user')

  if (pathname === '/login' && userCookie) {
    const hasLoopParam = request.nextUrl.searchParams.get('loop_detected')
    if (hasLoopParam) {
      const response = NextResponse.next()
      response.cookies.delete('github_token')
      response.cookies.delete('github_user')
      response.cookies.delete('oauth_state')
      return response
    }
    try {
      JSON.parse(userCookie.value)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
    }
  }

  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const isDev = process.env.NODE_ENV === 'development'
  const scriptSrc = isDev 
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://www.paypal.com https://www.paypalobjects.com"
    : "'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com https://www.paypal.com https://www.paypalobjects.com"

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https: https://api.razorpay.com https://lumberjack.razorpay.com https://api-m.paypal.com;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.paypal.com https://www.paypalobjects.com;
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
    '/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|sitemap.xml|robots.txt|.*\\.png$|\\.well-known/.*).*)',
  ],
}
