import {groq} from 'next-sanity'
import {draftMode} from 'next/headers'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {
  type QuickLink,
  type BlogItem,
  type FeaturedNewsItem,
  type JobItem,
  type LatestNewsItem,
  type OpportunityItem,
} from '@/lib/content-types'
import {isEarnCategory} from '@/lib/content-sections'

const previewToken = process.env.SANITY_API_TOKEN

async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  const {isEnabled} = await draftMode()
  const readClient =
    isEnabled && previewToken
      ? client.withConfig({useCdn: false, perspective: 'drafts', token: previewToken})
      : client

  return readClient.fetch<T>(query, params)
}

type PortableTextSpan = {
  _type: 'span'
  _key?: string
  text?: string
  marks?: string[]
}

type PortableTextMarkDef = {
  _key: string
  _type: string
  href?: string
}

type PortableTextBlock = {
  _type: 'block'
  _key?: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  children?: PortableTextSpan[]
  markDefs?: PortableTextMarkDef[]
}

type PortableTextImage = {
  _type: 'image'
  _key?: string
  alt?: string
  caption?: string
  credit?: string
  sourceUrl?: string
  asset?: unknown
}

type PortableTextTableRow = {
  _key?: string
  cells?: string[]
}

type PortableTextTable = {
  _type: 'tableBlock'
  _key?: string
  caption?: string
  headerRow?: boolean
  rows?: PortableTextTableRow[]
}

export type PortableContentNode = PortableTextBlock | PortableTextImage | PortableTextTable

export type SeoFields = {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  noIndex?: boolean
  ogImageUrl?: string
}

type SharedContentExtras = {
  body?: PortableContentNode[]
  authorSlug?: string
  categorySlug?: string
  coverImageAlt?: string
  coverImageCaption?: string
  coverImageCredit?: string
  coverImageSourceUrl?: string
  seo?: SeoFields
}

export type NewsContentItem = FeaturedNewsItem & SharedContentExtras
export type BlogContentItem = BlogItem & SharedContentExtras
export type JobContentItem = JobItem &
  SharedContentExtras & {
    coverImageUrl: string
    applicationUrl?: string
    categoryTitle?: string
  }
export type OpportunityContentItem = OpportunityItem &
  SharedContentExtras & {
    coverImageUrl: string
    applicationUrl?: string
    categoryTitle?: string
  }

type SanityImageLike = {
  asset?: unknown
  alt?: string
  caption?: string
  credit?: string
  sourceUrl?: string
}

type SanityCategory = {
  _id: string
  title: string
  slug?: string
  contentType: QuickLink['contentType']
  description?: string
  order?: number
}

type SanityAuthor = {
  _id: string
  name: string
  slug?: string
  title?: string
  bio?: string
  image?: SanityImageLike
}

type SanityContentBase = {
  _id: string
  title: string
  excerpt?: string
  slug?: string
  views?: number
  commentCount?: number
  publishedAt?: string
  deadline?: string
  author?: SanityAuthor | null
  category?: SanityCategory | null
  coverImage?: SanityImageLike
  body?: PortableContentNode[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    noIndex?: boolean
    ogImage?: SanityImageLike
  }
}

type SanityNews = SanityContentBase
type SanityBlog = SanityContentBase
type SanityJob = SanityContentBase & {
  company: string
  location?: string
  remote?: boolean
  employmentType?: string
  applicationUrl?: string
}
type SanityOpportunity = SanityContentBase & {
  organization: string
  location?: string
  opportunityType?: string
  applicationUrl?: string
}

type HomepagePayload = {
  quickLinks?: SanityCategory[]
  featuredNews?: SanityNews[]
  latestNews?: SanityNews[]
  latestBlog?: SanityBlog[]
  latestJobs?: SanityJob[]
  latestOpportunities?: SanityOpportunity[]
}

type AuthoredItem = {
  _id: string
  type: 'News' | 'Blog' | 'Earn'
  title: string
  excerpt: string
  publishedAt: string
  views: number
  href: string
}

type AuthorListItem = {
  _id: string
  name: string
  slug: string
  title: string
  bio: string
  imageUrl: string
}

export type SitemapEntry = {
  url: string
  lastModified: string
  images?: string[]
}

function getCategoryPath(contentType: QuickLink['contentType'], slug: string) {
  return `/${contentType}/category/${slug}`
}

function getCategorySitemapPath(item: SanityCategory) {
  if (isEarnCategory(item.title)) {
    return `/earn/category/${item.slug}`
  }

  return getCategoryPath(item.contentType, item.slug ?? '')
}

function toImageUrl(image?: SanityImageLike | null) {
  if (!image?.asset) return undefined

  try {
    return urlFor(image).width(1600).fit('max').auto('format').url()
  } catch {
    return undefined
  }
}

export function getContentImageUrls(body?: PortableContentNode[], coverImageUrl?: string) {
  const urls = [
    coverImageUrl,
    ...(body ?? []).flatMap((node) => {
      if (node._type !== 'image') return []
      const imageUrl = toImageUrl(node)
      return imageUrl ? [imageUrl] : []
    }),
  ].filter((url): url is string => Boolean(url))

  return Array.from(new Set(urls))
}

function mapQuickLinks(items?: SanityCategory[]): QuickLink[] {
  if (!items?.length) return []

  return items.map((item, index) => ({
    _id: item._id,
    title: item.title,
    slug: item.slug ?? '',
    contentType: item.contentType,
    order: item.order ?? index,
  }))
}

function mapSeo(seo?: SanityContentBase['seo']): SeoFields | undefined {
  if (!seo) return undefined

  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    canonicalUrl: seo.canonicalUrl,
    noIndex: seo.noIndex,
    ogImageUrl: seo.ogImage ? toImageUrl(seo.ogImage) : undefined,
  }
}

function mapFeaturedNews(items?: SanityNews[]): NewsContentItem[] {
  if (!items?.length) return []

  return items.map((item) => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    views: item.views ?? 0,
    commentCount: item.commentCount ?? 0,
    publishedAt: item.publishedAt ?? '',
    slug: item.slug ?? '',
    authorName: item.author?.name ?? 'GizPulse Editorial',
    authorSlug: item.author?.slug ?? '',
    categoryTitle: item.category?.title ?? 'News',
    categorySlug: item.category?.slug ?? '',
    coverImageUrl: toImageUrl(item.coverImage) ?? '',
    coverImageAlt: item.coverImage?.alt,
    coverImageCaption: item.coverImage?.caption,
    coverImageCredit: item.coverImage?.credit,
    coverImageSourceUrl: item.coverImage?.sourceUrl,
    body: item.body,
    seo: mapSeo(item.seo),
  }))
}

function mapLatestNews(items?: SanityNews[]): LatestNewsItem[] {
  return mapFeaturedNews(items).map((item) => ({
    _id: item._id,
    title: item.title,
    views: item.views,
    commentCount: item.commentCount,
    publishedAt: item.publishedAt,
    slug: item.slug,
    authorName: item.authorName,
  }))
}

function mapBlog(items?: SanityBlog[]): BlogContentItem[] {
  if (!items?.length) return []

  return items.map((item) => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    views: item.views ?? 0,
    commentCount: item.commentCount ?? 0,
    publishedAt: item.publishedAt ?? '',
    slug: item.slug ?? '',
    authorName: item.author?.name ?? 'GizPulse Editorial',
    authorSlug: item.author?.slug ?? '',
    categoryTitle: item.category?.title ?? 'Blog',
    categorySlug: item.category?.slug ?? '',
    coverImageUrl: toImageUrl(item.coverImage) ?? '',
    coverImageAlt: item.coverImage?.alt,
    coverImageCaption: item.coverImage?.caption,
    coverImageCredit: item.coverImage?.credit,
    coverImageSourceUrl: item.coverImage?.sourceUrl,
    body: item.body,
    seo: mapSeo(item.seo),
  }))
}

function mapJobs(items?: SanityJob[]): JobContentItem[] {
  if (!items?.length) return []

  return items.map((item) => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    views: item.views ?? 0,
    commentCount: item.commentCount ?? 0,
    publishedAt: item.publishedAt ?? '',
    slug: item.slug ?? '',
    company: item.company,
    location: item.location ?? 'Remote',
    remote: Boolean(item.remote),
    employmentType: item.employmentType ?? 'Full-time',
    categoryTitle: item.category?.title ?? item.employmentType ?? 'Jobs',
    categorySlug: item.category?.slug ?? '',
    coverImageUrl: toImageUrl(item.coverImage) ?? '',
    coverImageAlt: item.coverImage?.alt,
    coverImageCaption: item.coverImage?.caption,
    coverImageCredit: item.coverImage?.credit,
    coverImageSourceUrl: item.coverImage?.sourceUrl,
    applicationUrl: item.applicationUrl,
    body: item.body,
    seo: mapSeo(item.seo),
  }))
}

function mapOpportunities(items?: SanityOpportunity[]): OpportunityContentItem[] {
  if (!items?.length) return []

  return items.map((item) => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    views: item.views ?? 0,
    commentCount: item.commentCount ?? 0,
    publishedAt: item.publishedAt ?? '',
    slug: item.slug ?? '',
    organization: item.organization,
    location: item.location ?? 'Remote',
    opportunityType: item.opportunityType ?? 'Opportunity',
    deadline: item.deadline ?? '',
    categoryTitle: item.category?.title ?? item.opportunityType ?? 'Opportunities',
    categorySlug: item.category?.slug ?? '',
    coverImageUrl: toImageUrl(item.coverImage) ?? '',
    coverImageAlt: item.coverImage?.alt,
    coverImageCaption: item.coverImage?.caption,
    coverImageCredit: item.coverImage?.credit,
    coverImageSourceUrl: item.coverImage?.sourceUrl,
    applicationUrl: item.applicationUrl,
    body: item.body,
    seo: mapSeo(item.seo),
  }))
}

const homepageQuery = groq`
{
  "quickLinks": *[_type == "category" && featuredOnHome == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    contentType,
    order
  },
  "featuredNews": *[_type == "news"] | order(featured desc, publishedAt desc)[0...4] {
    _id,
    title,
    excerpt,
    views,
    "commentCount": count(*[_type == "comment" && postType == "news" && postSlug == ^.slug.current && status == "approved"]),
    publishedAt,
    "slug": slug.current,
    author->{_id, name, "slug": slug.current},
    category->{_id, title, "slug": slug.current, contentType},
    coverImage,
    body,
    seo
  },
  "latestNews": *[_type == "news"] | order(publishedAt desc)[0...10] {
    _id,
    title,
    excerpt,
    views,
    "commentCount": count(*[_type == "comment" && postType == "news" && postSlug == ^.slug.current && status == "approved"]),
    publishedAt,
    "slug": slug.current,
    author->{_id, name, "slug": slug.current},
    category->{_id, title, "slug": slug.current, contentType},
    coverImage,
    body,
    seo
  },
  "latestBlog": *[_type == "blog"] | order(publishedAt desc)[0...10] {
    _id,
    title,
    excerpt,
    views,
    "commentCount": count(*[_type == "comment" && postType == "blog" && postSlug == ^.slug.current && status == "approved"]),
    publishedAt,
    "slug": slug.current,
    author->{_id, name, "slug": slug.current},
    category->{_id, title, "slug": slug.current, contentType},
    coverImage,
    body,
    seo
  },
  "latestJobs": *[_type == "job"] | order(publishedAt desc)[0...10] {
    _id,
    title,
    excerpt,
    views,
    "commentCount": count(*[_type == "comment" && postType == "jobs" && postSlug == ^.slug.current && status == "approved"]),
    publishedAt,
    "slug": slug.current,
    company,
    location,
    remote,
    employmentType,
    applicationUrl,
    category->{_id, title, "slug": slug.current, contentType},
    coverImage,
    body,
    seo
  },
  "latestOpportunities": *[_type == "opportunity"] | order(coalesce(publishedAt, _createdAt) desc)[0...10] {
    _id,
    title,
    excerpt,
    views,
    "commentCount": count(*[_type == "comment" && postType == "opportunities" && postSlug == ^.slug.current && status == "approved"]),
    "publishedAt": coalesce(publishedAt, _createdAt),
    deadline,
    "slug": slug.current,
    organization,
    location,
    opportunityType,
    applicationUrl,
    category->{_id, title, "slug": slug.current, contentType},
    coverImage,
    body,
    seo
  }
}
`

const navigationCategoriesQuery = groq`
*[_type == "category"] | order(contentType asc, order asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  contentType,
  description,
  order
}
`

const categoryBySlugQuery = groq`
*[_type == "category" && contentType == $contentType && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  contentType,
  description,
  order
}
`

const authorsQuery = groq`
*[_type == "author"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  title,
  bio,
  image
}
`

const authorBySlugQuery = groq`
*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  title,
  bio,
  image
}
`

const searchQuery = groq`
{
  "news": *[_type == "news"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current
  },
  "blog": *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current
  },
  "jobs": *[_type == "job"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current
  },
  "opportunities": *[_type == "opportunity"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current
  }
}
`

const sitemapContentQuery = groq`
{
  "news": *[_type == "news" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, publishedAt),
    coverImage,
    body
  },
  "blog": *[_type == "blog" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, publishedAt),
    "categoryTitle": category->title,
    coverImage,
    body
  },
  "jobs": *[_type == "job" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, publishedAt),
    coverImage,
    body
  },
  "opportunities": *[_type == "opportunity" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, publishedAt, _createdAt),
    coverImage,
    body
  }
}
`

const recentNewsSitemapQuery = groq`
*[
  _type == "news" &&
  defined(slug.current) &&
  defined(publishedAt)
] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  "lastModified": coalesce(_updatedAt, publishedAt)
}
`

const allNewsQuery = groq`
*[_type == "news"] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "news" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  author->{_id, name, "slug": slug.current},
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const newsBySlugQuery = groq`
*[_type == "news" && slug.current == $slug][0] {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "news" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  author->{_id, name, "slug": slug.current},
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const allBlogQuery = groq`
*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "blog" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  author->{_id, name, "slug": slug.current},
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const blogBySlugQuery = groq`
*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "blog" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  author->{_id, name, "slug": slug.current},
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const allJobsQuery = groq`
*[_type == "job"] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "jobs" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  company,
  location,
  remote,
  employmentType,
  applicationUrl,
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const jobBySlugQuery = groq`
*[_type == "job" && slug.current == $slug][0] {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "jobs" && postSlug == ^.slug.current && status == "approved"]),
  publishedAt,
  "slug": slug.current,
  company,
  location,
  remote,
  employmentType,
  applicationUrl,
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const allOpportunitiesQuery = groq`
*[_type == "opportunity"] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "opportunities" && postSlug == ^.slug.current && status == "approved"]),
  "publishedAt": coalesce(publishedAt, _createdAt),
  deadline,
  "slug": slug.current,
  organization,
  location,
  opportunityType,
  applicationUrl,
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const opportunityBySlugQuery = groq`
*[_type == "opportunity" && slug.current == $slug][0] {
  _id,
  title,
  excerpt,
  views,
  "commentCount": count(*[_type == "comment" && postType == "opportunities" && postSlug == ^.slug.current && status == "approved"]),
  "publishedAt": coalesce(publishedAt, _createdAt),
  deadline,
  "slug": slug.current,
  organization,
  location,
  opportunityType,
  applicationUrl,
  category->{_id, title, "slug": slug.current, contentType},
  coverImage,
  body,
  seo
}
`

const authoredContentQuery = groq`
{
  "news": *[_type == "news" && author->slug.current == $slug] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    views,
    publishedAt,
    "slug": slug.current
  },
  "blog": *[_type == "blog" && author->slug.current == $slug] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    views,
    publishedAt,
    "slug": slug.current,
    "categoryTitle": category->title
  }
}
`

export async function getHomepageContent(): Promise<{
  quickLinks: QuickLink[]
  featuredNews: NewsContentItem[]
  latestNews: LatestNewsItem[]
  latestBlog: BlogContentItem[]
  latestJobs: JobContentItem[]
  latestOpportunities: OpportunityContentItem[]
}> {
  try {
    const data = await sanityFetch<HomepagePayload>(homepageQuery)

    return {
      quickLinks: mapQuickLinks(data.quickLinks),
      featuredNews: mapFeaturedNews(data.featuredNews),
      latestNews: mapLatestNews(data.latestNews),
      latestBlog: mapBlog(data.latestBlog),
      latestJobs: mapJobs(data.latestJobs),
      latestOpportunities: mapOpportunities(data.latestOpportunities),
    }
  } catch {
    return {
      quickLinks: [],
      featuredNews: [],
      latestNews: [],
      latestBlog: [],
      latestJobs: [],
      latestOpportunities: [],
    }
  }
}

export async function getNavigationQuickLinks(): Promise<QuickLink[]> {
  try {
    const items = await sanityFetch<SanityCategory[]>(navigationCategoriesQuery)
    return mapQuickLinks(items)
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string, contentType: QuickLink['contentType']) {
  try {
    return await sanityFetch<SanityCategory | null>(categoryBySlugQuery, {slug, contentType})
  } catch {
    return null
  }
}

export async function getCategoriesByContentType(contentType: QuickLink['contentType']) {
  try {
    const items = await sanityFetch<SanityCategory[]>(navigationCategoriesQuery)
    return items.filter((item) => item.contentType === contentType)
  } catch {
    return []
  }
}

export async function getNewsContent(): Promise<{
  featuredNews: NewsContentItem[]
  latestNews: LatestNewsItem[]
}> {
  try {
    const items = await sanityFetch<SanityNews[]>(allNewsQuery)
    return {
      featuredNews: mapFeaturedNews(items),
      latestNews: mapLatestNews(items),
    }
  } catch {
    return {
      featuredNews: [],
      latestNews: [],
    }
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsContentItem | null> {
  try {
    const item = await sanityFetch<SanityNews | null>(newsBySlugQuery, {slug})
    return item ? mapFeaturedNews([item])[0] : null
  } catch {
    return null
  }
}

export async function getBlogContent(): Promise<BlogContentItem[]> {
  try {
    const items = await sanityFetch<SanityBlog[]>(allBlogQuery)
    return mapBlog(items)
  } catch {
    return []
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogContentItem | null> {
  try {
    const item = await sanityFetch<SanityBlog | null>(blogBySlugQuery, {slug})
    return item ? mapBlog([item])[0] : null
  } catch {
    return null
  }
}

export async function getJobsContent(): Promise<JobContentItem[]> {
  try {
    const items = await sanityFetch<SanityJob[]>(allJobsQuery)
    return mapJobs(items)
  } catch {
    return []
  }
}

export async function getJobBySlug(slug: string): Promise<JobContentItem | null> {
  try {
    const item = await sanityFetch<SanityJob | null>(jobBySlugQuery, {slug})
    return item ? mapJobs([item])[0] : null
  } catch {
    return null
  }
}

export async function getOpportunitiesContent(): Promise<OpportunityContentItem[]> {
  try {
    const items = await sanityFetch<SanityOpportunity[]>(allOpportunitiesQuery)
    return mapOpportunities(items)
  } catch {
    return []
  }
}

export async function getOpportunityBySlug(slug: string): Promise<OpportunityContentItem | null> {
  try {
    const item = await sanityFetch<SanityOpportunity | null>(opportunityBySlugQuery, {slug})
    return item ? mapOpportunities([item])[0] : null
  } catch {
    return null
  }
}

export async function getAuthorsContent(): Promise<AuthorListItem[]> {
  try {
    const items = await sanityFetch<SanityAuthor[]>(authorsQuery)
    if (!items?.length) return []

    return items
      .map((item) => ({
        _id: item._id,
        name: item.name,
        slug: item.slug ?? '',
        title: item.title ?? '',
        bio: item.bio ?? '',
        imageUrl: toImageUrl(item.image) ?? '',
      }))
      .filter((item) => item.slug && item.title.trim() && item.bio.trim() && item.imageUrl)
  } catch {
    return []
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const item = await sanityFetch<SanityAuthor | null>(authorBySlugQuery, {slug})
    if (!item) return null

    return {
      _id: item._id,
      name: item.name,
      slug: item.slug ?? '',
      title: item.title ?? '',
      bio: item.bio ?? '',
      imageUrl: toImageUrl(item.image) ?? '',
    }
  } catch {
    return null
  }
}

export async function getAuthoredItems(slug: string): Promise<AuthoredItem[]> {
  try {
    const data = await sanityFetch<{
      news?: Array<{_id: string; title: string; excerpt?: string; views?: number; publishedAt?: string; slug?: string}>
      blog?: Array<{_id: string; title: string; excerpt?: string; views?: number; publishedAt?: string; slug?: string; categoryTitle?: string}>
    }>(authoredContentQuery, {slug})

    const items: AuthoredItem[] = [
      ...(data.news ?? []).map((item) => ({
        _id: `news-${item._id}`,
        type: 'News' as const,
        title: item.title,
        excerpt: item.excerpt ?? '',
        publishedAt: item.publishedAt ?? '',
        views: item.views ?? 0,
        href: `/news/${item.slug ?? ''}`,
      })),
      ...(data.blog ?? []).map((item) => ({
        _id: `blog-${item._id}`,
        type: isEarnCategory(item.categoryTitle) ? ('Earn' as const) : ('Blog' as const),
        title: item.title,
        excerpt: item.excerpt ?? '',
        publishedAt: item.publishedAt ?? '',
        views: item.views ?? 0,
        href: `${isEarnCategory(item.categoryTitle) ? '/earn' : '/blog'}/${item.slug ?? ''}`,
      })),
    ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return items
  } catch {
    return []
  }
}

export async function getSearchContent(): Promise<{
  news: NewsContentItem[]
  blog: BlogContentItem[]
  jobs: JobContentItem[]
  opportunities: OpportunityContentItem[]
}> {
  try {
    const data = await sanityFetch<{
      news?: SanityNews[]
      blog?: SanityBlog[]
      jobs?: SanityJob[]
      opportunities?: SanityOpportunity[]
    }>(searchQuery)

    return {
      news: mapFeaturedNews(data.news),
      blog: mapBlog(data.blog),
      jobs: mapJobs(data.jobs),
      opportunities: mapOpportunities(data.opportunities),
    }
  } catch {
    return {
      news: [],
      blog: [],
      jobs: [],
      opportunities: [],
    }
  }
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const data = await sanityFetch<{
      news?: Array<{slug?: string; lastModified?: string; coverImage?: SanityImageLike; body?: PortableContentNode[]}>
      blog?: Array<{slug?: string; lastModified?: string; categoryTitle?: string; coverImage?: SanityImageLike; body?: PortableContentNode[]}>
      jobs?: Array<{slug?: string; lastModified?: string; coverImage?: SanityImageLike; body?: PortableContentNode[]}>
      opportunities?: Array<{slug?: string; lastModified?: string; coverImage?: SanityImageLike; body?: PortableContentNode[]}>
    }>(sitemapContentQuery)

    return [
      ...(data.news ?? []).flatMap((item) =>
        item.slug
          ? [{
              url: `/news/${item.slug}`,
              lastModified: item.lastModified ?? new Date().toISOString(),
              images: getContentImageUrls(item.body, toImageUrl(item.coverImage)),
            }]
          : []
      ),
      ...(data.blog ?? []).flatMap((item) => {
        if (!item.slug) return []
        const isEarn = ['Freelancing', 'Career Growth'].includes(item.categoryTitle ?? '')
        return [{
          url: `${isEarn ? '/earn' : '/blog'}/${item.slug}`,
          lastModified: item.lastModified ?? new Date().toISOString(),
          images: getContentImageUrls(item.body, toImageUrl(item.coverImage)),
        }]
      }),
      ...(data.jobs ?? []).flatMap((item) =>
        item.slug
          ? [{
              url: `/jobs/${item.slug}`,
              lastModified: item.lastModified ?? new Date().toISOString(),
              images: getContentImageUrls(item.body, toImageUrl(item.coverImage)),
            }]
          : []
      ),
      ...(data.opportunities ?? []).flatMap((item) =>
        item.slug
          ? [{
              url: `/opportunities/${item.slug}`,
              lastModified: item.lastModified ?? new Date().toISOString(),
              images: getContentImageUrls(item.body, toImageUrl(item.coverImage)),
            }]
          : []
      ),
    ]
  } catch {
    return []
  }
}

export async function getCategorySitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const items = await sanityFetch<SanityCategory[]>(navigationCategoriesQuery)

    return items.flatMap((item) => {
      if (!item.slug || !item.contentType) return []

      return [{
        url: getCategorySitemapPath(item),
        lastModified: new Date().toISOString(),
      }]
    })
  } catch {
    return []
  }
}

export async function getRecentNewsSitemapEntries(): Promise<Array<{title: string; slug: string; publishedAt: string; lastModified: string}>> {
  try {
    const items = await sanityFetch<Array<{title?: string; slug?: string; publishedAt?: string; lastModified?: string}>>(recentNewsSitemapQuery)
    const cutoff = Date.now() - 48 * 60 * 60 * 1000

    return items
      .flatMap((item) => {
        if (!item.slug || !item.title || !item.publishedAt) return []

        const publishedAtTime = new Date(item.publishedAt).getTime()
        if (!Number.isFinite(publishedAtTime) || publishedAtTime < cutoff) return []

        return [{
          title: item.title,
          slug: item.slug,
          publishedAt: item.publishedAt,
          lastModified: item.lastModified ?? item.publishedAt,
        }]
      })
      .slice(0, 1000)
  } catch {
    return []
  }
}

