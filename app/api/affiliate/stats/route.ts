import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getOrCreateAffiliateUser, getReferralsForAffiliate } from '@/lib/affiliate-store-db'

function getAuthenticatedUserId(request: NextRequest): number | null {
  const userCookie = request.cookies.get('github_user')?.value
  if (!userCookie) return null
  try {
    const user = JSON.parse(decodeURIComponent(userCookie))
    return typeof user.id === 'number' ? user.id : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('github_token')?.value

  // Milestone requirements
  const STARTER_REQUIRED = 2
  const PRO_REQUIRED = 3

  if (!authToken) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const authenticatedUserId = getAuthenticatedUserId(request)
  if (!authenticatedUserId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  // Get username from cookie session instead of query params
  let username: string = `user_${authenticatedUserId}`
  try {
    const userCookie = request.cookies.get('github_user')?.value
    if (userCookie) {
      const cookieData = JSON.parse(decodeURIComponent(userCookie))
      if (cookieData.username) {
        username = String(cookieData.username).substring(0, 100)
      }
    }
  } catch {
    // fallback to default
  }

  // 1. Join with users table to get the current state
  const userResult = await sql`
    SELECT * FROM users WHERE github_id = ${authenticatedUserId}
  `
  
  if (userResult.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let user = userResult[0]

  // Note: Queued plan activation is now handled centrally in lib/auth.ts on every authenticated request.

  // 3. Get affiliate data
  const affiliateResult = await sql`
    SELECT * FROM affiliate_users WHERE github_id = ${authenticatedUserId}
  `

  if (affiliateResult.length === 0) {
    const affiliate = await getOrCreateAffiliateUser(authenticatedUserId, username)
    
    return NextResponse.json({
      affiliateCode: affiliate.affiliateCode,
      referralCount: affiliate.referralCount,
      paidReferralCount: affiliate.paidReferralCount,
      rewardClaimed: affiliate.rewardClaimed,
      rewardClaimedAt: affiliate.rewardClaimedAt,
      tier: user.plan || 'free',
      queuedPlan: user.queued_plan || null,
      starterRequired: STARTER_REQUIRED,
      proRequired: PRO_REQUIRED,
      progressToStarter: Math.min(((affiliate.paidReferralCount || 0) / STARTER_REQUIRED) * 100, 100),
      progressToPro: Math.min(((affiliate.paidReferralCount || 0) / PRO_REQUIRED) * 100, 100),
      referrals: [],
    })
  }

  const affiliateData = affiliateResult[0]
  const referrals = await getReferralsForAffiliate(affiliateData.id)
    
  const paidReferralCount = affiliateData.paid_referral_count || 0
  const progressToStarter = Math.min((paidReferralCount / STARTER_REQUIRED) * 100, 100)
  const progressToPro = Math.min((paidReferralCount / PRO_REQUIRED) * 100, 100)

  return NextResponse.json({
    affiliateCode: affiliateData.affiliate_code,
    referralCount: affiliateData.referral_count,
    paidReferralCount: paidReferralCount,
    rewardClaimed: affiliateData.reward_claimed || false,
    rewardClaimedAt: affiliateData.reward_claimed_at || null,
    tier: user.plan,
    queuedPlan: user.queued_plan || null,
    starterRequired: STARTER_REQUIRED,
    proRequired: PRO_REQUIRED,
    progressToStarter,
    progressToPro,
    referrals: referrals.map(r => ({
      username: sanitizeUsername(r.referredUsername || 'Anonymous'),
      hasPurchased: r.hasPurchased,
      purchasedPlan: r.purchasedPlan || null,
      createdAt: r.createdAt,
    })),
  })
}

function sanitizeUsername(username: string): string {
  return username.replace(/[<>\"'&]/g, '').substring(0, 50)
}