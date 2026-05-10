import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {AppImage} from '@/components/AppImage'
import {CoverImageMeta} from '@/components/CoverImageMeta'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {RelatedStoryCard} from '@/components/RelatedStoryCard'
import {SanityBodyContent} from '@/components/SanityBodyContent'
import {ShareActions} from '@/components/ShareActions'
import {StructuredData} from '@/components/StructuredData'
import {ViewTracker} from '@/components/ViewTracker'
import {getBlogContent, getContentImageUrls} from '@/lib/content'
import {getCategoryHrefFromLabel, getQuickLinkHref} from '@/lib/link-mapping'
import {formatReadTime} from '@/lib/read-time'
import {buildArticleMetadata, buildStructuredData} from '@/lib/seo'
 
function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

function formatTime(date?: string) {
  if (!date) return 'No time'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
    timeZoneName: 'short',
  }).format(new Date(date))
}

function formatComments(count?: number) {
  return `${(count ?? 0).toLocaleString()} comments`
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const latestBlog = await getBlogContent()
  const earnPosts = latestBlog.filter((item) => ['Freelancing', 'Career Growth'].includes(item.categoryTitle))
  const item = earnPosts.find((post) => post.slug === slug)
  if (!item) return {title: 'Earn | GizPulse'}
  return buildArticleMetadata({
    title: item.title,
    excerpt: item.excerpt,
    coverImageUrl: item.coverImageUrl,
    publishedAt: item.publishedAt,
    pathname: `/earn/${slug}`,
    seo: item.seo,
  })
}

export default async function EarnDetailPage({params}: Props) {
  const {slug} = await params
  const latestBlog = await getBlogContent()
  const earnPosts = latestBlog.filter((item) => ['Freelancing', 'Career Growth'].includes(item.categoryTitle))
  const post = earnPosts.find((item) => item.slug === slug)
  if (!post) notFound()

  const related = earnPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const structuredDataImages = getContentImageUrls(post.body, post.seo?.ogImageUrl || post.coverImageUrl)
  const structuredData = buildStructuredData({
    kind: 'article',
    title: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    pathname: `/earn/${post.slug}`,
    image: structuredDataImages,
    publishedAt: post.publishedAt,
    authorName: post.authorName,
    authorPath: `/authors/${post.authorSlug || post.authorName.toLowerCase().replaceAll(' ', '-')}`,
  })

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <StructuredData data={structuredData} />
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">
        <Link href={post.categorySlug ? getQuickLinkHref(post.categorySlug, 'earn') : getCategoryHrefFromLabel(post.categoryTitle, 'earn')} className="hover:opacity-90">
          {post.categoryTitle}
        </Link>
      </p>
      <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
        <Link href={`/authors/${post.authorSlug || post.authorName.toLowerCase().replaceAll(' ', '-')}`} className="hover:text-primary-green">
          Published by {post.authorName}
        </Link>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <time dateTime={post.publishedAt}>{formatTime(post.publishedAt)}</time>
        <span>{formatReadTime({title: post.title, excerpt: post.excerpt, body: post.body})}</span>
        <span>{formatComments(post.commentCount)}</span>
      </div>
      <ViewTracker postType="earn" postSlug={post.slug} initialViews={post.views ?? 0} />

      <AppImage
        src={post.coverImageUrl}
        alt={post.coverImageAlt ?? post.title}
        className="mt-8 h-auto max-h-[42rem] w-full bg-card-background object-contain"
        width={1400}
        height={840}
        sizes="100vw"
        priority
      />
      <CoverImageMeta
        caption={post.coverImageCaption}
        credit={post.coverImageCredit}
        sourceUrl={post.coverImageSourceUrl}
      />

      <SanityBodyContent body={post.body} />
      {!post.body?.length ? (
        <article className="mt-8 max-w-none">
          <p className="text-[1.06rem] leading-8 text-muted-text">{post.excerpt}</p>
        </article>
      ) : null}

      <ShareActions
        title={post.title}
        topics={[post.categoryTitle]}
        topicHrefs={{
          [post.categoryTitle]: post.categorySlug
            ? getQuickLinkHref(post.categorySlug, 'earn')
            : getCategoryHrefFromLabel(post.categoryTitle, 'earn'),
        }}
      />

      <InlineNewsletter />
      <ArticleComments postType="earn" postSlug={post.slug} />

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Stories</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <RelatedStoryCard
              key={item._id}
              href={`/earn/${item.slug}`}
              title={item.title}
              imageUrl={item.coverImageUrl}
              date={item.publishedAt}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
