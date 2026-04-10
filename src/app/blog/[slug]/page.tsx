import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleComments} from '@/components/ArticleComments'
import {InlineNewsletter} from '@/components/InlineNewsletter'
import {ShareActions} from '@/components/ShareActions'
import {latestBlog} from '@/lib/mock-content'

function formatDate(date?: string) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date))
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = latestBlog.find((post) => post.slug === slug)
  if (!item) return {title: 'Blog | Techfront'}
  return {
    title: `${item.title} | Techfront`,
    description: item.excerpt,
    openGraph: {title: item.title, description: item.excerpt, type: 'article'},
  }
}

export default async function BlogDetailPage({params}: Props) {
  const {slug} = await params
  const post = latestBlog.find((item) => item.slug === slug)
  if (!post) notFound()

  const related = latestBlog.filter((item) => item.slug !== post.slug && item.categoryTitle === post.categoryTitle).slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">{post.categoryTitle}</p>
      <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-primary-text sm:text-[3.5rem]">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-text">
        <Link href={`/authors/${post.authorName.toLowerCase().replaceAll(' ', '-')}`} className="hover:text-primary-green">
          Published by {post.authorName}
        </Link>
        <span>{formatDate(post.publishedAt)}</span>
        <span>{(post.views ?? 0).toLocaleString()} views</span>
      </div>

      <img src={post.coverImageUrl} alt={post.title} className="mt-8 h-[420px] w-full object-cover" />

      <article className="mt-8 max-w-none">
        <p className="text-[1.06rem] leading-8 text-muted-text">{post.excerpt}</p>
      </article>

      <ShareActions title={post.title} topics={[post.categoryTitle]} />

      <InlineNewsletter />
      <ArticleComments postType="blog" postSlug={post.slug} />

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Related Guides</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <article key={item._id} className="border-t border-border pt-4">
              <h3 className="font-display text-[1.35rem] font-bold leading-[1.05] tracking-[-0.04em] text-primary-text">
                <Link href={`/blog/${item.slug}`} className="hover:text-primary-green">
                  {item.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
