import {groq} from 'next-sanity'

export const homepageQuery = groq`
{
  "quickLinks": *[_type == "category" && featuredOnHome == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    contentType,
    order
  },
  "featuredNews": *[_type == "news"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    excerpt,
    views,
    publishedAt,
    "slug": slug.current,
    "authorName": author->name,
    "categoryTitle": category->title,
    coverImage
  },
  "latestNews": *[_type == "news" && trending == true] | order(publishedAt desc)[0...5] {
    _id,
    title,
    views,
    publishedAt,
    "slug": slug.current,
    "authorName": author->name
  },
  "latestBlog": *[_type == "blog"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    excerpt,
    views,
    publishedAt,
    "slug": slug.current,
    "authorName": author->name,
    "categoryTitle": category->title,
    coverImage
  },
  "latestJobs": *[_type == "job"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    excerpt,
    views,
    publishedAt,
    "slug": slug.current,
    company,
    location,
    remote,
    employmentType
  },
  "latestOpportunities": *[_type == "opportunity"] | order(coalesce(deadline, _createdAt) asc)[0...3] {
    _id,
    title,
    excerpt,
    views,
    "slug": slug.current,
    organization,
    location,
    opportunityType,
    deadline
  }
}
`