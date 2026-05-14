export const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Prix AI',
  description: 'AI-powered GitHub PR reviewer that automatically reviews pull requests and generates fixes. Catches bugs, security issues, and performance problems in seconds.',
  url: 'https://www.prixai.xyz',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      description: '15 PR reviews per month (5 per day), 3 issue plans, 3 auto fixes. Public repositories. Free forever.',
    },
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '6.99',
      priceCurrency: 'USD',
      description: '400 PR reviews & auto fixes per month, 50 AI issue plans. Includes private repositories, bug detection, security scanning, and basic AI planning.',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '9.99',
      priceCurrency: 'USD',
      description: 'Up to 1000 total operations per month with priority processing, unlimited AI issue planning, deeper multi-file analysis, and advanced security scanning.',
    },
  ],
  featureList: [
    'AI-powered code review',
    'Automated PR review',
    'Security vulnerability scanning',
    'Bug detection',
    'Fix generation',
    'GitHub integration',
    'Advanced LLM reasoning',
    'Zero-configuration setup',
  ],
  provider: {
    '@type': 'Organization',
    name: 'Prix AI',
    url: 'https://www.prixai.xyz',
  },
  softwareVersion: '1.2.0',
  screenshot: 'https://www.prixai.xyz/og-image.png',
}

export const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Prix AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI is an AI-powered GitHub PR reviewer that automatically analyzes pull requests, detects bugs, security vulnerabilities, and code quality issues, and even generates fixes. It helps developers ship code faster with fewer errors.',
      },
    },
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
        text: 'Yes, Prix AI offers a free plan with 15 PR reviews per month (5 per day), 3 issue plans, and 3 auto fixes for public repositories. Paid plans start at $6.99/month for the Starter plan with 400 reviews and 50 issue plans, and $9.99/month for the Pro plan with up to 1000 total operations and priority processing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which platforms does Prix AI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI currently supports GitHub, with additional platform integrations planned for the future. It works with TypeScript and JavaScript projects.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is AI code review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI achieves high accuracy in bug detection and security vulnerability identification using advanced LLM reasoning and AST analysis to provide reliable, actionable feedback.',
      },
    },
  ],
}

export const jsonLd = [softwareApplicationLd, faqLd]
