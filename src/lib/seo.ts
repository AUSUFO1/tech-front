import type {Metadata} from 'next'

type SeoInput = {
  title: string
  excerpt?: string
  coverImageUrl?: string
  publishedAt?: string
  pathname: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    noIndex?: boolean
    ogImageUrl?: string
  }
}

function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)

  return envUrl?.replace(/\/$/, '')
}

export function buildArticleMetadata({title, excerpt, coverImageUrl, publishedAt, pathname, seo}: SeoInput): Metadata {
  const siteUrl = getSiteUrl()
  const metadataBase = siteUrl ? new URL(siteUrl) : undefined
  const resolvedTitle = seo?.metaTitle?.trim() || title
  const description = seo?.metaDescription?.trim() || excerpt || 'Stay Ahead. Stay Informed. Earn with Tech.'
  const canonical = seo?.canonicalUrl?.trim() || (siteUrl ? `${siteUrl}${pathname}` : pathname)
  const image = seo?.ogImageUrl || coverImageUrl

  return {
    metadataBase,
    title: `${resolvedTitle} | GizPulse`,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      type: 'article',
      publishedTime: publishedAt,
      images: image ? [{url: image}] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: resolvedTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

type PageMetadataInput = {
  title: string
  description: string
  pathname: string
  image?: string
  noIndex?: boolean
}

export function buildPageMetadata({title, description, pathname, image, noIndex}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl()
  const metadataBase = siteUrl ? new URL(siteUrl) : undefined
  const canonical = siteUrl ? `${siteUrl}${pathname}` : pathname

  return {
    metadataBase,
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: image ? [{url: image}] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export function getMetadataBase() {
  const siteUrl = getSiteUrl()
  return siteUrl ? new URL(siteUrl) : undefined
}

type StructuredDataInput = {
  kind: 'article' | 'news' | 'job' | 'opportunity'
  title: string
  description?: string
  pathname: string
  image?: string | string[]
  publishedAt?: string
  authorName?: string
  authorPath?: string
  organizationName?: string
  employmentType?: string
  location?: string
  validThrough?: string
}

export function buildStructuredData(input: StructuredDataInput) {
  const siteUrl = getSiteUrl()
  const url = siteUrl ? `${siteUrl}${input.pathname}` : input.pathname
  const images = Array.from(new Set(Array.isArray(input.image) ? input.image : input.image ? [input.image] : []))
  const publisher = {
    '@type': 'Organization',
    name: 'GizPulse',
    ...(siteUrl ? {url: siteUrl} : {}),
  }

  if (input.kind === 'job') {
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: input.title,
      description: input.description,
      datePosted: input.publishedAt,
      validThrough: input.validThrough,
      employmentType: input.employmentType,
      hiringOrganization: {
        '@type': 'Organization',
        name: input.organizationName ?? 'GizPulse',
      },
      jobLocationType: input.location?.toLowerCase() === 'remote' ? 'TELECOMMUTE' : undefined,
      applicantLocationRequirements: input.location
        ? {
            '@type': 'Country',
            name: input.location,
          }
        : undefined,
      image: images.length > 0 ? images : undefined,
      url,
    }
  }

  const articleType = input.kind === 'news' ? 'NewsArticle' : 'Article'

  return {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: input.title,
    description: input.description,
    image: images.length > 0 ? images : undefined,
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    author: input.authorName
      ? {
          '@type': 'Person',
          name: input.authorName,
          ...(input.authorPath && siteUrl ? {url: `${siteUrl}${input.authorPath}`} : {}),
        }
      : undefined,
    publisher,
    mainEntityOfPage: url,
    url,
  }
}
