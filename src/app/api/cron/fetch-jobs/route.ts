// src/app/api/cron/fetch-jobs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchRemotiveJobs } from '../../../../lib/jobs/fetch-jobs'
import { createSanityDrafts } from '../../../../lib/jobs/create-sanity-drafts'

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
    log('Cron started: fetching Remotive jobs')
    const jobs = await fetchRemotiveJobs()
    log(`Fetched ${jobs.length} jobs from Remotive`)

    log('Creating Sanity drafts')
    await createSanityDrafts(jobs)
    log('Drafts created successfully')

    return NextResponse.json({
      success: true,
      jobsFetched: jobs.length,
      logs,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Cron job failed:', message)
    return NextResponse.json({
      success: false,
      error: message,
      logs,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
