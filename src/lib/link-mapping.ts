type ContentType = 'blog' | 'jobs' | 'opportunities' | 'earn' | 'news'

const directSlugToPath: Record<string, string> = {
  'remote-jobs': '/jobs/category/remote-jobs',
  scholarships: '/opportunities/category/scholarships',
  bootcamps: '/opportunities/category/bootcamps',
  'beginner-guides': '/blog/category/beginner-guides',
  'career-growth': '/earn/category/career-growth',
  freelancing: '/earn/category/freelancing',
}

const topicToPath: Record<string, string> = {
  'artificial intelligence': '/news/category/artificial-intelligence',
  finance: '/news/category/finance',
  nysc: '/blog/category/nysc',
  'africa tech': '/news/category/africa-tech',
  naija: '/news/category/naija',
  'beginner guides': '/blog/category/beginner-guides',
  'career growth': '/earn/category/career-growth',
  freelancing: '/earn/category/freelancing',
  remote: '/jobs/category/remote-jobs',
  scholarship: '/opportunities/category/scholarships',
  scholarships: '/opportunities/category/scholarships',
  bootcamp: '/opportunities/category/bootcamps',
  bootcamps: '/opportunities/category/bootcamps',
  internship: '/jobs',
  'full-time': '/jobs',
  'part-time': '/jobs',
  contract: '/jobs',
  temporary: '/jobs',
  fellowship: '/opportunities',
  accelerator: '/opportunities',
  training: '/opportunities',
  grant: '/opportunities',
  opportunities: '/opportunities',
  careers: '/jobs',
}

export function getQuickLinkHref(slug: string, contentType: ContentType) {
  const mappedDirectPath = directSlugToPath[slug]
  if (mappedDirectPath) return mappedDirectPath

  switch (contentType) {
    case 'blog':
      return `/blog/category/${slug}`
    case 'jobs':
      return `/jobs/category/${slug}`
    case 'opportunities':
      return `/opportunities/category/${slug}`
    case 'earn':
      return `/earn/category/${slug}`
    case 'news':
      return `/news/category/${slug}`
    default:
      return '/'
  }
}

export function getTopicHref(topic: string) {
  return topicToPath[topic.trim().toLowerCase()]
}

function slugifyLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCategoryHrefFromLabel(label: string, contentType: ContentType) {
  return getQuickLinkHref(slugifyLabel(label), contentType)
}
