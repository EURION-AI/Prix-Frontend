export interface AffiliateUser {
  id: string
  githubId: number
  username: string
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  accumulatedCredit: number
  tier: 'free' | 'starter' | 'pro'
  createdAt: string
  updatedAt?: string
}

export interface Referral {
  id: string
  affiliateId: string
  referredGithubId: number
  referredUsername: string
  referredIpHash: string
  hasPurchased: boolean
  purchasedPlan?: string | null
  purchasedAmount?: number | null
  createdAt: string
}

export const AFFILIATE_TIERS = {
  free: { requiredReferrals: 0 },
  starter: { requiredReferrals: 2 },
  pro: { requiredReferrals: 3 },
} as const

export function generateAffiliateCode(username: string): string {
  // Take first 4-6 chars of username, make it clean
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6)
  
  // Generate a short random string (4 chars)
  const randomPart = Math.random().toString(36).substring(2, 6)
  
  // Combine for a short, clean code like "prixabc", "warsx7", etc.
  const code = cleanUsername + randomPart
  
  // Ensure it's at least 6 chars, pad with random if needed
  return code.length >= 6 ? code : code + Math.random().toString(36).substring(2, 8 - code.length)
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + (process.env.IP_SALT || 'prix_salt_v1'))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 32)
}

export function getAffiliateTier(paidReferralCount: number): 'free' | 'starter' | 'pro' {
  if (paidReferralCount >= AFFILIATE_TIERS.pro.requiredReferrals) return 'pro'
  if (paidReferralCount >= AFFILIATE_TIERS.starter.requiredReferrals) return 'starter'
  return 'free'
}