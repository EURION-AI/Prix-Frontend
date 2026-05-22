'use client'

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  authorName = 'Prix Team',
}: {
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedTime: string
  modifiedTime?: string
  authorName?: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: publishedTime,
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://www.prixai.xyz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prix AI',
      url: 'https://www.prixai.xyz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.prixai.xyz/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://www.prixai.xyz${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FaqJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string
  description: string
  steps: { title: string; text: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
