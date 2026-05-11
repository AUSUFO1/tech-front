import {getRecentNewsSitemapEntries} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const metadataBase = getMetadataBase()
  const baseUrl = metadataBase?.toString().replace(/\/$/, '')
  const entries = await getRecentNewsSitemapEntries()

  if (!baseUrl) {
    return new Response('', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (entry) => {
      const imageXml = entry.coverImageUrl
        ? `    <image:image>
      <image:loc>${escapeXml(entry.coverImageUrl)}</image:loc>
    </image:image>
`
        : ''

      return `  <url>
    <loc>${escapeXml(`${baseUrl}/news/${entry.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>GizPulse</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${entry.publishedAt}</news:publication_date>
      <news:title>${escapeXml(entry.title)}</news:title>
    </news:news>
${imageXml}    <lastmod>${entry.lastModified}</lastmod>
  </url>`
    }
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
