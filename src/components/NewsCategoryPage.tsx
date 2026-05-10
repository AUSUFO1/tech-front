import Link from 'next/link'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {SectionSearchBar} from '@/components/SectionSearchBar'
import {StandardPagination} from '@/components/StandardPagination'
import {getCategoriesByContentType, getCategoryBySlug, getNewsContent} from '@/lib/content'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'
import {getCurrentPage, paginateItems} from '@/lib/pagination'

function formatDate(date?: string) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

type NewsCategoryPageProps = {
  slug: string
  page?: string
}

export async function NewsCategoryPage({slug, page}: NewsCategoryPageProps) {
  const [{featuredNews, latestNews}, category, newsCategories] = await Promise.all([
    getNewsContent(),
    getCategoryBySlug(slug, 'news'),
    getCategoriesByContentType('news'),
  ])

  if (!category) {
    return null
  }

  const categoryDescription =
    category.description?.trim() ||
    'Published stories in this section will appear here as soon as they are available.'

  const items = featuredNews.filter((story) => story.categorySlug === slug)
  const currentPage = getCurrentPage(page)
  const paginated = paginateItems(items, currentPage)
  const createPageHref = (targetPage: number) => (targetPage > 1 ? `/news/category/${slug}?page=${targetPage}` : `/news/category/${slug}`)

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[3.2rem] font-bold leading-[0.9] tracking-[-0.07em] text-primary-text sm:text-[4.6rem]">
          {category.title}
        </h1>
        <p className="mt-4 max-w-4xl text-[1.18rem] leading-9 text-muted-text">{categoryDescription}</p>
      </section>

      <section className="overflow-x-auto border-b border-border py-3 scrollbar-none">
        <div className="flex min-w-max items-center gap-5 pr-5">
          {newsCategories.map((item) => {
            const isActive = item.slug === slug

            return (
              <Link
                key={item._id}
                href={`/news/category/${item.slug}`}
                className={`border-b-[2px] pb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? 'border-primary-green text-primary-green'
                    : 'border-transparent text-primary-text hover:border-primary-green/60 hover:text-primary-green'
                }`}
              >
                {item.title}
              </Link>
            )
          })}
        </div>
      </section>

      <SectionSearchBar placeholder={`Search ${category.title.toLowerCase()} stories...`} />

      <section className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="border-t border-border">
          {items.length === 0 ? (
            <div className="py-10">
              <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">No stories yet</h2>
              <p className="mt-3 text-[1rem] text-muted-text">
                This section is ready. Publish content in this category and it will appear here.
              </p>
            </div>
          ) : null}

          {paginated.items.map((story, index) => (
            <article key={story._id} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-5">
              <Link href={`/news/${story.slug}`} className="block overflow-hidden">
                <AppImage
                  src={story.coverImageUrl}
                  alt={story.title}
                  className="aspect-[4/3] w-full bg-card-background object-contain md:h-[158px] md:aspect-auto md:object-contain"
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
                  <span>{formatDate(story.publishedAt)}</span>
                  <span>{formatComments(story.commentCount)}</span>
                </div>
              </div>
            </article>
          ))}
          {items.length > 0 ? (
            <StandardPagination
              summary={`${paginated.startItem}-${paginated.endItem} of ${paginated.totalItems}`}
              currentPage={paginated.page}
              totalPages={paginated.totalPages}
              createPageHref={createPageHref}
            />
          ) : null}
        </div>

        <aside className="border border-border px-5 py-6 lg:sticky lg:top-[112px]">
          <h2 className="font-display text-[2.35rem] font-bold leading-none tracking-[-0.06em] text-primary-green">Latest News</h2>

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
    </main>
  )
}

