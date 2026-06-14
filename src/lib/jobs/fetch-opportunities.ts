// src/lib/jobs/fetch-opportunities.ts

const HOURS_LIMIT = 48

export interface NormalizedOpportunity {
  sourceId: string
  source: 'opportunitiescorners'
  url: string
  title: string
  organization: string
  publicationDate: string
  deadline: string | null
  location: string
  opportunityType: 'Scholarship' | 'Fellowship' | 'Bootcamp' | 'Accelerator' | 'Training' | 'Grant' | 'NYSC'
  excerpt: string
  description: string
}

function isWithin48Hours(dateStr: string): boolean {
  const posted = new Date(dateStr)
  const now = new Date()
  const diffHours = (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
  return diffHours <= HOURS_LIMIT
}

function str(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

function extractOrganization(title: string): string {
  return title
    .replace(/\s*(scholarship|fellowship|program|traineeship|internship|bootcamp|grant|award|prize|accelerator|training|\d{4}.*$)/gi, '')
    .trim() || title
}

function extractDeadline(html: string): string | null {
  const match = html.match(/[Dd]eadline[:\s]+([A-Za-z0-9\s,\/]+(?:202[4-9]|203\d))/i)
  if (!match) return null
  const parsed = new Date(match[1].trim())
  return isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function detectOpportunityType(title: string, content: string): NormalizedOpportunity['opportunityType'] {
  const text = (title + ' ' + content).toLowerCase()
  if (text.includes('scholarship')) return 'Scholarship'
  if (text.includes('fellowship')) return 'Fellowship'
  if (text.includes('bootcamp')) return 'Bootcamp'
  if (text.includes('accelerator')) return 'Accelerator'
  if (text.includes('grant')) return 'Grant'
  if (text.includes('nysc')) return 'NYSC'
  return 'Training'
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#[0-9]+;/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

interface WPPost {
  id: number
  date: string
  link: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
}

async function fetchOpportunitiesCorners(): Promise<NormalizedOpportunity[]> {
  try {
    const res = await fetch(
      'https://opportunitiescorners.info/wp-json/wp/v2/posts?per_page=20&_fields=id,title,date,link,excerpt,content'
    )
    if (!res.ok) { console.log(`OpportunitiesCorners: failed ${res.status}`); return [] }
    const posts: WPPost[] = await res.json()
    console.log(`  OpportunitiesCorners: ${posts.length} posts`)

    return posts.map((p) => {
      const title = stripHtml(str(p.title?.rendered))
      const contentHtml = str(p.content?.rendered)
      const excerptRaw = stripHtml(str(p.excerpt?.rendered)).slice(0, 217).replace(/\s+\S*$/, '...')

      return {
        sourceId: `oppcorners-${p.id}`,
        source: 'opportunitiescorners' as const,
        url: str(p.link),
        title,
        organization: extractOrganization(title),
        publicationDate: str(p.date),
        deadline: extractDeadline(contentHtml),
        location: 'Worldwide',
        opportunityType: detectOpportunityType(title, contentHtml),
        excerpt: excerptRaw,
        description: contentHtml,
      }
    })
  } catch (e) {
    console.log(`  OpportunitiesCorners: error — ${e}`)
    return []
  }
}

export async function fetchAllOpportunities(): Promise<NormalizedOpportunity[]> {
  console.log('=== Fetching opportunities from all sources ===\n')

  const results = await fetchOpportunitiesCorners()

  const recent = results.filter(o => isWithin48Hours(o.publicationDate))
  console.log(`Total fetched: ${results.length} | Within 48hrs: ${recent.length}`)

  if (recent.length === 0) {
    console.log('No opportunities within 48hrs — nothing to post today.')
    return []
  }

  return recent
}
