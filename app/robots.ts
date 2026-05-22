import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.prixai.xyz'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/success',
          '/checkout/cancel',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}