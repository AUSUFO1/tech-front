import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {CompactNewsletterForm} from '@/components/CompactNewsletterForm'
import {getHomepageContent} from '@/lib/content'
import {isEarnCategory} from '@/lib/content-sections'
import {type BlogItem, type FeaturedNewsItem, type JobItem, type OpportunityItem, type QuickLink} from '@/lib/content-types'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'

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
  label: string
  date?: string
  views: number
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

function EditorialCard({item, hrefBase}: {item: FeaturedNewsItem | BlogItem; hrefBase: '/news' | '/blog'}) {
  return (
    <article className="bg-card-background pb-2">
      <Link href={`${hrefBase}/${item.slug}`} className="block overflow-hidden">
        <AppImage
          src={item.coverImageUrl}
          alt={item.title}
          className="aspect-[4/3] w-full bg-card-background object-contain md:h-[220px] md:aspect-auto md:object-contain"
          width={1200}
          height={780}
          sizes="(max-width: 768px) 100vw, 50vw"
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
  const featuredStoryIds = new Set(featuredNews.slice(0, 4).map((story) => story._id))
  const topUpdates: TopUpdateItem[] = [
    ...latestNews
      .filter((story) => !featuredStoryIds.has(story._id))
      .map((story) => ({
        _id: story._id,
        title: story.title,
        href: `/news/${story.slug}`,
        label: 'News',
        date: story.publishedAt,
        views: story.views,
      })),
    ...latestBlog.map((post) => ({
      _id: post._id,
      title: post.title,
      href: `/blog/${post.slug}`,
      label: 'Blog',
      date: post.publishedAt,
      views: post.views,
    })),
    ...latestJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      href: `/jobs/${job.slug}`,
      label: 'Jobs',
      date: job.publishedAt,
      views: job.views,
    })),
    ...latestOpportunities.map((item) => ({
      _id: item._id,
      title: item.title,
      href: `/opportunities/${item.slug}`,
      label: 'Opportunity',
      date: item.deadline,
      views: item.views,
    })),
  ]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
  const moreLatestNews = latestNews.slice(5, 10)
  const homeBlog = latestBlog.filter((post) => !isEarnCategory(post.categoryTitle)).slice(0, 6)
  const homeJobs = latestJobs.slice(0, 3)
  const homeOpportunities = latestOpportunities.slice(0, 3)

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-5 py-6 sm:px-8 lg:px-16 lg:gap-14 lg:py-8">
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
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredNews.slice(0, 4).map((story) => (
            <EditorialCard key={story._id} item={story} hrefBase="/news" />
          ))}
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
              Sign up for Techfront Weekly
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
            <CompactNewsletterForm
              buttonLabel="Subscribe Now"
              className="flex flex-col gap-4 sm:flex-row"
              inputClassName="h-13 w-full rounded-[8px] border !border-white bg-transparent px-4 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-white placeholder:text-white/75 focus:outline-none"
              buttonClassName="inline-flex h-13 items-center justify-center whitespace-nowrap rounded-[8px] bg-white px-6 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-primary-green"
              helperTextClassName="text-[0.8rem] text-white/80"
              successClassName="text-[0.84rem] text-white"
              errorClassName="text-[0.84rem] text-white/80"
            />
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

