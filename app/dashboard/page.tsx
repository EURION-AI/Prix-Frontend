'use client'

import { useEffect, useState } from 'react'
import { Loader2, Github, Search, Check, AlertCircle, ChevronRight, LayoutDashboard, Settings, Gift, LogOut, User, CreditCard } from 'lucide-react'
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

  useEffect(() => {
    async function initializeDashboard() {
      // Clear any legacy client-side cookies that might conflict with httpOnly session
      if (document.cookie.includes('github_user=')) {
        document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        console.log('[AUTH] Cleared legacy client-side user cookie')
      }

      const params = new URLSearchParams(window.location.search)
      const installationId = params.get('installation_id')

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
            setInfoMessage('Successfully mounted repositories! You can now select them below.')
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
          window.location.href = '/login'
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
        window.location.href = '/login'
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
    const filtered = repos.filter(repo => 
      repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRepos(filtered)
  }, [searchTerm, repos])

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

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
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
            <div className="mt-4 px-5 py-3 bg-primary/10 border border-primary/20 rounded-xl inline-flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <span className="text-white/70">
                First time? Click <strong className="text-primary font-bold">Mount Repositories</strong> to install the Prix GitHub App on your repos, then select them below.
              </span>
            </div>
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

          <div className="flex gap-3">
            <a 
              href={user?.githubInstallationId 
                ? `https://github.com/settings/installations/${user.githubInstallationId}`
                : `https://github.com/apps/prix-ai-automation/installations/new`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl transition-all flex items-center gap-2 group"
            >
              <Github className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">
                {user?.githubInstallationId ? 'Manage Repositories' : 'Mount Repositories'}
              </span>
            </a>

            <Link 
              href="/affiliate"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 group"
            >
              <Gift className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
              <span className="font-medium">Affiliate Program</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 group outline-none">
                  <Settings className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Settings</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0c0c12] border-white/10 text-white" align="end">
                <DropdownMenuLabel className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" asChild>
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search your repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/20"
            />
          </div>
          {user && (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-5 px-6 flex items-center gap-4 min-w-max">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleRepoSelect(repo.full_name, repo.id)}
                disabled={isSaving}
                className={`text-left p-6 rounded-2xl border transition-all relative group card-interactive ${
                  selectedRepos.includes(repo.full_name) 
                    ? 'bg-primary/10 border-primary !opacity-100 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${repo.private ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <Github className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg truncate max-w-[200px]">{repo.name}</span>
                  </div>
                  {repo.private && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40">
                      Private
                    </span>
                  )}
                </div>
                
                <p className="text-white/40 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-white/20 font-mono">
                    Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    {isSaving && selectedRepos.includes(repo.full_name) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : selectedRepos.includes(repo.full_name) ? (
                      <span className="flex items-center gap-2 text-red-400 hover:text-red-300">
                        Remove
                      </span>
                    ) : (
                      <>
                        <span>Select</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>

                {selectedRepos.includes(repo.full_name) && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/20 text-xl">No repositories found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
