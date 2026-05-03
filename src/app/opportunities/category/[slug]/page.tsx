import type {Metadata} from 'next'
import {SectionCategoryPage} from '@/components/SectionCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {buildPageMetadata} from '@/lib/seo'

type Props = {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = await getCategoryBySlug(slug, 'opportunities')

  return buildPageMetadata({
    title: category ? `${category.title} | Opportunities | GizPulse` : 'Opportunities Category | GizPulse',
    description: category?.description || 'Browse GizPulse opportunities in this category.',
    pathname: `/opportunities/category/${slug}`,
  })
}

export default async function Page({params, searchParams}: Props) {
  const {slug} = await params
  const query = (await searchParams) ?? {}

  return <SectionCategoryPage section="opportunities" slug={slug} page={query.page} />
}
