import { sql } from './db'
import { generateAffiliateCode, getAffiliateTier } from './affiliate'

export interface AffiliateUser {
  id: string
  githubId: number
  username: string
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  tier: 'free' | 'basic' | 'advanced'
  createdAt: string
}

export interface Referral {
  id: string
  affiliateId: string
  referredGithubId: number
  referredUsername: string
  referredIpHash: string
  hasPurchased: boolean
  createdAt: string
}

export async function getOrCreateAffiliateUser(githubId: number, username: string): Promise<AffiliateUser> {
  const existing = await sql`
    SELECT * FROM affiliate_users WHERE github_id = ${githubId}
  `

  if (existing.length > 0) {
    const row = existing[0]
    return {
      id: row.id,
      githubId: row.github_id,
      username: row.username,
      affiliateCode: row.affiliate_code,
      referralCount: row.referral_count,
      paidReferralCount: row.paid_referral_count,
      tier: row.tier,
      createdAt: row.created_at.toISOString(),
    }
  }

  const affiliateCode = generateAffiliateCode(username)
  const id = `aff_${Date.now()}_${githubId}_${crypto.randomUUID().split('-')[0]}`

  const result = await sql`
    INSERT INTO affiliate_users (id, github_id, username, affiliate_code)
    VALUES (${id}, ${githubId}, ${username.substring(0, 50)}, ${affiliateCode})
    RETURNING *
  `

  const row = result[0]
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    affiliateCode: row.affiliate_code,
    referralCount: row.referral_count,
    paidReferralCount: row.paid_referral_count,
    tier: row.tier,
    createdAt: row.created_at.toISOString(),
  }
}

export async function getAffiliateUserByCode(code: string): Promise<AffiliateUser | null> {
  const result = await sql`
    SELECT * FROM affiliate_users WHERE affiliate_code = ${code}
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    affiliateCode: row.affiliate_code,
    referralCount: row.referral_count,
    paidReferralCount: row.paid_referral_count,
    tier: row.tier,
    createdAt: row.created_at.toISOString(),
  }
}

export async function getAffiliateUserByGithubId(githubId: number): Promise<AffiliateUser | null> {
  const result = await sql`
    SELECT * FROM affiliate_users WHERE github_id = ${githubId}
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    affiliateCode: row.affiliate_code,
    referralCount: row.referral_count,
    paidReferralCount: row.paid_referral_count,
    tier: row.tier,
    createdAt: row.created_at.toISOString(),
  }
}

export async function addReferral(
  affiliateCode: string,
  referredGithubId: number,
  referredUsername: string,
  referredIpHash: string
): Promise<Referral | null> {
  try {
    const result = await sql.begin(async (tx) => {
      const existingByGithub = await tx`
        SELECT id FROM referrals WHERE referred_github_id = ${referredGithubId}
      `
      if (existingByGithub.length > 0) return null

      const existingByIp = await tx`
        SELECT id FROM referrals WHERE referred_ip_hash = ${referredIpHash}
      `
      if (existingByIp.length > 0) return null

      const affiliateResult = await tx`
        SELECT id FROM affiliate_users WHERE affiliate_code = ${affiliateCode}
        FOR UPDATE
      `
      if (affiliateResult.length === 0) return null

      const affiliateId = affiliateResult[0].id
      const referralId = `ref_${Date.now()}_${referredGithubId}_${crypto.randomUUID().split('-')[0]}`

      await tx`
        INSERT INTO referrals (id, affiliate_id, referred_github_id, referred_username, referred_ip_hash)
        VALUES (${referralId}, ${affiliateId}, ${referredGithubId}, ${referredUsername.substring(0, 50)}, ${referredIpHash})
      `

      await tx`
        UPDATE affiliate_users
        SET referral_count = referral_count + 1
        WHERE id = ${affiliateId}
      `

      return {
        id: referralId,
        affiliateId,
        referredGithubId,
        referredUsername: referredUsername.substring(0, 50),
        referredIpHash,
        hasPurchased: false,
        createdAt: new Date().toISOString(),
      }
    })

    return result || null
  } catch (error) {
    if (error.code === '23505') {
      return null
    }
    throw error
  }
}

export async function markReferralAsPurchased(referredGithubId: number): Promise<void> {
  try {
    await sql.begin(async (tx) => {
      const referralResult = await tx`
        SELECT * FROM referrals
        WHERE referred_github_id = ${referredGithubId} AND has_purchased = FALSE
        FOR UPDATE
      `

      if (referralResult.length === 0) return

      const referral = referralResult[0]

      await tx`
        UPDATE referrals SET has_purchased = TRUE WHERE id = ${referral.id}
      `

      const affiliateResult = await tx`
        SELECT paid_referral_count FROM affiliate_users WHERE id = ${referral.affiliate_id}
      `
      const newPaidCount = (affiliateResult[0]?.paid_referral_count || 0) + 1
      const newTier = newPaidCount >= 5 ? 'advanced' : newPaidCount >= 2 ? 'basic' : 'free'

      await tx`
        UPDATE affiliate_users
        SET
          paid_referral_count = paid_referral_count + 1,
          tier = ${newTier}
        WHERE id = ${referral.affiliate_id}
      `
    })
  } catch (error) {
    console.error('Error marking referral as purchased:', error)
    throw error
  }
}

export async function getReferralsForAffiliate(affiliateId: string): Promise<Referral[]> {
  const result = await sql`
    SELECT * FROM referrals WHERE affiliate_id = ${affiliateId} ORDER BY created_at DESC
  `

  return result.map(row => ({
    id: row.id,
    affiliateId: row.affiliate_id,
    referredGithubId: row.referred_github_id,
    referredUsername: row.referred_username,
    referredIpHash: row.referred_ip_hash,
    hasPurchased: row.has_purchased,
    createdAt: row.created_at.toISOString(),
  }))
}