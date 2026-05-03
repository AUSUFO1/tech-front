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
  const category = await getCategoryBySlug(slug, 'jobs')

  return buildPageMetadata({
    title: category ? `${category.title} | Jobs | GizPulse` : 'Jobs Category | GizPulse',
    description: category?.description || 'Browse GizPulse jobs in this category.',
    pathname: `/jobs/category/${slug}`,
  })
}

export default async function Page({params, searchParams}: Props) {
  const {slug} = await params
  const query = (await searchParams) ?? {}

  return <SectionCategoryPage section="jobs" slug={slug} page={query.page} />
}
