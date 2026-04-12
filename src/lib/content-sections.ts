export const EARN_CATEGORY_TITLES = ['Freelancing', 'Career Growth'] as const

export function isEarnCategory(categoryTitle?: string) {
  return EARN_CATEGORY_TITLES.includes((categoryTitle ?? '') as (typeof EARN_CATEGORY_TITLES)[number])
}
