import Link from 'next/link'
import {AppImage} from '@/components/AppImage'
import {CategoryTagLink} from '@/components/CategoryTagLink'
import {SectionSearchBar} from '@/components/SectionSearchBar'
import {StandardPagination} from '@/components/StandardPagination'
import {getBlogContent, getNewsContent} from '@/lib/content'
import {isEarnCategory} from '@/lib/content-sections'
import {getCategoryHrefFromLabel} from '@/lib/link-mapping'
import {getCurrentPage, paginateItems} from '@/lib/pagination'

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

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{category?: string; page?: string}>
}) {
  const [latestBlog, {latestNews}] = await Promise.all([getBlogContent(), getNewsContent()])
  const params = (await searchParams) ?? {}
  const category = params.category
  const currentPage = getCurrentPage(params.page)
  const filteredBlog = latestBlog.filter((post) => {
    if (isEarnCategory(post.categoryTitle)) return false
    if (!category) return true
    if (category === 'beginner-guides') return post.categoryTitle === 'Beginner Guides'
    if (category === 'career-growth') return post.categoryTitle === 'Career Growth'
    return true
  })
  const paginated = paginateItems(filteredBlog, currentPage)

  const createPageHref = (page: number) => {
    const query = new URLSearchParams()
    if (category) query.set('category', category)
    if (page > 1) query.set('page', String(page))
    const queryString = query.toString()
    return queryString ? `/blog?${queryString}` : '/blog'
  }

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[3.6rem] font-bold leading-[0.92] tracking-[-0.07em] text-primary-text sm:text-[4.6rem]">
          Blog & Guides
        </h1>
      </section>

      <SectionSearchBar placeholder="Search guides, tutorials, and career articles..." />

      <section className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="border-t border-border">
          {paginated.items.map((post) => (
            <article key={post._id} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-5">
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                <AppImage src={post.coverImageUrl} alt={post.title} className="h-[150px] w-full object-cover sm:h-[158px]" width={900} height={620} sizes="(max-width: 640px) 100vw, 230px" />
              </Link>
              <div className="min-w-0">
                <h2 className="font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 text-[1rem] leading-7 text-muted-text">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                  <CategoryTagLink href={getCategoryHrefFromLabel(post.categoryTitle, 'blog')} label={post.categoryTitle} />
                  <span>{post.authorName}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{formatViews(post.views)}</span>
                  <span>{formatComments(post.commentCount)}</span>
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

