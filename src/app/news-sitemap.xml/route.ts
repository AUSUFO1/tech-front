import {getRecentNewsSitemapEntries} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = getMetadataBase().toString().replace(/\/$/, '')
  const entries = await getRecentNewsSitemapEntries()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${baseUrl}/news/${escapeXml(entry.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>Techfront</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${entry.publishedAt}</news:publication_date>
      <news:title>${escapeXml(entry.title)}</news:title>
    </news:news>
    <lastmod>${entry.lastModified}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
