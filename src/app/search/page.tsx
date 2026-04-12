import Link from 'next/link'
import {getSearchContent} from '@/lib/content'

type SearchResult = {
  id: string
  title: string
  excerpt: string
  href: string
  type: 'News' | 'Blog' | 'Job' | 'Opportunity'
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{q?: string}>
}) {
  const params = (await searchParams) ?? {}
  const query = params.q ?? ''
  const q = normalize(query)
  const {blog, jobs, news, opportunities} = await getSearchContent()

  const mapped: SearchResult[] = [
      ...news.map((item) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt,
        href: `/news/${item.slug}`,
        type: 'News' as const,
      })),
      ...blog.map((item) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt,
        href: `/blog/${item.slug}`,
        type: 'Blog' as const,
      })),
      ...jobs.map((item) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt,
        href: `/jobs/${item.slug}`,
        type: 'Job' as const,
      })),
      ...opportunities.map((item) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt,
        href: `/opportunities/${item.slug}`,
        type: 'Opportunity' as const,
      })),
    ]

  const results = !q ? mapped : mapped.filter((item) => normalize(`${item.title} ${item.excerpt} ${item.type}`).includes(q))

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[3.1rem] font-bold leading-[0.9] tracking-[-0.07em] text-primary-text sm:text-[4.4rem]">
          Search
        </h1>
        <p className="mt-4 max-w-3xl text-[1.1rem] leading-8 text-muted-text">
          Find guides, jobs, opportunities, and news across Techfront.
        </p>
      </section>

      <section className="py-6 lg:py-8">
        <form action="/search" className="flex w-full max-w-[44rem] flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search jobs, opportunities, guides, or news..."
            className="h-12 w-full border border-border bg-transparent px-4 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center bg-primary-green px-6 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-white"
          >
            Search
          </button>
        </form>
      </section>

      <section className="border-t border-border">
        {results.map((item) => (
          <article key={item.id} className="border-b border-border py-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-green">{item.type}</p>
            <h2 className="mt-2 font-display text-[1.9rem] font-bold leading-[1] tracking-[-0.05em] text-primary-text sm:text-[2.1rem]">
              <Link href={item.href} className="transition-colors hover:text-primary-green">
                {item.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-4xl text-[1rem] leading-7 text-muted-text">{item.excerpt}</p>
          </article>
        ))}

        {results.length === 0 ? (
          <div className="py-10">
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">No results found</h2>
            <p className="mt-3 text-muted-text">Try a broader keyword like remote, AI, NYSC, scholarship, or frontend.</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
