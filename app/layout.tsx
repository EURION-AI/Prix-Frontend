import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SmoothScroll } from '@/components/smooth-scroll'
import { NotificationContainer } from '@/components/notification'
import { VisitTracker } from '@/components/visit-tracker'
import { MatrixBackground } from '@/components/matrix-background'
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
  metadataBase: new URL('https://www.prixai.xyz'),
  title: 'Prix AI - AI-Powered GitHub PR Reviewer | Ship Code Faster',
  description: 'Prix AI automatically reviews your GitHub pull requests, suggests fixes, and raises PRs — helping you ship faster with fewer bugs. Free to start with 15 PR fixes per month.',
  alternates: {
    canonical: 'https://www.prixai.xyz',
  },
  keywords: ['Prix AI', 'Prix', 'prixai', 'AI code review tool', 'automated PR review', 'GitHub PR reviewer AI', 'code review automation', 'AI code reviewer for teams', 'AI code review', 'code analysis', 'developer tools', 'code quality', 'bug detection', 'security scanning'],
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
    url: 'https://www.prixai.xyz',
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
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased bg-[#050508] text-foreground">
        <NotificationContainer />
        <VisitTracker />
        <Analytics />
        <SmoothScroll>
          <MatrixBackground />
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
