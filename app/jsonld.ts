export const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Prix',
  description: 'AI-powered GitHub PR reviewer that automatically reviews pull requests and generates fixes. Catches bugs, security issues, and performance problems in seconds.',
  url: 'https://www.prixai.xyz',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free plan with 5 PR and 5 issue fixes per month for public repositories.',
    },
    {
      '@type': 'Offer',
      name: 'Base',
      price: '7',
      priceCurrency: 'USD',
      description: 'Unlimited PR reviews for professional developers. $9.99/month regular price.',
      alternateName: '$9.99',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '9.99',
      priceCurrency: 'USD',
      description: 'For teams with unlimited members, admin dashboard, and dedicated support. $19.99/month regular price.',
      alternateName: '$19.99',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '2847',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'AI-powered code review',
    'Automated PR review',
    'Security vulnerability scanning',
    'Bug detection',
    'Performance optimization',
    'Fix generation',
    'GitHub integration',
    'GitLab integration',
    'Bitbucket integration',
    'GPT-4 powered reasoning',
    'Zero-configuration setup',
  ],
  provider: {
    '@type': 'Organization',
    name: 'Prix',
    url: 'https://www.prixai.xyz',
  },
  softwareVersion: '1.2.0',
  screenshot: 'https://www.prixai.xyz/og-image.png',
}

// Part 3: FAQ Schema for rich snippets
export const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does AI PR review work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI analyzes your pull requests using advanced language models to identify bugs, security issues, and code quality problems. It provides instant feedback and can automatically generate fixes, helping you ship code faster with fewer errors.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Prix AI free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Prix AI offers a free Starter plan with 5 PR reviews and 5 issue fixes per month for public repositories. Paid plans start at $7/month for unlimited reviews.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which platforms does Prix AI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI currently supports GitHub, with GitLab and Bitbucket integrations coming soon. It works with any programming language and framework.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is AI code review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI achieves 95% accuracy in bug detection and security vulnerability identification. It uses GPT-4 powered reasoning and AST analysis to provide reliable, actionable feedback.',
      },
    },
  ],
}

// Combined JSON-LD export for layout
export const jsonLd = [softwareApplicationLd, faqLd]