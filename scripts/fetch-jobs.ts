// scripts/fetch-jobs.ts
const REMOTIVE_BASE = 'https://remotive.com/api/remote-jobs'
const CATEGORIES = ['software-dev', 'product', 'data']

export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
  tags: string[]
}

function isWithinLast24Hours(dateStr: string): boolean {
  const posted = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - posted.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours <= 24
}

async function fetchJobsForCategory(category: string): Promise<RemotiveJob[]> {
  const url = `${REMOTIVE_BASE}?category=${category}`
  console.log(`Fetching: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${category}: ${res.status}`)
  const data = await res.json()
  return data.jobs as RemotiveJob[]
}

export async function fetchRemotiveJobs(): Promise<RemotiveJob[]> {
  const allJobs: RemotiveJob[] = []

  for (const category of CATEGORIES) {
    const jobs = await fetchJobsForCategory(category)
    console.log(`  ${category}: ${jobs.length} total jobs returned`)
    allJobs.push(...jobs)
  }

  // Deduplicate by job id across categories
  const seen = new Set<number>()
  const unique = allJobs.filter(j => {
    if (seen.has(j.id)) return false
    seen.add(j.id)
    return true
  })

  console.log(`Total fetched: ${allJobs.length} | After dedup: ${unique.length}`)

  const recent = unique.filter(j => isWithinLast24Hours(j.publication_date))
  console.log(`Jobs posted in last 24 hours: ${recent.length}`)

  // If no recent jobs, return most recent 10 for testing
  if (recent.length === 0) {
    console.log('No jobs in last 24hrs — returning 10 most recent for testing')
    return unique
      .sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime())
      .slice(0, 10)
  }

  return recent
}
