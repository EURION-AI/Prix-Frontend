'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Github, Loader2, LogOut, CreditCard, User, Copy, Check, Users, Gift, Star, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  id: number
  username: string
  name: string | null
  email: string | null
  avatarUrl: string
}

interface AffiliateStats {
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  tier: 'free' | 'basic' | 'advanced'
  requiredForBasic: number
  requiredForAdvanced: number
  progressToBasic: number
  progressToAdvanced: number
  referrals: {
    username: string
    hasPurchased: boolean
    createdAt: string
  }[]
}

function GitHubOAuthButton() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refCode = searchParams.get('ref')

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let url = '/api/auth/github'
      if (refCode) {
        await fetch(`/api/affiliate/link?code=${encodeURIComponent(refCode)}`)
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to initiate GitHub login')
        setIsLoading(false)
      }
    } catch {
      setError('Failed to initiate GitHub login')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam === 'access_denied' 
        ? 'GitHub authorization was denied. Please try again.' 
        : 'An error occurred during GitHub login.')
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex items-center gap-3 px-8 py-4 bg-[#24292e] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#24292e]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/10"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirecting to GitHub...
          </>
        ) : (
          <>
            <Github className="w-5 h-5" style={{ color: 'white' }} />
            Continue with GitHub
          </>
        )}
      </button>
      
      {error && (
        <p className="text-red-400 text-sm text-center max-w-md">{error}</p>
      )}
      
      <p className="text-white/30 text-xs text-center max-w-md">
        By continuing, you agree to our{' '}
        <Link href="/legal/terms" className="text-white/50 hover:text-primary transition-colors">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/legal/privacy" className="text-white/50 hover:text-primary transition-colors">Privacy Policy</Link>
      </p>
    </div>
  )
}

function AffiliateDashboard({ user }: { user: UserData }) {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const affiliateLink = stats?.affiliateCode && typeof window !== 'undefined' 
    ? `${window.location.origin}/login?ref=${stats.affiliateCode}`
    : ''

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/affiliate/stats?githubId=${user.id}&username=${user.username}`)
        const data = await response.json()
        setStats(data)
      } catch {
        setError('Failed to load affiliate stats')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [user.id, user.username])

  const copyToClipboard = async () => {
    if (affiliateLink) {
      await navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'Failed to load stats'}</p>
      </div>
    )
  }

  const tierColors = {
    free: 'text-white/40',
    basic: 'text-blue-400',
    advanced: 'text-primary',
  }

  const tierLabels = {
    free: 'Free Tier',
    basic: 'Pro Plan',
    advanced: 'Team Plan',
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`text-2xl font-bold mb-2 ${tierColors[stats.tier]}`}>
          {tierLabels[stats.tier]}
        </div>
        <p className="text-white/40 text-sm">
          {stats.tier === 'advanced' 
            ? '🎉 You have lifetime Team access!' 
            : stats.tier === 'basic'
            ? '✨ You have lifetime Pro access!'
            : `Get ${stats.requiredForBasic - stats.paidReferralCount} more paid referrals for Pro, ${stats.requiredForAdvanced - stats.paidReferralCount} for Team`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-white/40 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.referralCount}</div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Referrals</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Gift className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.paidReferralCount}</div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Paid</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Star className={`w-6 h-6 mx-auto mb-2 ${tierColors[stats.tier]}`} />
          <div className={`text-2xl font-bold ${tierColors[stats.tier]}`}>
            {stats.tier === 'free' ? '0' : stats.tier === 'basic' ? '1' : '2'}
          </div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Unlocks</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-bold text-white mb-3">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white/60 text-sm font-mono"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {stats.referrals.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Referrals</h3>
          <div className="space-y-3">
            {stats.referrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white/40" />
                  </div>
                  <span className="text-white">{referral.username}</span>
                </div>
                {referral.hasPurchased ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Paid ✓</span>
                ) : (
                  <span className="px-3 py-1 bg-white/10 text-white/40 text-xs font-bold rounded-full">Signed Up</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UserInfo({ user, onLogout }: { user: UserData; onLogout: () => void }) {
  const [showAffiliate, setShowAffiliate] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-20 h-20 rounded-full border-2 border-white/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-10 h-10 text-white/40" />
          </div>
        )}
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">
          {user.name || user.username}
        </h2>
        {user.email && (
          <p className="text-white/40 text-sm">{user.email}</p>
        )}
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => setShowAffiliate(!showAffiliate)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          <Gift className="w-4 h-4" />
          {showAffiliate ? 'Hide' : 'Earn'} Free Access
        </button>
        
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/90 transition-all duration-200"
        >
          <Zap className="w-4 h-4" />
          Upgrade Plan
        </Link>
        
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 text-white/60 font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {showAffiliate && <AffiliateDashboard user={user} />}
    </div>
  )
}

export default function LoginPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      try {
        const cookieValue = userCookie.substring(userCookie.indexOf('=') + 1)
        const userData = JSON.parse(decodeURIComponent(cookieValue))
        setUser(userData)
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    document.cookie = 'github_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase">Prix</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            {user ? `Welcome back` : 'Get Started with Prix'}
          </h1>
          <p className="text-white/50 text-sm">
            {user ? 'Manage your account and subscription' : 'Start shipping better code with AI-powered reviews'}
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            </div>
          ) : user ? (
            <UserInfo user={user} onLogout={handleLogout} />
          ) : (
            <Suspense fallback={
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            }>
              <GitHubOAuthButton />
            </Suspense>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/20 text-xs">
            {user ? 'Signed in via GitHub' : 'Free forever plan available • No credit card required'}
          </p>
        </div>
      </div>
    </div>
  )
}