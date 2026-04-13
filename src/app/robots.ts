import type {MetadataRoute} from 'next'
import {getMetadataBase} from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const metadataBase = getMetadataBase()
  const baseUrl = metadataBase?.toString().replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: baseUrl ? [`${baseUrl}/sitemap.xml`, `${baseUrl}/news-sitemap.xml`] : [],
    ...(baseUrl ? {host: baseUrl} : {}),
  }
}
