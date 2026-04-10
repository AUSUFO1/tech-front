type ContentType = 'blog' | 'jobs' | 'opportunities' | 'earn' | 'news'

const newsSlugToPath: Record<string, string> = {
  'artificial-intelligence': '/news/tech',
  finance: '/news/finance',
  nysc: '/news/nysc',
  'africa-tech': '/news/africa',
}

const directSlugToPath: Record<string, string> = {
  'remote-jobs': '/jobs?category=remote-jobs',
  scholarships: '/opportunities?category=scholarships',
  bootcamps: '/opportunities?category=bootcamps',
  'beginner-guides': '/blog?category=beginner-guides',
  'career-growth': '/blog?category=career-growth',
  freelancing: '/earn?category=freelancing',
}

const topicToPath: Record<string, string> = {
  'artificial intelligence': '/news/tech',
  finance: '/news/finance',
  nysc: '/news/nysc',
  'africa tech': '/news/africa',
  'beginner guides': '/blog?category=beginner-guides',
  'career growth': '/blog?category=career-growth',
  freelancing: '/earn?category=freelancing',
  remote: '/jobs?category=remote-jobs',
  scholarship: '/opportunities?category=scholarships',
  scholarships: '/opportunities?category=scholarships',
  bootcamp: '/opportunities?category=bootcamps',
  bootcamps: '/opportunities?category=bootcamps',
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
      return '/blog'
    case 'jobs':
      return '/jobs'
    case 'opportunities':
      return '/opportunities'
    case 'earn':
      return '/earn'
    case 'news':
      return newsSlugToPath[slug] ?? '/news'
    default:
      return '/'
  }
}

export function getTopicHref(topic: string) {
  return topicToPath[topic.trim().toLowerCase()]
}
