import Link from 'next/link'
import {StandardPagination} from '@/components/StandardPagination'
import {mockAuthors} from '@/lib/mock-authors'

export default function AuthorsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-16 lg:pb-16">
      <section className="border-b border-border py-8 lg:py-10">
        <h1 className="font-display text-[3.1rem] font-bold leading-[0.9] tracking-[-0.07em] text-primary-text sm:text-[4.4rem]">
          Authors
        </h1>
        <p className="mt-4 max-w-3xl text-[1.08rem] leading-8 text-muted-text">
          Meet the writers and editors shaping Techfront coverage.
        </p>
      </section>

      <section className="grid gap-7 py-8 md:grid-cols-2 xl:grid-cols-3">
        {mockAuthors.map((author) => (
          <article key={author._id} className="bg-card-background p-4">
            <img src={author.imageUrl} alt={author.name} className="h-[300px] w-full object-cover" />
            <h2 className="mt-4 font-display text-[2rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              <Link href={`/authors/${author.slug}`} className="transition-colors hover:text-primary-green">
                {author.name}
              </Link>
            </h2>
            <p className="mt-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">{author.title}</p>
            <p className="mt-3 text-[0.98rem] leading-7 text-muted-text">{author.bio}</p>
          </article>
        ))}
      </section>

      <StandardPagination summary={`1-${mockAuthors.length} of ${mockAuthors.length}`} />
    </main>
  )
}
