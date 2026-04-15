import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {AppImage} from '@/components/AppImage'
import {CoverImageMeta} from '@/components/CoverImageMeta'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {LatestNewsRail} from '@/components/LatestNewsRail'
import {RelatedStoryCard} from '@/components/RelatedStoryCard'
import {SanityBodyContent} from '@/components/SanityBodyContent'
import {ShareActions} from '@/components/ShareActions'
import {StructuredData} from '@/components/StructuredData'
import {ViewTracker} from '@/components/ViewTracker'
import {getNewsBySlug, getNewsContent} from '@/lib/content'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'
import {buildArticleMetadata, buildStructuredData} from '@/lib/seo'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = await getNewsBySlug(slug)
  if (!item) return {title: 'News | Techfront'}
  return buildArticleMetadata({
    title: item.title,
    excerpt: item.excerpt,
    coverImageUrl: item.coverImageUrl,
    publishedAt: item.publishedAt,
    pathname: `/news/${slug}`,
    seo: item.seo,
  })
}

export default async function NewsDetailPage({params}: Props) {
  const {slug} = await params
  const [story, {featuredNews}] = await Promise.all([getNewsBySlug(slug), getNewsContent()])
  if (!story) notFound()

  const sameCategory = featuredNews.filter((item) => item.slug !== story.slug && item.categoryTitle === story.categoryTitle)
  const fallback = featuredNews.filter((item) => item.slug !== story.slug && item.categoryTitle !== story.categoryTitle)
  const related = [...sameCategory, ...fallback].slice(0, 3)
  const structuredData = buildStructuredData({
    kind: 'news',
    title: story.title,
    description: story.seo?.metaDescription || story.excerpt,
    pathname: `/news/${story.slug}`,
    image: story.seo?.ogImageUrl || story.coverImageUrl,
    publishedAt: story.publishedAt,
    authorName: story.authorName,
  })

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-10">
      <StructuredData data={structuredData} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">
            <Link href={story.categorySlug ? getQuickLinkHref(story.categorySlug, 'news') : getCategoryHrefFromLabel(story.categoryTitle, 'news')} className="hover:opacity-90">
              {story.categoryTitle}
            </Link>
          </p>
          <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
            {story.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
            <Link href={`/authors/${story.authorSlug || story.authorName.toLowerCase().replaceAll(' ', '-')}`} className="hover:text-primary-green">
              Published by {story.authorName}
            </Link>
            <span>{formatDate(story.publishedAt)}</span>
            <ViewTracker postType="news" postSlug={story.slug} initialViews={story.views ?? 0} />
            <span>{formatComments(story.commentCount)}</span>
          </div>

          <AppImage
            src={story.coverImageUrl}
            alt={story.coverImageAlt ?? story.title}
            className="mt-8 h-auto max-h-[42rem] w-full bg-card-background object-contain"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
          />
          <CoverImageMeta
            caption={story.coverImageCaption}
            credit={story.coverImageCredit}
            sourceUrl={story.coverImageSourceUrl}
          />

          <SanityBodyContent body={story.body} />
          {!story.body?.length ? (
            <article className="mt-8 max-w-none">
              <p className="text-[1.06rem] leading-8 text-muted-text">{story.excerpt}</p>
            </article>
          ) : null}

          <ShareActions title={story.title} topics={[story.categoryTitle]} />
          <InlineNewsletter />
          <ArticleComments postType="news" postSlug={story.slug} />

          <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Stories</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <RelatedStoryCard
              key={item._id}
              href={`/news/${item.slug}`}
              title={item.title}
              imageUrl={item.coverImageUrl}
              date={item.publishedAt}
            />
          ))}
        </div>
      </section>
        </div>

        <LatestNewsRail />
      </section>
    </main>
  )
}
