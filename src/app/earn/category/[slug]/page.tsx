import type {Metadata} from 'next'
import {SectionCategoryPage} from '@/components/SectionCategoryPage'
import {getCategoryBySlug} from '@/lib/content'
import {getMetadataBase} from '@/lib/seo'

type Props = {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = await getCategoryBySlug(slug, 'earn')

  return {
    metadataBase: getMetadataBase(),
    title: category ? `${category.title} | Earn | Techfront` : 'Earn Category | Techfront',
    description: category?.description || 'Browse Techfront earn stories in this category.',
    alternates: {canonical: `/earn/category/${slug}`},
  }
}

export default async function Page({params, searchParams}: Props) {
  const {slug} = await params
  const query = (await searchParams) ?? {}

  return <SectionCategoryPage section="earn" slug={slug} page={query.page} />
}
