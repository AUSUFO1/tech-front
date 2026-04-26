import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {AppImage} from '@/components/AppImage'
import {CoverImageMeta} from '@/components/CoverImageMeta'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {LatestNewsRail} from '@/components/LatestNewsRail'
import {RelatedStoryCard} from '@/components/RelatedStoryCard'
import {SanityBodyContent} from '@/components/SanityBodyContent'
import {ShareActions} from '@/components/ShareActions'
import {StructuredData} from '@/components/StructuredData'
import {ViewTracker} from '@/components/ViewTracker'
import {getJobBySlug, getJobsContent} from '@/lib/content'
import {buildArticleMetadata, buildStructuredData} from '@/lib/seo'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

function formatTime(date?: string) {
  if (!date) return 'No time'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
    timeZoneName: 'short',
  }).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = await getJobBySlug(slug)
  if (!item) return {title: 'Jobs | GizPulse'}
  return buildArticleMetadata({
    title: item.title,
    excerpt: item.excerpt,
    coverImageUrl: item.coverImageUrl,
    publishedAt: item.publishedAt,
    pathname: `/jobs/${slug}`,
    seo: item.seo,
  })
}

export default async function JobDetailPage({params}: Props) {
  const {slug} = await params
  const [job, latestJobs] = await Promise.all([getJobBySlug(slug), getJobsContent()])
  if (!job) notFound()

  const related = latestJobs.filter((item) => item.slug !== job.slug).slice(0, 3)
  const structuredData = buildStructuredData({
    kind: 'job',
    title: job.title,
    description: job.seo?.metaDescription || job.excerpt,
    pathname: `/jobs/${job.slug}`,
    image: job.seo?.ogImageUrl || job.coverImageUrl,
    publishedAt: job.publishedAt,
    organizationName: job.company,
    employmentType: job.employmentType,
    location: job.remote ? 'Remote' : job.location,
  })

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-10">
      <StructuredData data={structuredData} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{job.company}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
            <span>{job.remote ? 'Remote' : job.location}</span>
            <Link href="/jobs" className="text-primary-green hover:opacity-90">
              {job.employmentType}
            </Link>
            <time dateTime={job.publishedAt}>{formatDate(job.publishedAt)}</time>
            <time dateTime={job.publishedAt}>{formatTime(job.publishedAt)}</time>
            <ViewTracker postType="jobs" postSlug={job.slug} initialViews={job.views ?? 0} />
            <span>{formatComments(job.commentCount)}</span>
          </div>

          <AppImage
            src={job.coverImageUrl}
            alt={job.coverImageAlt ?? job.title}
            className="mt-8 h-auto max-h-[42rem] w-full bg-card-background object-contain"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
          />
          <CoverImageMeta
            caption={job.coverImageCaption}
            credit={job.coverImageCredit}
            sourceUrl={job.coverImageSourceUrl}
          />

          <section className="mt-8 grid gap-5 border border-border p-5">
            <h2 className="font-display text-[1.8rem] font-bold tracking-[-0.04em] text-primary-text">Role Overview</h2>
            <p className="text-[1.02rem] leading-8 text-muted-text">{job.excerpt}</p>
            {job.applicationUrl ? (
              <Link
                href={job.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-fit items-center bg-primary-green px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em] !text-white"
              >
                Apply Now
              </Link>
            ) : null}
          </section>

          <SanityBodyContent body={job.body} />

          <ShareActions title={job.title} topics={[job.employmentType, job.remote ? 'Remote' : job.location]} />
          <InlineNewsletter />
          <ArticleComments postType="jobs" postSlug={job.slug} />

          <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Jobs</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <RelatedStoryCard
              key={item._id}
              href={`/jobs/${item.slug}`}
              title={item.title}
              imageUrl={item.coverImageUrl}
              date={item.publishedAt}
            />
          ))}
        </div>
      </section>
        </div>

        <LatestNewsRail />
      </section>
    </main>
  )
}
