// scripts/run-opportunity-pipeline.ts
import { fetchAllOpportunities } from './fetch-opportunities'
import { createOpportunityDrafts } from './create-opportunity-drafts'

async function main() {
  console.log('=== GizPulse Opportunity Pipeline — Test Run ===\n')

  console.log('--- Step 1: Fetching opportunities ---')
  const opportunities = await fetchAllOpportunities()
  console.log(`Fetched ${opportunities.length} recent opportunities\n`)

  if (opportunities.length === 0) {
    console.log('No opportunities within 48hrs. Pipeline complete — nothing to post.')
    return
  }

  console.log('--- Step 2: Creating Sanity drafts ---')
  await createOpportunityDrafts(opportunities)

  console.log('\n=== Pipeline complete ===')
}

main().catch(console.error)
