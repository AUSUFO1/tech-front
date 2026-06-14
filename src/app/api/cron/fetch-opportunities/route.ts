// src/app/api/cron/fetch-opportunities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchAllOpportunities } from '../../../../lib/jobs/fetch-opportunities'
import { createOpportunityDrafts } from '../../../../lib/jobs/create-opportunity-drafts'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs: string[] = []
  const log = (msg: string) => {
    console.log(msg)
    logs.push(msg)
  }

  try {
    log('Cron started: fetching opportunities')
    const opportunities = await fetchAllOpportunities()
    log(`Fetched ${opportunities.length} recent opportunities within 48hrs`)

    if (opportunities.length === 0) {
      log('No new opportunities within 48hrs — nothing to post today.')
      return NextResponse.json({
        success: true,
        opportunitiesFetched: 0,
        message: 'No new opportunities within 48hrs',
        logs,
        timestamp: new Date().toISOString(),
      })
    }

    log('Creating Sanity drafts')
    await createOpportunityDrafts(opportunities)
    log('Drafts created successfully')

    return NextResponse.json({
      success: true,
      opportunitiesFetched: opportunities.length,
      logs,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Opportunity cron failed:', message)
    return NextResponse.json({
      success: false,
      error: message,
      logs,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
