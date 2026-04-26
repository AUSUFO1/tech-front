export type ContentType = 'blog' | 'jobs' | 'opportunities' | 'earn' | 'news'

export type QuickLink = {
  _id: string
  title: string
  slug: string
  contentType: ContentType
  order: number
}

export type FeaturedNewsItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  commentCount?: number
  publishedAt: string
  slug: string
  authorName: string
  categoryTitle: string
  categorySlug?: string
  coverImageUrl: string
}

export type LatestNewsItem = {
  _id: string
  title: string
  views: number
  commentCount?: number
  publishedAt: string
  slug: string
  authorName: string
}

export type BlogItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  commentCount?: number
  publishedAt: string
  slug: string
  authorName: string
  categoryTitle: string
  categorySlug?: string
  coverImageUrl: string
}

export type JobItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  commentCount?: number
  publishedAt: string
  slug: string
  company: string
  location: string
  remote: boolean
  employmentType: string
  categoryTitle?: string
  categorySlug?: string
}

export type OpportunityItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  commentCount?: number
  publishedAt: string
  slug: string
  organization: string
  location: string
  opportunityType: string
  deadline: string
  categoryTitle?: string
  categorySlug?: string
}
