import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {NewsCategoryPage} from '@/components/NewsCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

type Props = {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = await getCategoryBySlug(slug, 'news')

  return {
    metadataBase: getMetadataBase(),
    title: category ? `${category.title} | News | Techfront` : 'News Category | Techfront',
    description: category?.description || 'Browse Techfront news stories in this category.',
    alternates: {canonical: `/news/category/${slug}`},
  }
}

export default async function Page({params, searchParams}: Props) {
  const {slug} = await params
  const query = (await searchParams) ?? {}
  const category = await getCategoryBySlug(slug, 'news')

  if (!category) notFound()

  return <NewsCategoryPage slug={slug} page={query.page} />
}
