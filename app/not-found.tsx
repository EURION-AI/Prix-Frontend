'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <p className="text-8xl font-bold text-primary/20 font-mono">404</p>
          <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
          <p className="text-white/50">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Login
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-white/30 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}