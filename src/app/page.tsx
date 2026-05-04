import type {Metadata} from 'next'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {HomeNewsletterSignup} from '@/components/HomeNewsletterSignup'
import {getHomepageContent, type JobContentItem} from '@/lib/content'
import {isEarnCategory} from '@/lib/content-sections'
import {type BlogItem, type FeaturedNewsItem, type JobItem, type OpportunityItem, type QuickLink} from '@/lib/content-types'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'

const homepageTitle = 'GizPulse | Tech News, Jobs, Opportunities and Career Growth'
const homepageDescription =
  'GizPulse covers tech news, jobs, scholarships, opportunities, guides, and practical career growth insights for ambitious readers worldwide.'

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: '/',
    type: 'website',
    siteName: 'GizPulse',
    images: [
      {
        url: '/images/gizpulse-og-home.jpeg',
        width: 1200,
        height: 630,
        alt: 'GizPulse homepage preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: homepageTitle,
    description: homepageDescription,
    images: ['/images/gizpulse-og-home.jpeg'],
  },
}

function formatDate(date?: string) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function formatViews(views?: number) {
  return `${(views ?? 0).toLocaleString()} views`
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

function getCategoryHref(link: QuickLink) {
  return getQuickLinkHref(link.slug, link.contentType)
}

type TopUpdateItem = {
  _id: string
  title: string
  href: string
  label: 'News' | 'Blog' | 'Earn' | 'Jobs' | 'Opportunity'
  date?: string
  views: number
  timestamp: number
}

function getTimestamp(date?: string) {
  const parsed = date ? new Date(date).getTime() : Number.NaN
  return Number.isFinite(parsed) ? parsed : 0
}

function getSectionGridClass(count: number) {
  if (count <= 1) return 'grid gap-6 md:max-w-[32rem]'
  if (count === 2) return 'grid gap-6 md:grid-cols-2'
  return 'grid gap-6 md:grid-cols-3'
}

type SectionHeaderProps = {
  title: string
  href: string
}

type TopFeatureItem = {
  item: FeaturedNewsItem | BlogItem
  hrefBase: '/news' | '/blog'
}

function SectionHeader({title, href}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-display text-[1.9rem] font-bold tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
        {title}
      </h2>
      <Link
        href={href}
        className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary-text transition-colors hover:text-primary-green"
      >
        Show All
      </Link>
    </div>
  )
}

function EditorialCard({
  item,
  hrefBase,
  priority = false,
}: {
  item: FeaturedNewsItem | BlogItem
  hrefBase: '/news' | '/blog'
  priority?: boolean
}) {
  return (
    <article className="bg-card-background pb-2">
      <Link href={`${hrefBase}/${item.slug}`} className="block overflow-hidden">
        <AppImage
          src={item.coverImageUrl}
          alt={item.title}
          className="aspect-[4/3] w-full bg-card-background object-contain md:h-[220px] md:aspect-auto md:object-contain"
          width={1200}
          height={780}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 520px"
          priority={priority}
        />
      </Link>
      <h3 className="mt-5 font-display text-[1.7rem] font-bold leading-[1.04] tracking-[-0.05em] text-primary-text">
        <Link
          href={`${hrefBase}/${item.slug}`}
          className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
        >
          {item.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-[0.98rem] leading-7 text-muted-text">{item.excerpt}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
        <CategoryTagLink
          href={item.categorySlug ? getQuickLinkHref(item.categorySlug, hrefBase === '/news' ? 'news' : 'blog') : getCategoryHrefFromLabel(item.categoryTitle, hrefBase === '/news' ? 'news' : 'blog')}
          label={item.categoryTitle}
          className="inline-flex rounded-[5px] bg-primary-green px-2.5 py-1 text-white transition-opacity hover:opacity-90"
        />
        <span>Published by {item.authorName}</span>
        <span>{formatDate(item.publishedAt)}</span>
        <span>{formatViews(item.views)}</span>
        <span>{formatComments(item.commentCount)}</span>
      </div>
    </article>
  )
}

function DesktopLeadCard({item, hrefBase}: TopFeatureItem) {
  return (
    <article className="flex h-full flex-col bg-card-background">
      <Link href={`${hrefBase}/${item.slug}`} className="block overflow-hidden">
        <AppImage
          src={item.coverImageUrl}
          alt={item.title}
          className="aspect-[16/10] w-full bg-card-background object-contain"
          width={1600}
          height={1000}
          sizes="(min-width: 1280px) 640px, 100vw"
          priority
        />
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="font-display text-[2.35rem] font-bold leading-[0.98] tracking-[-0.06em] text-primary-text">
          <Link
            href={`${hrefBase}/${item.slug}`}
            className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
          >
            {item.title}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 max-w-3xl text-[1.02rem] leading-8 text-muted-text">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
          <CategoryTagLink
            href={item.categorySlug ? getQuickLinkHref(item.categorySlug, hrefBase === '/news' ? 'news' : 'blog') : getCategoryHrefFromLabel(item.categoryTitle, hrefBase === '/news' ? 'news' : 'blog')}
            label={item.categoryTitle}
            className="inline-flex rounded-[5px] bg-primary-green px-2.5 py-1 text-white transition-opacity hover:opacity-90"
          />
          <span>Published by {item.authorName}</span>
          <span>{formatDate(item.publishedAt)}</span>
          <span>{formatViews(item.views)}</span>
          <span>{formatComments(item.commentCount)}</span>
        </div>
      </div>
    </article>
  )
}

function DesktopSupportingCard({item, hrefBase}: TopFeatureItem) {
  return (
    <article className="flex h-full flex-col bg-card-background">
      <Link href={`${hrefBase}/${item.slug}`} className="block overflow-hidden">
        <AppImage
          src={item.coverImageUrl}
          alt={item.title}
          className="aspect-[16/10] w-full bg-card-background object-contain"
          width={1200}
          height={780}
          sizes="(min-width: 1280px) 320px, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-display text-[1.4rem] font-bold leading-[1.04] tracking-[-0.05em] text-primary-text">
          <Link
            href={`${hrefBase}/${item.slug}`}
            className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
          >
            {item.title}
          </Link>
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted-text">
          <CategoryTagLink
            href={item.categorySlug ? getQuickLinkHref(item.categorySlug, hrefBase === '/news' ? 'news' : 'blog') : getCategoryHrefFromLabel(item.categoryTitle, hrefBase === '/news' ? 'news' : 'blog')}
            label={item.categoryTitle}
            className="inline-flex rounded-[5px] bg-primary-green px-2 py-1 text-white transition-opacity hover:opacity-90"
          />
          <span>{formatDate(item.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}

function HomeJobSpotlight({item}: {item: JobContentItem}) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-border bg-card-background">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.24fr)_minmax(320px,0.88fr)]">
        <Link href={`/jobs/${item.slug}`} className="group relative block overflow-hidden bg-[#06101c]">
          <AppImage
            src={item.coverImageUrl}
            alt={item.coverImageAlt || item.title}
            className="h-full w-full bg-[#06101c] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            width={1400}
            height={1000}
            sizes="(max-width: 1279px) 100vw, 760px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/88 via-[#07111f]/42 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-green">Jobs Spotlight</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/78">
              <span>{item.company}</span>
              <span>{formatDate(item.publishedAt)}</span>
              <span>{formatViews(item.views)}</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col justify-between bg-card-background px-7 py-7">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">
              <CategoryTagLink
                href={item.categorySlug ? getQuickLinkHref(item.categorySlug, 'jobs') : '/jobs'}
                label={item.categoryTitle ?? item.employmentType}
              />
            </div>
            <h3 className="mt-5 font-display text-[1.85rem] font-bold leading-[1] tracking-[-0.06em] text-primary-text">
              <Link
                href={`/jobs/${item.slug}`}
                className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
              >
                {item.title}
              </Link>
            </h3>
            <p className="mt-4 text-[0.92rem] leading-7 text-muted-text">{item.remote ? 'Remote' : item.location}</p>
          </div>

          <div className="mt-7 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/jobs/${item.slug}`}
                className="inline-flex items-center rounded-full bg-primary-green px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              >
                View Job
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                <span>{formatDate(item.publishedAt)}</span>
                <span>{formatViews(item.views)}</span>
                <span>{formatComments(item.commentCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function JobPreview({item}: {item: JobItem}) {
  return (
    <article className="border-b border-border bg-card-background pb-5 pt-4 sm:pt-5">
      <div>
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">{item.company}</p>
        <h3 className="mt-3 font-display text-[1.55rem] font-bold leading-[1.06] tracking-[-0.05em] text-primary-text">
          <Link
            href={`/jobs/${item.slug}`}
            className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
          >
            {item.title}
          </Link>
        </h3>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">
        <CategoryTagLink href="/jobs" label={item.employmentType} />
        {item.remote ? <span>Remote</span> : null}
      </div>
      <p className="mt-4 text-[1rem] leading-7 text-muted-text">{item.location}</p>
      <p className="mt-4 line-clamp-3 text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
        <span>{formatDate(item.publishedAt)}</span>
        <span>{formatViews(item.views)}</span>
        <span>{formatComments(item.commentCount)}</span>
      </div>
    </article>
  )
}

function OpportunityPreview({item}: {item: OpportunityItem}) {
  return (
    <article className="border-b border-border bg-card-background pb-5 pt-4 sm:pt-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">{item.organization}</p>
          <h3 className="mt-3 font-display text-[1.55rem] font-bold leading-[1.06] tracking-[-0.05em] text-primary-text">
            <Link
              href={`/opportunities/${item.slug}`}
              className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
            >
              {item.title}
            </Link>
          </h3>
        </div>
        <div className="text-right text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-green">
          <p>Deadline</p>
          <p className="mt-2 text-primary-text">{formatDate(item.deadline)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">
        <CategoryTagLink
          href={item.categorySlug ? getQuickLinkHref(item.categorySlug, 'opportunities') : getCategoryHrefFromLabel(item.opportunityType, 'opportunities')}
          label={item.categoryTitle ?? item.opportunityType}
        />
        <span>{item.location}</span>
      </div>
      <p className="mt-4 line-clamp-3 text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
        <span>{formatViews(item.views)}</span>
        <span>{formatComments(item.commentCount)}</span>
      </div>
    </article>
  )
}

export default async function Home() {
  const {featuredNews, latestBlog, latestJobs, latestNews, latestOpportunities, quickLinks} = await getHomepageContent()
  const homeBlog = latestBlog.filter((post) => !isEarnCategory(post.categoryTitle)).slice(0, 6)
  const homeEarn = latestBlog.filter((post) => isEarnCategory(post.categoryTitle)).slice(0, 6)
  const featuredStoryIds = new Set(featuredNews.slice(0, 4).map((story) => story._id))
  const topUpdatePools: Record<'News' | 'Blog' | 'Earn' | 'Jobs' | 'Opportunity', TopUpdateItem[]> = {
    News: latestNews
      .filter((story) => !featuredStoryIds.has(story._id))
      .map((story) => ({
        _id: story._id,
        title: story.title,
        href: `/news/${story.slug}`,
        label: 'News',
        date: story.publishedAt,
        views: story.views,
        timestamp: getTimestamp(story.publishedAt),
      })),
    Blog: homeBlog.map((post) => ({
      _id: post._id,
      title: post.title,
      href: `/blog/${post.slug}`,
      label: 'Blog',
      date: post.publishedAt,
      views: post.views,
      timestamp: getTimestamp(post.publishedAt),
    })),
    Earn: homeEarn.map((post) => ({
      _id: post._id,
      title: post.title,
      href: `/earn/${post.slug}`,
      label: 'Earn',
      date: post.publishedAt,
      views: post.views,
      timestamp: getTimestamp(post.publishedAt),
    })),
    Jobs: latestJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      href: `/jobs/${job.slug}`,
      label: 'Jobs',
      date: job.publishedAt,
      views: job.views,
      timestamp: getTimestamp(job.publishedAt),
    })),
    Opportunity: latestOpportunities.map((item) => ({
      _id: item._id,
      title: item.title,
      href: `/opportunities/${item.slug}`,
      label: 'Opportunity',
      date: item.publishedAt,
      views: item.views,
      timestamp: getTimestamp(item.publishedAt),
    })),
  }
  const guaranteedTopUpdates = Object.values(topUpdatePools)
    .map((items) => items[0])
    .filter((item): item is TopUpdateItem => Boolean(item))
  const guaranteedIds = new Set(guaranteedTopUpdates.map((item) => item._id))
  const topUpdates = [
    ...guaranteedTopUpdates,
    ...Object.values(topUpdatePools)
      .flatMap((items) => items.slice(1))
      .filter((item) => !guaranteedIds.has(item._id))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, Math.max(0, 6 - guaranteedTopUpdates.length)),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)
  const moreLatestNews = latestNews.filter((story) => !featuredStoryIds.has(story._id)).slice(0, 6)
  const homeJobs = latestJobs.slice(0, 3)
  const homeOpportunities = latestOpportunities.slice(0, 3)
  const spotlightJob = latestJobs[0]
  const desktopLeadItem = featuredNews[0]
  const desktopStackItems = featuredNews.slice(1, 3)
  const desktopSupportingItems: TopFeatureItem[] = [
    ...featuredNews.slice(3, 6).map((item) => ({item, hrefBase: '/news' as const})),
    ...homeBlog.slice(0, 3).map((item) => ({item, hrefBase: '/blog' as const})),
  ].slice(0, 3)

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-5 py-6 sm:px-8 lg:px-16 lg:gap-14 lg:py-8">
      <section className="sr-only">
        <h1>GizPulse: Tech News, Jobs, Opportunities and Career Growth</h1>
        <p>
          GizPulse covers tech news, jobs, scholarships, opportunities, guides, and practical career growth insights for
          ambitious readers worldwide.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <h2 className="shrink-0 font-display text-[1.3rem] font-bold tracking-[-0.04em] text-primary-text sm:text-[1.45rem]">
            Quick Links
          </h2>
          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none lg:overflow-visible">
            <div className="flex min-w-max gap-3 pr-5 lg:min-w-0 lg:w-full lg:flex-wrap lg:pr-0">
              {quickLinks.map((link) => (
                <Link
                  key={link._id}
                  href={getCategoryHref(link)}
                  className="inline-flex shrink-0 items-center rounded-[8px] border border-border bg-card-background px-4 py-2 text-[0.72rem] font-semibold text-primary-text transition-colors hover:border-primary-green hover:text-primary-green"
                >
                  {link.title}
                  <ChevronRight className="ml-2 h-3.5 w-3.5" strokeWidth={2.1} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <div className="grid gap-6 xl:hidden sm:grid-cols-2">
          {featuredNews.slice(0, 4).map((story) => (
            <EditorialCard key={story._id} item={story} hrefBase="/news" priority={story._id === featuredNews[0]?._id} />
          ))}
        </div>

        <div className="hidden xl:flex xl:flex-col xl:gap-6">
          {desktopLeadItem ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
              <DesktopLeadCard item={desktopLeadItem} hrefBase="/news" />

              <div className="grid gap-6">
                {desktopStackItems.map((story) => (
                  <DesktopSupportingCard key={story._id} item={story} hrefBase="/news" />
                ))}
              </div>
            </div>
          ) : null}

          {desktopSupportingItems.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {desktopSupportingItems.map(({item, hrefBase}) => (
                <DesktopSupportingCard key={`${hrefBase}-${item._id}`} item={item} hrefBase={hrefBase} />
              ))}
            </div>
          ) : null}

          {spotlightJob ? <HomeJobSpotlight item={spotlightJob} /> : null}
        </div>

        <aside className="bg-[#fbf7df] px-5 py-6 dark:bg-card-background sm:px-6 sm:py-7">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-[2.35rem] font-bold leading-none tracking-[-0.06em] text-primary-green sm:text-[2.75rem]">
              Top Updates
            </h2>
            <Link
              href="/search"
              className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-text transition-colors hover:text-primary-green"
            >
              Browse All
            </Link>
          </div>

          <div className="relative mt-7 pl-7">
            <div className="absolute left-[10px] top-2 bottom-2 w-px bg-primary-green/45" />
            <div className="flex flex-col gap-6">
              {topUpdates.map((item) => (
                <article key={item._id} className="relative border-b border-black/10 pb-5 last:border-b-0 last:pb-0 dark:border-white/10">
                  <span className="absolute -left-[21px] top-1 h-[8px] w-[8px] rounded-full bg-primary-green" />
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">
                    {item.label}
                  </p>
                  <h3 className="mt-3 font-display text-[1.35rem] font-bold leading-[1.04] tracking-[-0.05em] text-primary-text sm:text-[1.5rem]">
                    <Link
                      href={item.href}
                      className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                    <span>{formatDate(item.date)}</span>
                    <span>{formatViews(item.views)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeader title="Blog & Guides" href="/blog" />
        <div className={getSectionGridClass(homeBlog.length)}>
          {homeBlog.map((post) => (
            <EditorialCard key={post._id} item={post} hrefBase="/blog" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeader title="Jobs" href="/jobs" />
        <div className={getSectionGridClass(homeJobs.length)}>
          {homeJobs.map((job) => (
            <JobPreview key={job._id} item={job} />
          ))}
        </div>

        <aside className="bg-[#fbf7df] px-5 py-6 dark:bg-card-background sm:px-6 sm:py-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-[2rem] font-bold leading-none tracking-[-0.06em] text-primary-green sm:text-[2.35rem]">
              More Latest News
            </h3>
            <Link
              href="/news"
              className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-text transition-colors hover:text-primary-green"
            >
              Show All
            </Link>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {moreLatestNews.map((story) => (
              <article key={story._id} className="border-b border-black/10 pb-5 last:border-b-0 last:pb-0 dark:border-white/10">
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">
                  {formatDate(story.publishedAt)}
                </p>
                <h3 className="mt-3 font-display text-[1.2rem] font-bold leading-[1.06] tracking-[-0.05em] text-primary-text">
                  <Link
                    href={`/news/${story.slug}`}
                    className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                  >
                    {story.title}
                  </Link>
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                  <span>Published by {story.authorName}</span>
                  <span>{formatViews(story.views)}</span>
                  <span>{formatComments(story.commentCount)}</span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[28px] bg-primary-green px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display text-[2.4rem] font-bold leading-[0.96] tracking-[-0.06em] sm:text-[3.2rem] lg:text-[4rem]">
              Sign up for GizPulse Weekly
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-white/90">
              Subscribe for jobs, opportunities, guides, and the most useful tech stories in one clean weekly digest.
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
              <span>Jobs</span>
              <span>Opportunities</span>
              <span>Guides</span>
            </div>
          </div>

          <div className="w-full max-w-[34rem]">
            <HomeNewsletterSignup />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <SectionHeader title="Opportunities" href="/opportunities" />
        <div className={getSectionGridClass(homeOpportunities.length)}>
          {homeOpportunities.map((item) => (
            <OpportunityPreview key={item._id} item={item} />
          ))}
        </div>
      </section>
    </main>
  )
}
