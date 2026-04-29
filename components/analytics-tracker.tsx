'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function TrackPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        pageUrl: url,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        },
      }),
    }).catch(err => console.error('Analytics tracking error:', err))
  }, [pathname, searchParams])

  return null
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  )
}