import type {Metadata} from 'next'
import {NewsCategoryPage} from '@/components/NewsCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('nysc', 'news')

  return {
    metadataBase: getMetadataBase(),
    title: category ? `${category.title} | News | GizPulse` : 'News Category | GizPulse',
    description: category?.description || 'Browse GizPulse news stories in this category.',
    alternates: {canonical: '/news/nysc'},
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{page?: string}>
}) {
  const params = (await searchParams) ?? {}
  return <NewsCategoryPage slug="nysc" page={params.page} />
}
