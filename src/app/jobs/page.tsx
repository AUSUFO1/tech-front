import type {Metadata} from 'next'
import Link from 'next/link'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {SectionSearchBar} from '@/components/SectionSearchBar'
import {StandardPagination} from '@/components/StandardPagination'
import {getJobsContent, getNewsContent} from '@/lib/content'
import {getCurrentPage, paginateItems} from '@/lib/pagination'
import {buildPageMetadata} from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Jobs | GizPulse',
  description: 'Find fresh tech jobs, remote roles, and hiring updates curated for ambitious readers on GizPulse.',
  pathname: '/jobs',
})

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric'}).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{category?: string; page?: string}>
}) {
  const [latestJobs, {latestNews}] = await Promise.all([getJobsContent(), getNewsContent()])
  const params = (await searchParams) ?? {}
  const category = params.category
  const currentPage = getCurrentPage(params.page)
  const filteredJobs = latestJobs.filter((job) => {
    if (!category) return true
    if (category === 'remote-jobs') return job.remote
    return true
  })
  const paginated = paginateItems(filteredJobs, currentPage)

  const createPageHref = (page: number) => {
    const query = new URLSearchParams()
    if (category) query.set('category', category)
    if (page > 1) query.set('page', String(page))
    const queryString = query.toString()
    return queryString ? `/jobs?${queryString}` : '/jobs'
  }

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-serif text-[3.8rem] font-bold leading-[0.92] tracking-[-0.03em] text-primary-text sm:text-[4.8rem]">
          Jobs
        </h1>
      </section>

      <SectionSearchBar placeholder="Search jobs by title, company, or location..." />

      <section className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="border-t border-border">
          {paginated.items.map((job) => (
            <article key={job._id} className="border-b border-border py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">{job.company}</p>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{job.remote ? 'Remote' : job.location}</p>
              </div>
              <h2 className="mt-3 font-serif text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-primary-text sm:text-[2.2rem]">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                >
                  {job.title}
                </Link>
              </h2>
              <p className="mt-3 line-clamp-2 text-[1rem] leading-7 text-muted-text">{job.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                <CategoryTagLink href="/jobs" label={job.employmentType} />
                <span>{formatDate(job.publishedAt)}</span>
                <span>{formatComments(job.commentCount)}</span>
              </div>
            </article>
          ))}
          <StandardPagination
            summary={`${paginated.startItem}-${paginated.endItem} of ${paginated.totalItems}`}
            currentPage={paginated.page}
            totalPages={paginated.totalPages}
            createPageHref={createPageHref}
          />
        </div>

        <aside className="border border-border px-5 py-6 lg:sticky lg:top-[112px]">
          <h2 className="font-serif text-[1.5rem] font-bold leading-none tracking-[-0.01em] text-primary-green border-l-4 border-primary-green pl-3">Latest News</h2>
          <div className="relative mt-6 pl-6">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-primary-green/45" />
            <div className="flex flex-col gap-5">
              {latestNews.slice(0, 10).map((story) => (
                <article key={story._id} className="relative border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <span className="absolute -left-[21px] top-1 h-[8px] w-[8px] rounded-full bg-primary-green" />
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">{formatDate(story.publishedAt)}</p>
                  <h3 className="mt-2 font-serif text-[1.05rem] font-bold leading-[1.3] tracking-[0] text-primary-text">
                    <Link
                      href={`/news/${story.slug}`}
                      className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                    >
                      {story.title}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

