import Link from 'next/link'
import {getNewsContent} from '@/lib/content'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric'}).format(new Date(date))
}

function formatViews(views?: number) {
  return `${(views ?? 0).toLocaleString()} views`
}

export async function LatestNewsRail() {
  const {latestNews} = await getNewsContent()

  return (
    <aside className="border border-border px-5 py-6 lg:sticky lg:top-[112px]">
      <h2 className="font-display text-[2rem] font-bold leading-none tracking-[-0.06em] text-primary-green">Latest News</h2>

      <div className="relative mt-6 pl-6">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-primary-green/45" />
        <div className="flex flex-col gap-5">
          {latestNews.slice(0, 10).map((story) => (
            <article key={story._id} className="relative border-b border-border pb-4 last:border-b-0 last:pb-0">
              <span className="absolute -left-[21px] top-1 h-[8px] w-[8px] rounded-full bg-primary-green" />
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary-green">{formatDate(story.publishedAt)}</p>
              <h3 className="mt-2 font-display text-[1.2rem] font-bold leading-[1.03] tracking-[-0.04em] text-primary-text">
                <Link href={`/news/${story.slug}`} className="transition-colors hover:text-primary-green">
                  {story.title}
                </Link>
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted-text">
                <span>Published by {story.authorName}</span>
                <span>{formatViews(story.views)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  )
}
