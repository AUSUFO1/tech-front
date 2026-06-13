// scripts/run-pipeline.ts
// Test runner — connects fetch-jobs and create-sanity-drafts
import { fetchRemotiveJobs } from './fetch-jobs'
import { createSanityDrafts } from './create-sanity-drafts'

async function main() {
  console.log('=== GizPulse Job Pipeline — Test Run ===\n')

  console.log('--- Step 1: Fetching jobs from Remotive ---')
  const jobs = await fetchRemotiveJobs()
  console.log(`Fetched ${jobs.length} jobs\n`)

  console.log('--- Step 2: Creating Sanity drafts ---')
  await createSanityDrafts(jobs)

  console.log('\n=== Pipeline complete ===')
}

main().catch(console.error)
