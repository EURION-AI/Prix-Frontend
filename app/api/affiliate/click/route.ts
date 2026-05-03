import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getAffiliateUserByCode } from '@/lib/affiliate-store-db'
import { rateLimit } from '@/lib/security'
import { validateAffiliateCode } from '@/lib/validation'
import { hashIP } from '@/lib/affiliate'

export async function GET(request: NextRequest) {
  const rateLimitResult = rateLimit(request, 30)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return NextResponse.redirect(new URL('/?error=rate_limit', request.url))
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code || !validateAffiliateCode(code)) {
    return NextResponse.redirect(new URL('/?error=invalid_code', request.url))
  }

  try {
    const affiliate = await getAffiliateUserByCode(code)

    if (!affiliate) {
      return NextResponse.redirect(new URL('/?error=invalid_code', request.url))
    }

    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const ipHash = await hashIP(ip)

    await sql`
      INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
      VALUES (
        'click',
        ${affiliate.id},
        ${code},
        0,
        'pending',
        ${JSON.stringify({
          userAgent,
          referer,
          timestamp: new Date().toISOString(),
        })},
        NOW()
      )
    `

    const response = NextResponse.redirect(new URL(`/?ref=${code}`, request.url))
    response.cookies.set('affiliate_code', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Affiliate link click error:', error)
    return NextResponse.redirect(new URL('/?error=click_failed', request.url))
  }
}