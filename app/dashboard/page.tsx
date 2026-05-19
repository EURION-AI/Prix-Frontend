'use client'

import { useEffect, useState } from 'react'
import { Loader2, Github, Search, Check, AlertCircle, ChevronRight, ChevronDown, LayoutDashboard, Settings, Gift, LogOut, User, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Plan } from '@/lib/user-store'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  updated_at: string
}

interface UserData {
  id: number
  username: string
  name: string | null
  email: string | null
  avatarUrl: string
  plan: Plan
  selectedRepos: string[]
  githubInstallationId: number | null
  installationStatus: string
  prsReviewed: number
  planExpiresAt: string | null
  planStartedAt: string | null
  hasActiveSubscription: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [installationValid, setInstallationValid] = useState<boolean | null>(null)
  const [installationStatus, setInstallationStatus] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [pendingAppName, setPendingAppName] = useState('prix-ai-automation')
  const [promptError, setPromptError] = useState<string | null>(null)
  const [isCheckingInstall, setIsCheckingInstall] = useState(false)
  const [filterType, setFilterType] = useState<'date' | 'name-asc' | 'name-desc' | 'selected'>('date')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('pending_install') === 'true') {
      setPendingAppName(params.get('app') || 'prix-ai-automation')
      setShowInstallPrompt(true)
      setPromptError(null)
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])

  useEffect(() => {
    async function initializeDashboard() {
      // Clear any legacy client-side cookies that might conflict with httpOnly session
      if (document.cookie.includes('github_user=')) {
        document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        console.log('[AUTH] Cleared legacy client-side user cookie')
      }

      const params = new URLSearchParams(window.location.search)
      const installationId = params.get('installation_id')

      if (params.get('error') === 'access_denied') {
        setError('You cancelled the GitHub App installation. Prix needs the app installed to work with your repositories. Click the button above to try again.')
      }

      if (params.get('message') === 'account_exists_no_referral') {
        setInfoMessage('You already have an account! You have been logged in. Referral link was ignored.')
      }

      if (installationId) {
        try {
          const response = await fetch('/api/github/mount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ installationId }),
          })
          if (response.ok) {
            setInfoMessage('GitHub App installed! ✅ Click below to select which repos you want Prix to watch.')
            // Refresh user data immediately to update UI state (Mount -> Manage)
            const userResponse = await fetch('/api/auth/user')
            if (userResponse.ok) {
              const data = await userResponse.json()
              setUser(data.user)
            }
          }
        } catch (err) {
          console.error('Failed to sync installation:', err)
        }
      }

      try {
        const response = await fetch('/api/auth/user')
        if (!response.ok) {
          window.location.href = '/login?loop_detected=1'
          return
        }
        const data = await response.json()
        setUser(data.user)
        if (data.user.selectedRepos) {
          setSelectedRepos(data.user.selectedRepos)
        }
        
        // Validate GitHub installation
        await validateInstallation()
        
        await fetchRepos()
      } catch {
        window.location.href = '/login?loop_detected=1'
      }
    }

    initializeDashboard()
  }, [])
// Refetch user state when refresh=true is in URL (after successful payment)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('refresh') === 'true') {
      async function refetchUser() {
        try {
          const response = await fetch('/api/auth/user')
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            if (data.user.selectedRepos) {
              setSelectedRepos(data.user.selectedRepos)
            }
            // Clear refresh param from URL
            window.history.replaceState({}, '', '/dashboard')
          }
        } catch (err) {
          console.error('Failed to refetch user:', err)
        }
      }
      refetchUser()
    }
  }, [])

  
  useEffect(() => {
    let result = [...repos].filter(repo => 
      repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterType === 'date') {
      result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    } else if (filterType === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filterType === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (filterType === 'selected') {
      result = result.filter(repo => selectedRepos.includes(repo.full_name))
    }

    setFilteredRepos(result)
  }, [searchTerm, repos, filterType, selectedRepos])

  async function fetchRepos() {
    try {
      const response = await fetch('/api/github/repos')
      if (!response.ok) throw new Error('Failed to fetch repositories')
      const data = await response.json()
      setRepos(data)
      setFilteredRepos(data)
    } catch (err) {
      setError('Could not load repositories from GitHub. Please try logging in again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  async function validateInstallation() {
    setIsValidating(true)
    try {
      const response = await fetch('/api/github/validate-installation')
      if (response.ok) {
        const data = await response.json()
        setInstallationValid(data.valid)
        setInstallationStatus(data.installationStatus)
        
        if (!data.valid && data.reason) {
          // If installation is invalid (e.g. uninstalled), refetch user to sync the now-null installationId
          const userRes = await fetch('/api/auth/user')
          if (userRes.ok) {
            const userData = await userRes.json()
            setUser(userData.user)
          }

          // Only show as critical error if it's truly disconnected
          if (data.installationStatus === 'disconnected') {
            setError(`GitHub App disconnected: ${data.reason}`)
          } else {
            // Otherwise just a warning
            console.warn(`GitHub App warning: ${data.reason}`)
          }
        }
      }
    } catch (err) {
      console.error('Failed to validate installation:', err)
      setInstallationValid(false)
      setInstallationStatus('error')
    } finally {
      setIsValidating(false)
    }
  }

  async function handleRepoSelect(repoName: string, repoId?: number) {
    const action = selectedRepos.includes(repoName) ? 'remove' : 'add'
    
    if (user && action === 'add' && user.plan === 'free') {
      const limit = 5
      if (selectedRepos.length >= limit) {
        setError(`Your FREE plan limits you to ${limit} repositories. Please upgrade to unlock unlimited repositories.`)
        return
      }
    }
    
    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch('/api/github/select-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoName, action, repositoryId: repoId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to save selection')
      
      if (user) {
        const updatedUser = { ...user, selectedRepos: data.selectedRepos }
        setUser(updatedUser)
      }
      
      setSelectedRepos(data.selectedRepos)
    } catch (err: any) {
      setError(err.message || 'Failed to save your repository selection.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#050508] to-[#050508] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-glow-pulse" />
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-20 h-20 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-t-2 border-primary rounded-full animate-spin" />
            
            {/* Inner pulsing icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center animate-pulse">
                <Github className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Synchronizing Universe</h2>
            <p className="text-white/30 text-sm font-mono uppercase tracking-[0.2em] animate-pulse">
              Initializing Secure Session...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckInstallation = async () => {
    setShowInstallPrompt(false)

    const discoverRes = await fetch('/api/github/discover-installation')
    const discoverData = await discoverRes.json()

    if (discoverData.found) {
      setInfoMessage('GitHub App found! ✅ Select repos below to get started.')
      const userRes = await fetch('/api/auth/user')
      if (userRes.ok) {
        const data = await userRes.json()
        setUser(data.user)
      }
      await fetchRepos()
    }
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      {showInstallPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full mx-4 p-8 rounded-3xl border border-white/10 bg-[#0c0c12] shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Github className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Install Prix on GitHub</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Prix needs access to your repositories through the GitHub App.
                Click below to install it, or if you&apos;ve already installed it, click &quot;Check Installation&quot;.
              </p>

              {promptError && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{promptError}</span>
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={`https://github.com/apps/${pendingAppName}/installations/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Install App
                </a>
                <button
                  onClick={handleCheckInstallation}
                  disabled={isCheckingInstall}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingInstall ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'I\'ve already installed — Check'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary">
              <User className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">User Profile</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Initialize Your Project
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              Select a GitHub repository to enable Prix's automated intelligence and performance monitoring.
            </p>
            {user && user.plan !== 'free' && user.planExpiresAt && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-white/40">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan —{' '}
                  {user.hasActiveSubscription ? (
                    <span className="text-green-400">Renews {new Date(user.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  ) : (
                    <span className="text-orange-400">Expires {new Date(user.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
            {/* Left side: Mount Repositories (large button) */}
            <div className="flex flex-col gap-1.5 flex-grow md:flex-initial">
              <a 
                href={user?.githubInstallationId 
                  ? `https://github.com/settings/installations/${user.githubInstallationId}`
                  : `https://github.com/apps/prix-ai-automation/installations/new`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="h-[104px] px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/95 hover:to-primary/80 border border-primary/20 rounded-xl transition-all flex flex-col justify-center items-center gap-1.5 group shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] text-center min-w-[240px]"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white" />
                  <span className="font-extrabold text-white text-base tracking-wide">
                    {user?.githubInstallationId ? 'Manage Access' : 'Mount Prix Bot'}
                  </span>
                </div>
                <span className="text-[10px] text-white/70 max-w-[200px] leading-tight font-semibold">
                  Change bot installation & repo access on GitHub
                </span>
              </a>
            </div>

            {/* Right side: 2 stacked horizontal buttons */}
            <div className="flex flex-col gap-2 min-w-[200px] flex-grow md:flex-initial">
              <Link 
                href="/affiliate"
                className="w-full h-[48px] px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-start gap-3 group"
              >
                <Gift className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm text-white/90 group-hover:text-white">Affiliate Program</span>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full h-[48px] px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-start gap-3 group outline-none">
                    <Settings className="w-4 h-4 text-white/60 group-hover:rotate-45 transition-transform" />
                    <span className="font-semibold text-sm text-white/90 group-hover:text-white">Account Settings</span>
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0c0c12] border-white/10 text-white" align="end">
                <DropdownMenuLabel className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-white/10 focus:text-white hover:bg-white/10 hover:text-white cursor-pointer" asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/10 focus:text-white hover:bg-white/10 hover:text-white cursor-pointer" asChild>
                    <Link href="/dashboard/settings/billing">
                      <CreditCard className="mr-2 h-4 w-4 text-primary" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {(installationValid === false || installationStatus === 'empty') && (
          <div className={`mb-8 p-4 border rounded-2xl flex items-center justify-between gap-4 ${
            installationStatus === 'empty' 
              ? 'bg-blue-500/10 border-blue-500/20' 
              : 'bg-orange-500/10 border-orange-500/20'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-5 h-5 ${
                installationStatus === 'empty' ? 'text-blue-400' : 'text-orange-400'
              }`} />
              <div>
                <p className={`font-medium ${
                  installationStatus === 'empty' ? 'text-blue-400' : 'text-orange-400'
                }`}>
                  {installationStatus === 'empty' 
                    ? 'GitHub App has no repository access' 
                    : 'Prix AI GitHub App is disconnected'}
                </p>
                <p className={`${
                  installationStatus === 'empty' ? 'text-blue-400/70' : 'text-orange-400/70'
                } text-sm`}>
                  {installationStatus === 'empty'
                    ? 'Please grant access to at least one repository to enable automated reviews.'
                    : 'Reconnect to continue reviewing PRs'}
                </p>
              </div>
            </div>
            <a
              href={user?.githubInstallationId 
                ? `https://github.com/settings/installations/${user.githubInstallationId}`
                : "https://github.com/apps/prix-ai-automation/installations/new"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              {installationStatus === 'empty' ? 'Manage Access' : 'Reconnect App'}
            </a>
          </div>
        )}

        {infoMessage && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-blue-400">
            <Check className="w-5 h-5" />
            <p>{infoMessage}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-3xl">
            <div className="relative group flex-grow">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search your repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[70px] bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/20"
              />
            </div>
            
            <div>
              <Select
                value={filterType}
                onValueChange={(val) => setFilterType(val as any)}
              >
                <SelectTrigger className="w-full !h-[70px] bg-[#0c0c12]/80 backdrop-blur border border-white/10 rounded-2xl pl-6 pr-12 text-sm sm:text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 text-white/90 cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex justify-between items-center outline-none [&>span]:w-full [&>span]:text-left border-solid">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c12]/95 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                  <SelectItem value="date" className="hover:bg-white/[0.05] focus:bg-white/[0.05] text-white/90 font-semibold py-3.5 px-6 cursor-pointer rounded-none border-b border-white/5 last:border-b-0">
                    Sort: Most Recent
                  </SelectItem>
                  <SelectItem value="name-asc" className="hover:bg-white/[0.05] focus:bg-white/[0.05] text-white/90 font-semibold py-3.5 px-6 cursor-pointer rounded-none border-b border-white/5 last:border-b-0">
                    Sort: Name (A-Z)
                  </SelectItem>
                  <SelectItem value="name-desc" className="hover:bg-white/[0.05] focus:bg-white/[0.05] text-white/90 font-semibold py-3.5 px-6 cursor-pointer rounded-none border-b border-white/5 last:border-b-0">
                    Sort: Name (Z-A)
                  </SelectItem>
                  <SelectItem value="selected" className="hover:bg-white/[0.05] focus:bg-white/[0.05] text-white/90 font-semibold py-3.5 px-6 cursor-pointer rounded-none">
                    Filter: Selected by Prix
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {user && (
            <div className="h-[70px] bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center gap-4 min-w-max">
              <span className="text-white/40 font-medium">Selected Repositories</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary">{selectedRepos.length}</span>
                <span className="text-white/20">/</span>
                <span className="text-lg font-bold text-white/60">
                  {user.plan === 'free' ? '5' : 'Unlimited'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleRepoSelect(repo.full_name, repo.id)}
                disabled={isSaving}
                className={`w-full text-left p-4 sm:p-5 transition-all flex items-center gap-4 group border-l-2 ${
                  selectedRepos.includes(repo.full_name) 
                    ? 'bg-primary/10 hover:bg-primary/15 opacity-100 border-l-primary' 
                    : 'hover:bg-white/5 opacity-50 hover:opacity-90 border-l-transparent'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  selectedRepos.includes(repo.full_name)
                    ? 'bg-primary border-primary text-white'
                    : 'border-white/20 bg-transparent text-transparent group-hover:border-white/40'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                
                <div className="flex items-center gap-4 w-full min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${repo.private ? 'bg-yellow-500 text-black font-extrabold shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-green-500 text-black font-extrabold shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}>
                    <Github className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold truncate text-sm sm:text-base ${selectedRepos.includes(repo.full_name) ? 'text-white' : 'text-white/90'}`}>
                        {repo.name}
                      </span>
                      {repo.private && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-white/10 rounded text-white/60 shrink-0">
                          Private
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <span className="text-white/40 text-xs truncate max-w-xl">
                        {repo.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <span className="text-xs text-white/30 font-mono">
                    {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                  {isSaving && selectedRepos.includes(repo.full_name) && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-white/40 text-lg">No repositories found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
