import type {Metadata} from 'next'
import {NewsCategoryPage} from '@/components/NewsCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('africa-tech', 'news')

  return {
    metadataBase: getMetadataBase(),
    title: category ? `${category.title} | News | Techfront` : 'News Category | Techfront',
    description: category?.description || 'Browse Techfront news stories in this category.',
    alternates: {canonical: '/news/africa'},
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{page?: string}>
}) {
  const params = (await searchParams) ?? {}
  return <NewsCategoryPage slug="africa" page={params.page} />
}
