import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {LatestNewsRail} from '@/components/LatestNewsRail'
import {ShareActions} from '@/components/ShareActions'
import {featuredNews} from '@/lib/mock-content'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = featuredNews.find((story) => story.slug === slug)
  if (!item) return {title: 'News | Techfront'}
  return {
    title: `${item.title} | Techfront`,
    description: item.excerpt,
    openGraph: {title: item.title, description: item.excerpt, type: 'article'},
    twitter: {card: 'summary_large_image', title: item.title, description: item.excerpt},
  }
}

export default async function NewsDetailPage({params}: Props) {
  const {slug} = await params
  const story = featuredNews.find((item) => item.slug === slug)
  if (!story) notFound()

  const sameCategory = featuredNews.filter((item) => item.slug !== story.slug && item.categoryTitle === story.categoryTitle)
  const fallback = featuredNews.filter((item) => item.slug !== story.slug && item.categoryTitle !== story.categoryTitle)
  const related = [...sameCategory, ...fallback].slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{story.categoryTitle}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
            {story.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
            <Link href={`/authors/${story.authorName.toLowerCase().replaceAll(' ', '-')}`} className="hover:text-primary-green">
              Published by {story.authorName}
            </Link>
            <span>{formatDate(story.publishedAt)}</span>
            <span>{(story.views ?? 0).toLocaleString()} views</span>
          </div>

          <img src={story.coverImageUrl} alt={story.title} className="mt-8 h-[420px] w-full object-cover" />

          <article className="mt-8 prose max-w-none prose-headings:font-display prose-p:text-muted-text">
            <p>{story.excerpt}</p>
            <p>
              This is the full story page layout using the Techfront reading template. When Sanity content is connected, this section
              will render rich body blocks from the CMS.
            </p>
          </article>

          <ShareActions title={story.title} topics={[story.categoryTitle]} />
          <InlineNewsletter />
          <ArticleComments postType="news" postSlug={story.slug} />

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Stories</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item._id} className="border-t border-border pt-4">
                  <h3 className="font-display text-[1.35rem] font-bold leading-[1.05] tracking-[-0.04em] text-primary-text">
                    <Link href={`/news/${item.slug}`} className="hover:text-primary-green">
                      {item.title}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </section>
        </div>

        <LatestNewsRail />
      </section>
    </main>
  )
}
