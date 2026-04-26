import Link from 'next/link'
import {AppImage} from '@/components/AppImage'
import {StandardPagination} from '@/components/StandardPagination'
import {getAuthorsContent} from '@/lib/content'
import {getCurrentPage, paginateItems} from '@/lib/pagination'

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams?: Promise<{page?: string}>
}) {
  const authors = await getAuthorsContent()
  const params = (await searchParams) ?? {}
  const currentPage = getCurrentPage(params.page)
  const paginated = paginateItems(authors, currentPage)
  const createPageHref = (page: number) => (page > 1 ? `/authors?page=${page}` : '/authors')
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[3.1rem] font-bold leading-[0.9] tracking-[-0.07em] text-primary-text sm:text-[4.4rem]">
          Authors
        </h1>
        <p className="mt-4 max-w-3xl text-[1.08rem] leading-8 text-muted-text">
          Meet the writers and editors shaping GizPulse coverage.
        </p>
      </section>

      <section className="grid gap-7 py-8 md:grid-cols-2 xl:grid-cols-3">
        {paginated.items.map((author, index) => (
          <article key={author._id} className="bg-card-background p-4">
            <AppImage
              src={author.imageUrl}
              alt={author.name}
              className="aspect-[4/5] w-full bg-card-background object-contain object-top"
              width={900}
              height={1200}
              sizes="(max-width: 1280px) 50vw, 33vw"
              priority={index === 0}
            />
            <h2 className="mt-4 font-display text-[2rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              <Link href={`/authors/${author.slug}`} className="transition-colors hover:text-primary-green">
                {author.name}
              </Link>
            </h2>
            <p className="mt-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">{author.title}</p>
            <p className="mt-3 line-clamp-6 text-[0.98rem] leading-7 text-muted-text">{author.bio}</p>
            <Link
              href={`/authors/${author.slug}`}
              className="mt-4 inline-flex text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green transition-colors hover:text-primary-text"
            >
              Read More
            </Link>
          </article>
        ))}
      </section>

      <StandardPagination
        summary={`${paginated.startItem}-${paginated.endItem} of ${paginated.totalItems}`}
        currentPage={paginated.page}
        totalPages={paginated.totalPages}
        createPageHref={createPageHref}
      />
    </main>
  )
}
