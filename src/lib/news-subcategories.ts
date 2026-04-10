export type NewsSubcategory = {
  slug: 'tech' | 'finance' | 'health-tech' | 'nysc' | 'africa'
  title: string
  description: string
  matchCategories: string[]
}

export const NEWS_SUBCATEGORIES: NewsSubcategory[] = [
  {
    slug: 'tech',
    title: 'Artificial Intelligence',
    description: 'Everything you need to know about AI tools, platforms, product updates, and practical adoption trends.',
    matchCategories: ['Artificial Intelligence', 'Bootcamps', 'Beginner Guides'],
  },
  {
    slug: 'finance',
    title: 'Finance & Money',
    description: 'Personal finance, digital money behavior, and practical insights for ambitious readers building long-term stability.',
    matchCategories: ['Finance'],
  },
  {
    slug: 'health-tech',
    title: 'Health Tech',
    description: 'Digital health innovation, productivity and wellness tech, and how software is reshaping healthcare experiences.',
    matchCategories: ['Health Tech'],
  },
  {
    slug: 'nysc',
    title: 'NYSC & Education',
    description: 'Corps-member opportunities, training resources, and education-focused updates that support career growth.',
    matchCategories: ['NYSC', 'Scholarships'],
  },
  {
    slug: 'africa',
    title: 'Africa Tech',
    description: 'Startup momentum, hiring shifts, funding moves, and ecosystem stories from across Africa.',
    matchCategories: ['Africa Tech'],
  },
]

export function getNewsSubcategory(slug: NewsSubcategory['slug']) {
  return NEWS_SUBCATEGORIES.find((item) => item.slug === slug)
}
