import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SmoothScroll } from '@/components/smooth-scroll'
import { NotificationContainer } from '@/components/notification'
import { VisitTracker } from '@/components/visit-tracker'
import { jsonLd } from './jsonld'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Prix - AI-Powered GitHub PR Reviewer | Ship Code Faster',
  description: 'AI that reviews your GitHub PRs in seconds. Catches bugs, security issues, and generates fixes. Free to start.',
  generator: 'v0.app',
  keywords: ['AI code review tool', 'automated PR review', 'GitHub PR reviewer AI', 'code review automation', 'AI code reviewer for teams', 'AI code review', 'code analysis', 'developer tools', 'code quality', 'bug detection', 'security scanning'],
  authors: [{ name: 'Prix' }],
  creator: 'Prix',
  publisher: 'Prix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prix - AI-Powered GitHub PR Reviewer',
    description: 'AI that reviews your GitHub PRs in seconds. Catches bugs, security issues, and generates fixes. Free to start.',
    site: '@prixai',
    creator: '@prixai',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prix.ai',
    siteName: 'Prix',
    title: 'Prix - AI-Powered GitHub PR Reviewer',
    description: 'AI that reviews your GitHub PRs in seconds. Catches bugs, security issues, and generates fixes. Free to start.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prix - AI Code Review Platform',
      },
    ],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#050508] text-foreground">
        <NotificationContainer />
        <VisitTracker />
        <Analytics />
        <SmoothScroll>
          {children}
        </SmoothScroll>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
