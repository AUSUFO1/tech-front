import type {Metadata} from 'next'
import Link from 'next/link'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {StandardPagination} from '@/components/StandardPagination'
import {getNewsContent} from '@/lib/content'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'
import {getCurrentPage, paginateItems} from '@/lib/pagination'
import {buildPageMetadata} from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Latest News | GizPulse',
  description: 'Read the latest tech and business news, policy updates, and industry stories on GizPulse.',
  pathname: '/news',
})

function formatDate(date?: string) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function formatShortDate(date?: string) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{page?: string}>
}) {
  const {featuredNews, latestNews} = await getNewsContent()
  const params = (await searchParams) ?? {}
  const currentPage = getCurrentPage(params.page)
  const paginated = paginateItems(featuredNews, currentPage)

  const createPageHref = (page: number) => (page > 1 ? `/news?page=${page}` : '/news')
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[4rem] font-bold leading-[0.9] tracking-[-0.07em] text-primary-text sm:text-[5rem]">
          Latest
        </h1>
      </section>

      <section className="py-6 lg:py-8">
        <form action="/search" className="flex w-full max-w-[44rem] flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            placeholder="Search news, topics, or authors..."
            className="h-12 w-full border border-border bg-transparent px-4 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center bg-primary-green px-6 text-[0.76rem] font-bold uppercase tracking-[0.14em] !text-white"
          >
            Search
          </button>
        </form>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="border-t border-border">
          {paginated.items.map((story, index) => (
            <article key={story._id} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-5">
              <Link href={`/news/${story.slug}`} className="block overflow-hidden">
                <AppImage
                  src={story.coverImageUrl}
                  alt={story.title}
                  className="aspect-[4/3] w-full bg-card-background object-contain sm:h-[158px] sm:aspect-auto sm:object-contain"
                  width={900}
                  height={620}
                  sizes="(max-width: 640px) 100vw, 240px"
                  priority={index === 0}
                />
              </Link>

              <div className="min-w-0">
                <h2 className="font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
                  <Link
                    href={`/news/${story.slug}`}
                    className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                  >
                    {story.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 text-[1.02rem] leading-7 text-muted-text">{story.excerpt}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                  <CategoryTagLink
                    href={story.categorySlug ? getQuickLinkHref(story.categorySlug, 'news') : getCategoryHrefFromLabel(story.categoryTitle, 'news')}
                    label={story.categoryTitle}
                  />
                  <span>{story.authorName}</span>
                  <span>{formatShortDate(story.publishedAt)}</span>
                  <span>{formatComments(story.commentCount)}</span>
                </div>
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
          <h2 className="font-display text-[2.35rem] font-bold leading-none tracking-[-0.06em] text-primary-green">Latest News</h2>

          <div className="relative mt-6 pl-6">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-primary-green/45" />
            <div className="flex flex-col gap-5">
              {latestNews.slice(0, 10).map((story) => (
                <article key={story._id} className="relative border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <span className="absolute -left-[21px] top-1 h-[8px] w-[8px] rounded-full bg-primary-green" />
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">{formatShortDate(story.publishedAt)}</p>
                  <h3 className="mt-2 font-display text-[1.25rem] font-bold leading-[1.02] tracking-[-0.04em] text-primary-text">
                    <Link
                      href={`/news/${story.slug}`}
                      className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                    >
                      {story.title}
                    </Link>
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                    <span>{story.authorName}</span>
                    <span>{formatComments(story.commentCount)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted-text">
        Updated {formatDate(featuredNews[0]?.publishedAt)}
      </p>
    </main>
  )
}

