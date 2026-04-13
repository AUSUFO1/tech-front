import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-[980px] items-center px-5 py-16 sm:px-8">
      <section className="w-full rounded-[28px] border border-border bg-card-background px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-primary-green">404 Error</p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.8rem] font-bold leading-[0.92] tracking-[-0.07em] text-primary-text sm:text-[4rem]">
          This page is not available right now.
        </h1>
        <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-muted-text sm:text-[1.06rem]">
          The link may be broken, the article may have moved, or the page may not exist. Try search to find the story,
          category, job, or opportunity you need.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="inline-flex rounded-full bg-primary-green px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90"
          >
            Go To Search
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-border px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-primary-text transition-colors hover:border-primary-green hover:text-primary-green"
          >
            Back Home
          </Link>
        </div>
      </section>
    </main>
  )
}
