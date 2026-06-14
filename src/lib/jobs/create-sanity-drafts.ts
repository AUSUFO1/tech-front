// src/lib/jobs/create-sanity-drafts.ts
import { createClient } from '@sanity/client'
import type { NormalizedJob } from './fetch-jobs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2026-04-09',
  useCdn: false,
})

const REMOTE_JOBS_CATEGORY_ID = '26bfbb13-6b5b-4fe7-b6ec-c7da941fb2c0'
const MAX_DRAFTS_PER_RUN = 10

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

function mapJobType(type: string): string {
  const lower = type.toLowerCase()
  if (lower.includes('part')) return 'Part-time'
  if (lower.includes('contract')) return 'Contract'
  if (lower.includes('intern')) return 'Internship'
  if (lower.includes('freelance')) return 'Contract'
  return 'Full-time'
}

function getDraftId(sourceId: string): string {
  return `drafts.job-${sourceId}`
}

async function draftExists(sourceId: string): Promise<boolean> {
  const doc = await client.getDocument(getDraftId(sourceId))
  return doc !== undefined
}

async function createDraft(job: NormalizedJob): Promise<void> {
  const titleSlug = slugify(`${job.title}-${job.company}`)
  const draftId = getDraftId(job.sourceId)

  const plainText = job.description
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  const excerpt = plainText.slice(0, 217).replace(/\s+\S*$/, '...') || `${job.title} at ${job.company}. Remote position.`

  const doc = {
    _id: draftId,
    _type: 'job',
    title: `${job.title} — ${job.company}`,
    slug: { _type: 'slug', current: titleSlug },
    company: job.company,
    location: job.location || 'Remote',
    remote: true,
    employmentType: mapJobType(job.jobType),
    category: {
      _type: 'reference',
      _ref: REMOTE_JOBS_CATEGORY_ID,
    },
    excerpt: excerpt.slice(0, 220),
    applicationUrl: job.url,
    publishedAt: new Date(job.publicationDate).toISOString(),
    featured: false,
    views: 0,
    body: htmlToBlocks(job.description),
  }

  await client.createOrReplace(doc)
  console.log(`   [${job.source}] Draft created: ${job.title} @ ${job.company}`)
}

export async function createSanityDrafts(jobs: NormalizedJob[]): Promise<void> {
  console.log(`\n=== Sanity Draft Creator ===`)
  console.log(`Jobs received: ${jobs.length}`)

  if (jobs.length === 0) {
    console.log('No jobs to process.')
    return
  }

  const newJobs: NormalizedJob[] = []
  for (const job of jobs) {
    const exists = await draftExists(job.sourceId)
    if (!exists) {
      newJobs.push(job)
    } else {
      console.log(`   Skipping (already exists): ${job.title} @ ${job.company}`)
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
