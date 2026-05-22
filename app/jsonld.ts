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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '342',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '342',
  },
}

export const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AI code review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI code review uses machine learning models to automatically analyze pull requests, detect bugs, security issues, and suggest improvements before code is merged. Prix AI connects to your GitHub repository and reviews every PR within seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does automated code review work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI connects to your GitHub repository, analyzes each pull request using advanced language models trained on millions of codebases, and posts review comments with actionable suggestions and auto-generated fixes. No configuration needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI review GitHub pull requests?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prix AI integrates directly with GitHub and automatically reviews every pull request, providing feedback within seconds. It detects bugs, security vulnerabilities, logic errors, and performance issues.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is AI code review reliable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Modern AI code review achieves 85-95% accuracy on common bug patterns and security vulnerabilities. It complements, not replaces, human reviewers by catching issues humans might miss.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Prix AI free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Prix AI offers a free plan with 15 PR reviews per month (5 per day), 3 issue plans, and 3 auto fixes for public repositories. Paid plans start at $6.99/month for the Starter plan with 400 reviews and 50 issue plans, and $9.99/month for the Pro plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the benefits of AI code review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Faster reviews (80% reduction in review time), consistent quality across all PRs, catching bugs humans miss, reducing review bottlenecks, and freeing senior developers for complex architectural problems.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does AI code review catch security vulnerabilities?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prix AI detects SQL injection, XSS, hardcoded secrets, insecure dependencies, command injection, and OWASP Top 10 vulnerabilities before they reach production.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI code review generate fixes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prix AI not only identifies issues but generates ready-to-apply code fixes. Type !prix fix in any PR comment to automatically generate and apply patches.',
      },
    },
    {
      '@type': 'Question',
      name: 'What languages does AI code review support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI supports TypeScript, JavaScript, Python, Go, Rust, Java, Ruby, PHP, and more. It works with all major programming languages and frameworks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is AI code review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI achieves 85-95% accuracy on common bug patterns. Accuracy improves with usage as the model learns your codebase patterns and team conventions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does AI code review work with private repos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prix AI supports both public and private GitHub repositories. Private repo support is available on paid plans (Starter and Pro).',
      },
    },
    {
      '@type': 'Question',
      name: 'How to set up AI code review on GitHub?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install the Prix AI GitHub app from the GitHub Marketplace, authorize your repositories, and it starts reviewing PRs automatically. No configuration or setup needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between AI code review and linting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Linting checks syntax and style rules. AI code review understands logic, security vulnerabilities, architecture patterns, and business context. It catches issues that rules-based tools miss.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does AI code review slow down development?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Reviews happen asynchronously within seconds of PR creation. Developers get feedback without blocking their workflow, and average review time is under 50 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which platforms does Prix AI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prix AI currently supports GitHub, with additional platform integrations planned for the future. It works with TypeScript, JavaScript, Python, and many other languages.',
      },
    },
  ],
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prix AI',
  url: 'https://www.prixai.xyz',
  logo: 'https://www.prixai.xyz/logo.png',
  sameAs: [
    'https://x.com/prix_ai',
    'https://www.linkedin.com/company/eurion-ai/',
  ],
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Prix AI',
  url: 'https://www.prixai.xyz',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.prixai.xyz/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export const jsonLd = [softwareApplicationLd, faqLd, organizationLd, websiteLd]
