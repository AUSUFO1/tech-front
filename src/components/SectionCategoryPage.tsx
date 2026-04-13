import Link from 'next/link'
import {notFound} from 'next/navigation'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {SectionSearchBar} from '@/components/SectionSearchBar'
import {StandardPagination} from '@/components/StandardPagination'
import {getBlogContent, getCategoryBySlug, getJobsContent, getNewsContent, getOpportunitiesContent} from '@/lib/content'
import {isEarnCategory} from '@/lib/content-sections'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'
import {getCurrentPage, paginateItems} from '@/lib/pagination'

type SectionType = 'blog' | 'earn' | 'jobs' | 'opportunities'

type SectionCategoryPageProps = {
  section: SectionType
  slug: string
  page?: string
}

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric'}).format(new Date(date))
}

function formatViews(views?: number) {
  return `${(views ?? 0).toLocaleString()} views`
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

const sectionConfig = {
  blog: {
    heading: 'Blog & Guides',
    searchPlaceholder: 'Search guides, tutorials, and career articles...',
    emptyTitle: 'No posts yet',
    emptyCopy: 'Publish content in this category and it will appear here.',
  },
  earn: {
    heading: 'Earn',
    searchPlaceholder: 'Search freelancing and career growth stories...',
    emptyTitle: 'No stories yet',
    emptyCopy: 'Publish content in this earn category and it will appear here.',
  },
  jobs: {
    heading: 'Jobs',
    searchPlaceholder: 'Search jobs by title, company, or location...',
    emptyTitle: 'No jobs yet',
    emptyCopy: 'Publish jobs in this category and they will appear here.',
  },
  opportunities: {
    heading: 'Opportunities',
    searchPlaceholder: 'Search scholarships, fellowships, grants, and bootcamps...',
    emptyTitle: 'No opportunities yet',
    emptyCopy: 'Publish opportunities in this category and they will appear here.',
  },
} as const

export async function SectionCategoryPage({section, slug, page}: SectionCategoryPageProps) {
  const category = await getCategoryBySlug(slug, section)
  if (!category) notFound()

  const [{latestNews}, blogItems, jobItems, opportunityItems] = await Promise.all([
    getNewsContent(),
    getBlogContent(),
    getJobsContent(),
    getOpportunitiesContent(),
  ])

  const config = sectionConfig[section]
  const currentPage = getCurrentPage(page)

  const blogEarnItems =
    section === 'blog'
      ? blogItems.filter((item) => !isEarnCategory(item.categoryTitle) && item.categorySlug === slug)
      : section === 'earn'
        ? blogItems.filter((item) => isEarnCategory(item.categoryTitle) && item.categorySlug === slug)
        : []

  const jobCategoryItems = section === 'jobs' ? jobItems.filter((item) => item.categorySlug === slug) : []
  const opportunityCategoryItems =
    section === 'opportunities' ? opportunityItems.filter((item) => item.categorySlug === slug) : []

  const paginatedBlogEarnItems = paginateItems(blogEarnItems, currentPage)
  const paginatedJobItems = paginateItems(jobCategoryItems, currentPage)
  const paginatedOpportunityItems = paginateItems(opportunityCategoryItems, currentPage)

  const totalItems =
    section === 'blog' || section === 'earn'
      ? blogEarnItems.length
      : section === 'jobs'
        ? jobCategoryItems.length
        : opportunityCategoryItems.length

  const createPageHref = (targetPage: number) => {
    const suffix = targetPage > 1 ? `?page=${targetPage}` : ''
    return `/${section}/category/${slug}${suffix}`
  }

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{config.heading}</p>
        <h1 className="mt-3 font-display text-[3rem] font-bold leading-[0.92] tracking-[-0.07em] text-primary-text sm:text-[4.4rem]">
          {category.title}
        </h1>
        {category.description ? (
          <p className="mt-4 max-w-4xl text-[1.08rem] leading-8 text-muted-text">{category.description}</p>
        ) : null}
      </section>

      <SectionSearchBar placeholder={config.searchPlaceholder} />

      <section className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="border-t border-border">
          {totalItems === 0 ? (
            <div className="py-10">
              <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">{config.emptyTitle}</h2>
              <p className="mt-3 text-[1rem] text-muted-text">{config.emptyCopy}</p>
            </div>
          ) : null}

          {(section === 'blog' || section === 'earn') &&
            paginatedBlogEarnItems.items.map((item) => (
              <article key={item._id} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-5">
                <Link href={`/${section}/${item.slug}`} className="block overflow-hidden">
                  <AppImage
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="aspect-[4/3] w-full bg-card-background object-contain sm:h-[158px] sm:aspect-auto sm:object-cover"
                    width={900}
                    height={620}
                    sizes="(max-width: 640px) 100vw, 230px"
                  />
                </Link>
                <div className="min-w-0">
                  <h2 className="font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
                    <Link
                      href={`/${section}/${item.slug}`}
                      className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-2 text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                    <CategoryTagLink
                      href={item.categorySlug ? getQuickLinkHref(item.categorySlug, section) : getCategoryHrefFromLabel(item.categoryTitle, section)}
                      label={item.categoryTitle}
                    />
                    <span>{item.authorName}</span>
                    <span>{formatDate(item.publishedAt)}</span>
                    <span>{formatViews(item.views)}</span>
                    <span>{formatComments(item.commentCount)}</span>
                  </div>
                </div>
              </article>
            ))}

          {section === 'jobs' &&
            paginatedJobItems.items.map((item) => (
              <article key={item._id} className="border-b border-border py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">{item.company}</p>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{item.remote ? 'Remote' : item.location}</p>
                </div>
                <h2 className="mt-3 font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
                  <Link
                    href={`/jobs/${item.slug}`}
                    className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                  <CategoryTagLink
                    href={item.categorySlug ? getQuickLinkHref(item.categorySlug, 'jobs') : '/jobs'}
                    label={item.categoryTitle ?? item.employmentType}
                  />
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>{formatViews(item.views)}</span>
                  <span>{formatComments(item.commentCount)}</span>
                </div>
              </article>
            ))}

          {section === 'opportunities' &&
            paginatedOpportunityItems.items.map((item) => (
              <article key={item._id} className="border-b border-border py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">{item.organization}</p>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Deadline {formatDate(item.deadline)}</p>
                </div>
                <h2 className="mt-3 font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
                  <Link
                    href={`/opportunities/${item.slug}`}
                    className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                  <CategoryTagLink
                    href={item.categorySlug ? getQuickLinkHref(item.categorySlug, 'opportunities') : getCategoryHrefFromLabel(item.opportunityType, 'opportunities')}
                    label={item.categoryTitle ?? item.opportunityType}
                  />
                  <span>{item.location}</span>
                  <span>{formatViews(item.views)}</span>
                  <span>{formatComments(item.commentCount)}</span>
                </div>
              </article>
            ))}

          {totalItems > 0 ? (
            <StandardPagination
              summary={`${
                section === 'blog' || section === 'earn'
                  ? `${paginatedBlogEarnItems.startItem}-${paginatedBlogEarnItems.endItem} of ${paginatedBlogEarnItems.totalItems}`
                  : section === 'jobs'
                    ? `${paginatedJobItems.startItem}-${paginatedJobItems.endItem} of ${paginatedJobItems.totalItems}`
                    : `${paginatedOpportunityItems.startItem}-${paginatedOpportunityItems.endItem} of ${paginatedOpportunityItems.totalItems}`
              }`}
              currentPage={
                section === 'blog' || section === 'earn'
                  ? paginatedBlogEarnItems.page
                  : section === 'jobs'
                    ? paginatedJobItems.page
                    : paginatedOpportunityItems.page
              }
              totalPages={
                section === 'blog' || section === 'earn'
                  ? paginatedBlogEarnItems.totalPages
                  : section === 'jobs'
                    ? paginatedJobItems.totalPages
                    : paginatedOpportunityItems.totalPages
              }
              createPageHref={createPageHref}
            />
          ) : null}
        </div>

        <aside className="border border-border px-5 py-6 lg:sticky lg:top-[112px]">
          <h2 className="font-display text-[2.2rem] font-bold leading-none tracking-[-0.06em] text-primary-green">Latest News</h2>
          <div className="relative mt-6 pl-6">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-primary-green/45" />
            <div className="flex flex-col gap-5">
              {latestNews.slice(0, 10).map((story) => (
                <article key={story._id} className="relative border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <span className="absolute -left-[21px] top-1 h-[8px] w-[8px] rounded-full bg-primary-green" />
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">{formatDate(story.publishedAt)}</p>
                  <h3 className="mt-2 font-display text-[1.2rem] font-bold leading-[1.03] tracking-[-0.04em] text-primary-text">
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
