// scripts/fetch-jobs.ts

const HOURS_LIMIT = 48

export interface NormalizedJob {
  sourceId: string
  source: 'remotive' | 'jobicy' | 'remoteok'
  url: string
  title: string
  company: string
  jobType: string
  publicationDate: string
  location: string
  salary: string
  description: string
  tags: string[]
}

function isWithin48Hours(dateStr: string): boolean {
  const posted = new Date(dateStr)
  const now = new Date()
  const diffHours = (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
  return diffHours <= HOURS_LIMIT
}

function deduplicateByKey<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>()
  return items.filter(item => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

async function fetchRemotive(): Promise<NormalizedJob[]> {
  const CATEGORIES = ['software-dev', 'product', 'data']
  const all: NormalizedJob[] = []
  for (const category of CATEGORIES) {
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${category}`)
      if (!res.ok) { console.log(`  Remotive ${category}: failed ${res.status}`); continue }
      const data = await res.json()
      const jobs = data.jobs || []
      for (const j of jobs) {
        all.push({
          sourceId: `remotive-${j.id}`,
          source: 'remotive',
          url: j.url,
          title: j.title,
          company: j.company_name,
          jobType: j.job_type,
          publicationDate: j.publication_date,
          location: j.candidate_required_location || 'Remote',
          salary: j.salary || '',
          description: j.description || '',
          tags: j.tags || [],
        })
      }
      console.log(`  Remotive ${category}: ${jobs.length} jobs`)
    } catch (e) {
      console.log(`  Remotive ${category}: error — ${e}`)
    }
  }
  return all
}

async function fetchJobicy(): Promise<NormalizedJob[]> {
  const TAGS = ['engineer', 'developer', 'product', 'data', 'design']
  const all: NormalizedJob[] = []
  for (const tag of TAGS) {
    try {
      const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=10&tag=${tag}`)
      if (!res.ok) { console.log(`  Jobicy ${tag}: failed ${res.status}`); continue }
      const data = await res.json()
      const jobs = data.jobs || []
      for (const j of jobs) {
        all.push({
          sourceId: `jobicy-${j.id}`,
          source: 'jobicy',
          url: j.url,
          title: j.jobTitle,
          company: j.companyName,
          jobType: j.jobType?.[0] || 'Full-Time',
          publicationDate: j.pubDate,
          location: j.jobGeo || 'Remote',
          salary: j.salaryMin ? `${j.salaryCurrency || 'USD'} ${j.salaryMin.toLocaleString()}${j.salaryMax ? ` - ${j.salaryMax.toLocaleString()}` : ''}` : '',
          description: j.jobDescription || '',
          tags: j.jobIndustry || [],
        })
      }
      console.log(`  Jobicy ${tag}: ${jobs.length} jobs`)
    } catch (e) {
      console.log(`  Jobicy ${tag}: error — ${e}`)
    }
  }
  return all
}

async function fetchRemoteOK(): Promise<NormalizedJob[]> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'GizPulse/1.0' }
    })
    if (!res.ok) { console.log(`  RemoteOK: failed ${res.status}`); return [] }
    const data = await res.json()
    const jobs = (data as any[]).filter(j => j.id && j.position)
    console.log(`  RemoteOK: ${jobs.length} jobs`)
    return jobs.map(j => ({
      sourceId: `remoteok-${j.id}`,
      source: 'remoteok' as const,
      url: j.url || `https://remoteok.com/remote-jobs/${j.slug}`,
      title: j.position,
      company: j.company,
      jobType: 'Full-Time',
      publicationDate: j.date,
      location: j.location || 'Remote',
      salary: j.salary_min ? `USD ${j.salary_min.toLocaleString()}${j.salary_max ? ` - ${j.salary_max.toLocaleString()}` : ''}` : '',
      description: j.description || '',
      tags: j.tags || [],
    }))
  } catch (e) {
    console.log(`  RemoteOK: error — ${e}`)
    return []
  }
}

export async function fetchAllJobs(): Promise<NormalizedJob[]> {
  console.log('=== Fetching jobs from all sources ===\n')

  const [remotive, jobicy, remoteok] = await Promise.all([
    fetchRemotive(),
    fetchJobicy(),
    fetchRemoteOK(),
  ])

  const combined = [...remotive, ...jobicy, ...remoteok]
  console.log(`\nTotal combined: ${combined.length}`)

  const unique = deduplicateByKey(combined, j => j.sourceId)
  console.log(`After dedup by sourceId: ${unique.length}`)

  const recent = unique.filter(j => isWithin48Hours(j.publicationDate))
  console.log(`Within 48 hours: ${recent.length}`)

  if (recent.length === 0) {
    console.log('No jobs within 48hrs — nothing to post today.')
    return []
  }

  return recent
}
