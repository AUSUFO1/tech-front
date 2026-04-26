import Link from 'next/link'
import {notFound} from 'next/navigation'
import {AppImage} from '@/components/AppImage'
import {StandardPagination} from '@/components/StandardPagination'
import {getAuthorBySlug, getAuthoredItems} from '@/lib/content'
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

export default async function AuthorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}) {
  const {slug} = await params
  const paramsValue = (await searchParams) ?? {}
  const currentPage = getCurrentPage(paramsValue.page)
  const [author, authoredItems] = await Promise.all([getAuthorBySlug(slug), getAuthoredItems(slug)])
  const paginated = paginateItems(authoredItems, currentPage)

  if (!author) {
    notFound()
  }

  const createPageHref = (page: number) => (page > 1 ? `/authors/${slug}?page=${page}` : `/authors/${slug}`)

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-16 lg:pb-16">
      <section className="grid gap-6 border-b border-border py-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-center lg:py-10">
        <AppImage
          src={author.imageUrl}
          alt={author.name}
          className="h-[220px] w-[220px] object-cover"
          width={440}
          height={440}
          sizes="220px"
          priority
        />
        <div>
          <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">{author.title}</p>
          <h1 className="mt-3 font-display text-[2.7rem] font-bold leading-[0.94] tracking-[-0.06em] text-primary-text sm:text-[3.4rem]">
            {author.name}
          </h1>
          <p className="mt-4 max-w-3xl text-[1.05rem] leading-8 text-muted-text">{author.bio}</p>
        </div>
      </section>

      <section className="border-t border-border pt-6">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text sm:text-[2.3rem]">Articles</h2>

        {authoredItems.length === 0 ? (
          <p className="mt-4 text-[1rem] text-muted-text">No articles published yet.</p>
        ) : null}

        {paginated.items.map((item) => (
          <article key={item._id} className="border-b border-border py-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-green">{item.type}</p>
            <h3 className="mt-2 font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.2rem]">
              <Link href={item.href} className="transition-colors hover:text-primary-green">
                {item.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-4xl text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-text">
              <span>{formatDate(item.publishedAt)}</span>
              <span>{formatViews(item.views)}</span>
            </div>
          </article>
        ))}

        <StandardPagination
          summary={`${paginated.startItem}-${paginated.endItem} of ${paginated.totalItems}`}
          currentPage={paginated.page}
          totalPages={paginated.totalPages}
          createPageHref={createPageHref}
        />
      </section>
    </main>
  )
}
