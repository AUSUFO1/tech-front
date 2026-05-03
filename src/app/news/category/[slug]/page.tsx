import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {NewsCategoryPage} from '@/components/NewsCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {buildPageMetadata} from '@/lib/seo'

type Props = {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = await getCategoryBySlug(slug, 'news')

  return buildPageMetadata({
    title: category ? `${category.title} | News | GizPulse` : 'News Category | GizPulse',
    description: category?.description || 'Browse GizPulse news stories in this category.',
    pathname: `/news/category/${slug}`,
  })
}

export default async function Page({params, searchParams}: Props) {
  const {slug} = await params
  const query = (await searchParams) ?? {}
  const category = await getCategoryBySlug(slug, 'news')

  if (!category) notFound()

  return <NewsCategoryPage slug={slug} page={query.page} />
}
