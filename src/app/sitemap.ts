import type {MetadataRoute} from 'next'
import {getSitemapEntries} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getMetadataBase().toString().replace(/\/$/, '')
  const dynamicEntries = await getSitemapEntries()

  const staticEntries: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/authors',
    '/blog',
    '/earn',
    '/jobs',
    '/news',
    '/newsletter',
    '/opportunities',
    '/privacy',
    '/search',
    '/terms',
    '/accessibility',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  return [
    ...staticEntries,
    ...dynamicEntries.map((entry) => ({
      url: `${baseUrl}${entry.url}`,
      lastModified: new Date(entry.lastModified),
    })),
  ]
}
