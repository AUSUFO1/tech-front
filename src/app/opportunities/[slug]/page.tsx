import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {LatestNewsRail} from '@/components/LatestNewsRail'
import {ShareActions} from '@/components/ShareActions'
import {latestOpportunities} from '@/lib/mock-content'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = latestOpportunities.find((opportunity) => opportunity.slug === slug)
  if (!item) return {title: 'Opportunities | Techfront'}
  return {
    title: `${item.title} | Techfront`,
    description: item.excerpt,
    openGraph: {title: item.title, description: item.excerpt, type: 'article'},
  }
}

export default async function OpportunityDetailPage({params}: Props) {
  const {slug} = await params
  const item = latestOpportunities.find((entry) => entry.slug === slug)
  if (!item) notFound()

  const related = latestOpportunities.filter((entry) => entry.slug !== item.slug).slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{item.organization}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
            {item.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
            <span>{item.opportunityType}</span>
            <span>{item.location}</span>
            <span>Deadline {formatDate(item.deadline)}</span>
          </div>

          <section className="mt-8 grid gap-5 border border-border p-5">
            <h2 className="font-display text-[1.8rem] font-bold tracking-[-0.04em] text-primary-text">Opportunity Overview</h2>
            <p className="text-[1.02rem] leading-8 text-muted-text">{item.excerpt}</p>
            <button className="h-11 w-fit bg-primary-green px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white">
              Apply Now
            </button>
          </section>

          <ShareActions title={item.title} topics={[item.opportunityType, item.location]} />
          <InlineNewsletter />
          <ArticleComments postType="opportunities" postSlug={item.slug} />

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Opportunities</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {related.map((entry) => (
                <article key={entry._id} className="border-t border-border pt-4">
                  <h3 className="font-display text-[1.35rem] font-bold leading-[1.05] tracking-[-0.04em] text-primary-text">
                    <Link href={`/opportunities/${entry.slug}`} className="hover:text-primary-green">
                      {entry.title}
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
