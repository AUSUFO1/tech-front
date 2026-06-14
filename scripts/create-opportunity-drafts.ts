// scripts/create-opportunity-drafts.ts
import { createClient } from '@sanity/client'
import * as fs from 'fs'
import type { NormalizedOpportunity } from './fetch-opportunities'

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

const SCHOLARSHIPS_CATEGORY_ID = '2cb15c89-6964-4e0b-acb0-fd9176a62be7'
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
    .replace(/&#[0-9]+;/g, '')
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

function getDraftId(sourceId: string): string {
  return `drafts.opportunity-${sourceId}`
}

async function draftExists(sourceId: string): Promise<boolean> {
  const doc = await client.getDocument(getDraftId(sourceId))
  return doc !== undefined
}

async function createDraft(opp: NormalizedOpportunity): Promise<void> {
  const draftId = getDraftId(opp.sourceId)
  const titleSlug = slugify(opp.title)

  const doc: Record<string, unknown> = {
    _id: draftId,
    _type: 'opportunity',
    title: opp.title,
    slug: { _type: 'slug', current: titleSlug },
    organization: opp.organization,
    location: opp.location,
    opportunityType: opp.opportunityType,
    category: {
      _type: 'reference',
      _ref: SCHOLARSHIPS_CATEGORY_ID,
    },
    applicationUrl: opp.url,
    excerpt: opp.excerpt.slice(0, 220),
    featured: false,
    views: 0,
    body: htmlToBlocks(opp.description),
  }

  if (opp.deadline) {
    doc.deadline = opp.deadline
  }

  await client.createOrReplace(doc)
  console.log(`   [${opp.source}] Draft created: ${opp.title}`)
}

export async function createOpportunityDrafts(opportunities: NormalizedOpportunity[]): Promise<void> {
  console.log(`\n=== Opportunity Draft Creator ===`)
  console.log(`Opportunities received: ${opportunities.length}`)

  if (opportunities.length === 0) {
    console.log('No opportunities to process.')
    return
  }

  const newOpps: NormalizedOpportunity[] = []
  for (const opp of opportunities) {
    const exists = await draftExists(opp.sourceId)
    if (!exists) {
      newOpps.push(opp)
    } else {
      console.log(`   Skipping (already exists): ${opp.title}`)
    }
  }

  console.log(`New opportunities after dedup: ${newOpps.length}`)

  if (newOpps.length === 0) {
    console.log('No new opportunities to create.')
    return
  }

  const toCreate = newOpps.slice(0, MAX_DRAFTS_PER_RUN)
  console.log(`Creating ${toCreate.length} drafts (max ${MAX_DRAFTS_PER_RUN} per run)\n`)

  for (const opp of toCreate) {
    await createDraft(opp)
  }

  console.log(`\n=== Done: ${toCreate.length} opportunity drafts created ===`)
}
