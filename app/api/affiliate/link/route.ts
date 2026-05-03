import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateUserByCode } from '@/lib/affiliate-store-db'
import { validateAffiliateCode } from '@/lib/validation'
import { csrfCheck, rateLimit, addSecurityHeaders } from '@/lib/security'

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('github_token')?.value
  return !!token
}

export async function GET(request: NextRequest) {
  const csrfResult = csrfCheck(request)
  if (csrfResult) return csrfResult

  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 })
  }

  if (typeof code !== 'string' || code.length < 3 || code.length > 50) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
  }

  if (!validateAffiliateCode(code)) {
    return NextResponse.json({ error: 'Invalid affiliate code format' }, { status: 400 })
  }

  try {
    const affiliate = await getAffiliateUserByCode(code)
    
    if (!affiliate) {
      return NextResponse.json({ error: 'Invalid affiliate code' }, { status: 404 })
    }

    const response = NextResponse.json({ 
      success: true,
      message: 'Affiliate link validated' 
    })
    
    response.cookies.set('affiliate_code', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return addSecurityHeaders(response, rateLimitResult.allowed ? 9 : 0, 60000)
  } catch (error) {
    console.error('Affiliate link error:', error)
    return NextResponse.json({ error: 'Failed to process affiliate link' }, { status: 500 })
  }
}