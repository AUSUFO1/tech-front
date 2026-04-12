import type {MetadataRoute} from 'next'
import {getMetadataBase} from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getMetadataBase().toString().replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/news-sitemap.xml`],
    host: baseUrl,
  }
}
