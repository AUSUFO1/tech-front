// scripts/create-sanity-drafts.ts
import { createClient } from '@sanity/client'
import * as fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const lines = env.split('\n')
const getEnv = (key: string) => lines.find(l => l.startsWith(key + '='))?.split('=')[1]?.trim() ?? ''

const client = createClient({
  projectId: getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: getEnv('NEXT_PUBLIC_SANITY_DATASET'),
  token: getEnv('SANITY_API_TOKEN'),
  apiVersion: '2026-04-09',
  useCdn: false,
})

const REMOTE_JOBS_CATEGORY_ID = '26bfbb13-6b5b-4fe7-b6ec-c7da941fb2c0'
const MAX_DRAFTS_PER_RUN = 10

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

function htmlToBlocks(html: string) {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)

  return paragraphs.map(para => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 9),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).slice(2, 9),
        text: para.trim(),
        marks: [],
      },
    ],
  }))
}

function mapJobType(remotive: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Contract',
  }
  return map[remotive] ?? 'Full-time'
}

function getDraftId(jobId: number): string {
  return `drafts.job-remotive-${jobId}`
}

async function draftExists(jobId: number): Promise<boolean> {
  const doc = await client.getDocument(getDraftId(jobId))
  return doc !== undefined
}

async function createDraft(job: RemotiveJob): Promise<void> {
  const titleSlug = slugify(`${job.title}-${job.company_name}`)
  const draftId = getDraftId(job.id)

  const plainText = job.description
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  const excerpt = plainText.slice(0, 217).replace(/\s+\S*$/, '...')

  const doc = {
    _id: draftId,
    _type: 'job',
    title: `${job.title} — ${job.company_name}`,
    slug: { _type: 'slug', current: titleSlug },
    company: job.company_name,
    location: job.candidate_required_location || 'Remote',
    remote: true,
    employmentType: mapJobType(job.job_type),
    category: {
      _type: 'reference',
      _ref: REMOTE_JOBS_CATEGORY_ID,
    },
    excerpt: excerpt.slice(0, 220),
    applicationUrl: job.url,
    publishedAt: new Date(job.publication_date).toISOString(),
    featured: false,
    views: 0,
    body: htmlToBlocks(job.description),
  }

  await client.createOrReplace(doc)
  console.log(`   Draft created: ${job.title} @ ${job.company_name}`)
}

export async function createSanityDrafts(jobs: RemotiveJob[]): Promise<void> {
  console.log(`\n=== Sanity Draft Creator ===`)
  console.log(`Jobs received: ${jobs.length}`)

  // Check each job individually by draft ID
  const newJobs: RemotiveJob[] = []
  for (const job of jobs) {
    const exists = await draftExists(job.id)
    if (!exists) {
      newJobs.push(job)
    } else {
      console.log(`   Skipping (already exists): ${job.title} @ ${job.company_name}`)
    }
  }

  console.log(`New jobs after dedup: ${newJobs.length}`)

  if (newJobs.length === 0) {
    console.log('No new jobs to create.')
    return
  }

  const toCreate = newJobs.slice(0, MAX_DRAFTS_PER_RUN)
  console.log(`Creating ${toCreate.length} drafts (max ${MAX_DRAFTS_PER_RUN} per run)\n`)

  for (const job of toCreate) {
    await createDraft(job)
  }

  console.log(`\n=== Done: ${toCreate.length} drafts created ===`)
}
