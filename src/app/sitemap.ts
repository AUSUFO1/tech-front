import type {MetadataRoute} from 'next'
import {getCategorySitemapEntries, getSitemapEntries} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const metadataBase = getMetadataBase()
  const baseUrl = metadataBase?.toString().replace(/\/$/, '')
  const [dynamicEntries, categoryEntries] = await Promise.all([
    getSitemapEntries(),
    getCategorySitemapEntries(),
  ])

  if (!baseUrl) {
    return []
  }

  const staticEntries: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/authors',
    '/blog',
    '/earn',
    '/jobs',
    '/news',
    '/newsletter',
    '/opportunities',
    '/privacy',
    '/terms',
    '/accessibility',
    '/corrections-policy',
    '/editorial-policy',
  ].map((path) => ({
    url: escapeXml(`${baseUrl}${path}`),
    lastModified: new Date(),
  }))

  return [
    ...staticEntries,
    ...dynamicEntries.map((entry) => ({
      url: escapeXml(`${baseUrl}${entry.url}`),
      lastModified: new Date(entry.lastModified),
      ...(entry.images?.length ? {images: entry.images.map(escapeXml)} : {}),
    })),
    ...categoryEntries.map((entry) => ({
      url: escapeXml(`${baseUrl}${entry.url}`),
      lastModified: new Date(entry.lastModified),
    })),
  ]
}
