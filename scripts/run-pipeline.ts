// scripts/run-pipeline.ts
import { fetchAllJobs } from './fetch-jobs'
import { createSanityDrafts } from './create-sanity-drafts'

async function main() {
  console.log('=== GizPulse Job Pipeline — Test Run ===\n')

  console.log('--- Step 1: Fetching jobs from all sources ---')
  const jobs = await fetchAllJobs()
  console.log(`Fetched ${jobs.length} recent jobs\n`)

  if (jobs.length === 0) {
    console.log('No jobs within 48hrs. Pipeline complete — nothing to post.')
    return
  }

  console.log('--- Step 2: Creating Sanity drafts ---')
  await createSanityDrafts(jobs)

  console.log('\n=== Pipeline complete ===')
}

main().catch(console.error)
