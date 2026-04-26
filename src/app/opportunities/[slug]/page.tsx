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
import {getOpportunitiesContent, getOpportunityBySlug} from '@/lib/content'
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
  const item = await getOpportunityBySlug(slug)
  if (!item) return {title: 'Opportunities | GizPulse'}
  return buildArticleMetadata({
    title: item.title,
    excerpt: item.excerpt,
    coverImageUrl: item.coverImageUrl,
    publishedAt: item.deadline,
    pathname: `/opportunities/${slug}`,
    seo: item.seo,
  })
}

export default async function OpportunityDetailPage({params}: Props) {
  const {slug} = await params
  const [item, latestOpportunities] = await Promise.all([getOpportunityBySlug(slug), getOpportunitiesContent()])
  if (!item) notFound()

  const related = latestOpportunities.filter((entry) => entry.slug !== item.slug).slice(0, 3)
  const structuredData = buildStructuredData({
    kind: 'opportunity',
    title: item.title,
    description: item.seo?.metaDescription || item.excerpt,
    pathname: `/opportunities/${item.slug}`,
    image: item.seo?.ogImageUrl || item.coverImageUrl,
    publishedAt: item.deadline,
    organizationName: item.organization,
    location: item.location,
  })

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-10">
      <StructuredData data={structuredData} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{item.organization}</p>
          <h1 className="mt-3 font-display text-[1.95rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
            {item.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
            <Link href={item.categorySlug ? getQuickLinkHref(item.categorySlug, 'opportunities') : getCategoryHrefFromLabel(item.opportunityType, 'opportunities')} className="text-primary-green hover:opacity-90">
              {item.categoryTitle ?? item.opportunityType}
            </Link>
            <span>{item.location}</span>
            <span>Deadline {formatDate(item.deadline)}</span>
            <ViewTracker postType="opportunities" postSlug={item.slug} initialViews={item.views ?? 0} />
            <span>{formatComments(item.commentCount)}</span>
          </div>

          <AppImage
            src={item.coverImageUrl}
            alt={item.coverImageAlt ?? item.title}
            className="mt-8 h-auto max-h-[42rem] w-full bg-card-background object-contain"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
          />
          <CoverImageMeta
            caption={item.coverImageCaption}
            credit={item.coverImageCredit}
            sourceUrl={item.coverImageSourceUrl}
          />

          <section className="mt-8 grid gap-5 border border-border p-5">
            <h2 className="font-display text-[1.8rem] font-bold tracking-[-0.04em] text-primary-text">Opportunity Overview</h2>
            <p className="text-[1.02rem] leading-8 text-muted-text">{item.excerpt}</p>
            {item.applicationUrl ? (
              <Link
                href={item.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-fit items-center bg-primary-green px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em] !text-white"
              >
                Apply Now
              </Link>
            ) : null}
          </section>

          <SanityBodyContent body={item.body} />

          <ShareActions title={item.title} topics={[item.opportunityType, item.location]} />
          <InlineNewsletter />
          <ArticleComments postType="opportunities" postSlug={item.slug} />

          <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Opportunities</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {related.map((entry) => (
            <RelatedStoryCard
              key={entry._id}
              href={`/opportunities/${entry.slug}`}
              title={entry.title}
              imageUrl={entry.coverImageUrl}
              date={entry.deadline}
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
