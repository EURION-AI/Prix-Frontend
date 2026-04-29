import { promises as fs } from 'fs'
import path from 'path'
import { AffiliateData, AffiliateUser, Referral, generateAffiliateCode, getAffiliateTier } from './affiliate'

const DATA_FILE = path.join(process.cwd(), 'data', 'affiliates.json')
const LOCK_FILE = path.join(process.cwd(), 'data', 'affiliates.lock')

async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function acquireLock(maxRetries = 50, retryDelay = 50): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.writeFile(LOCK_FILE, process.pid.toString(), { flag: 'wx' })
      return true
    } catch {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
  return false
}

async function releaseLock() {
  try {
    await fs.unlink(LOCK_FILE)
  } catch {
    // Lock may already be released
  }
}

async function withLock<T>(operation: () => Promise<T>): Promise<T> {
  const lockAcquired = await acquireLock()
  if (!lockAcquired) {
    throw new Error('Could not acquire lock for data operation')
  }
  try {
    return await operation()
  } finally {
    await releaseLock()
  }
}

async function readData(): Promise<AffiliateData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { users: [], referrals: [] }
  }
}

async function writeData(data: AffiliateData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function getOrCreateAffiliateUser(githubId: number, username: string): Promise<AffiliateUser> {
  return withLock(async () => {
    const data = await readData()
    
    let user = data.users.find(u => u.githubId === githubId)
    
    if (!user) {
      user = {
        id: `aff_${Date.now()}_${githubId}_${crypto.randomUUID().split('-')[0]}`,
        githubId,
        username: username.substring(0, 50),
        affiliateCode: generateAffiliateCode(username),
        referralCount: 0,
        paidReferralCount: 0,
        tier: 'free',
        createdAt: new Date().toISOString(),
      }
      data.users.push(user)
      await writeData(data)
    }
    
    return user
  })
}

export async function getAffiliateUserByCode(code: string): Promise<AffiliateUser | null> {
  return withLock(async () => {
    const data = await readData()
    return data.users.find(u => u.affiliateCode === code) || null
  })
}

export async function getAffiliateUserByGithubId(githubId: number): Promise<AffiliateUser | null> {
  return withLock(async () => {
    const data = await readData()
    return data.users.find(u => u.githubId === githubId) || null
  })
}

export async function addReferral(
  affiliateCode: string, 
  referredGithubId: number, 
  referredUsername: string, 
  referredIpHash: string
): Promise<Referral | null> {
  return withLock(async () => {
    const data = await readData()
    
    const existingByGithub = data.referrals.find(r => r.referredGithubId === referredGithubId)
    if (existingByGithub) return null

    const existingByIp = data.referrals.find(r => r.referredIpHash === referredIpHash)
    if (existingByIp) return null

    const affiliate = data.users.find(u => u.affiliateCode === affiliateCode)
    if (!affiliate) return null

    const referral: Referral = {
      id: `ref_${Date.now()}_${referredGithubId}_${crypto.randomUUID().split('-')[0]}`,
      affiliateId: affiliate.id,
      referredGithubId,
      referredUsername: referredUsername.replace(/[<>\"'&]/g, '').substring(0, 50),
      referredIpHash,
      hasPurchased: false,
      createdAt: new Date().toISOString(),
    }
    
    data.referrals.push(referral)
    
    affiliate.referralCount += 1
    await writeData(data)
    
    return referral
  })
}

export async function markReferralAsPurchased(referredGithubId: number): Promise<void> {
  return withLock(async () => {
    const data = await readData()
    
    const referral = data.referrals.find(r => r.referredGithubId === referredGithubId && !r.hasPurchased)
    if (!referral) return

    referral.hasPurchased = true
    
    const affiliate = data.users.find(u => u.id === referral.affiliateId)
    if (affiliate) {
      affiliate.paidReferralCount += 1
      affiliate.tier = getAffiliateTier(affiliate.paidReferralCount)
    }
    
    await writeData(data)
  })
}

export async function getReferralsForAffiliate(affiliateId: string): Promise<Referral[]> {
  return withLock(async () => {
    const data = await readData()
    return data.referrals.filter(r => r.affiliateId === affiliateId)
  })
}