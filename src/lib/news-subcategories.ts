export type NewsSubcategory = {
  slug: 'tech' | 'finance' | 'health-tech' | 'nysc' | 'africa'
  title: string
  primaryCategorySlug: string
  matchCategories: string[]
}

export const NEWS_SUBCATEGORIES: NewsSubcategory[] = [
  {
    slug: 'tech',
    title: 'Artificial Intelligence',
    primaryCategorySlug: 'artificial-intelligence',
    matchCategories: ['Artificial Intelligence', 'Bootcamps', 'Beginner Guides'],
  },
  {
    slug: 'finance',
    title: 'Finance & Money',
    primaryCategorySlug: 'finance',
    matchCategories: ['Finance'],
  },
  {
    slug: 'health-tech',
    title: 'Health Tech',
    primaryCategorySlug: 'health-tech',
    matchCategories: ['Health Tech'],
  },
  {
    slug: 'nysc',
    title: 'NYSC & Education',
    primaryCategorySlug: 'nysc',
    matchCategories: ['NYSC', 'Scholarships'],
  },
  {
    slug: 'africa',
    title: 'Africa Tech',
    primaryCategorySlug: 'africa-tech',
    matchCategories: ['Africa Tech'],
  },
]

export function getNewsSubcategory(slug: NewsSubcategory['slug']) {
  return NEWS_SUBCATEGORIES.find((item) => item.slug === slug)
}
