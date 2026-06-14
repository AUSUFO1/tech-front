// src/lib/jobs/fetch-jobs.ts

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

function str(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

function strArr(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string') : []
}

async function fetchRemotive(): Promise<NormalizedJob[]> {
  const CATEGORIES = ['software-dev', 'product', 'data']
  const all: NormalizedJob[] = []
  for (const category of CATEGORIES) {
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${category}`)
      if (!res.ok) { console.log(`  Remotive ${category}: failed ${res.status}`); continue }
      const data = await res.json()
      const jobs: unknown[] = Array.isArray(data.jobs) ? data.jobs : []
      for (const j of jobs) {
        const job = j as Record<string, unknown>
        all.push({
          sourceId: `remotive-${job.id}`,
          source: 'remotive',
          url: str(job.url),
          title: str(job.title),
          company: str(job.company_name),
          jobType: str(job.job_type),
          publicationDate: str(job.publication_date),
          location: str(job.candidate_required_location) || 'Remote',
          salary: str(job.salary),
          description: str(job.description),
          tags: strArr(job.tags),
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
      const jobs: unknown[] = Array.isArray(data.jobs) ? data.jobs : []
      for (const j of jobs) {
        const job = j as Record<string, unknown>
        const salaryMin = typeof job.salaryMin === 'number' ? job.salaryMin : 0
        const salaryMax = typeof job.salaryMax === 'number' ? job.salaryMax : 0
        const currency = str(job.salaryCurrency) || 'USD'
        const salary = salaryMin > 0 ? `${currency} ${salaryMin.toLocaleString()}${salaryMax > 0 ? ` - ${salaryMax.toLocaleString()}` : ''}` : ''
        const jobTypeArr = Array.isArray(job.jobType) ? job.jobType : []
        all.push({
          sourceId: `jobicy-${job.id}`,
          source: 'jobicy',
          url: str(job.url),
          title: str(job.jobTitle),
          company: str(job.companyName),
          jobType: typeof jobTypeArr[0] === 'string' ? jobTypeArr[0] : 'Full-Time',
          publicationDate: str(job.pubDate),
          location: str(job.jobGeo) || 'Remote',
          salary,
          description: str(job.jobDescription),
          tags: strArr(job.jobIndustry),
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
    const data: unknown[] = await res.json()
    const jobs = Array.isArray(data) ? data.filter(j => {
      const job = j as Record<string, unknown>
      return job.id && job.position
    }) : []
    console.log(`  RemoteOK: ${jobs.length} jobs`)
    return jobs.map(j => {
      const job = j as Record<string, unknown>
      const salaryMin = typeof job.salary_min === 'number' ? job.salary_min : 0
      const salaryMax = typeof job.salary_max === 'number' ? job.salary_max : 0
      const salary = salaryMin > 0 ? `USD ${salaryMin.toLocaleString()}${salaryMax > 0 ? ` - ${salaryMax.toLocaleString()}` : ''}` : ''
      return {
        sourceId: `remoteok-${job.id}`,
        source: 'remoteok' as const,
        url: str(job.url) || `https://remoteok.com/remote-jobs/${str(job.slug)}`,
        title: str(job.position),
        company: str(job.company),
        jobType: 'Full-Time',
        publicationDate: str(job.date),
        location: str(job.location) || 'Remote',
        salary,
        description: str(job.description),
        tags: strArr(job.tags),
      }
    })
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
