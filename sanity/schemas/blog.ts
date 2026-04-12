import {defineField, defineType} from 'sanity'
import {coverImageField, richBodyField, seoField} from './shared'

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().min(20).max(220)}),
    coverImageField,
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'trending', title: 'Trending', type: 'boolean', initialValue: false}),
    defineField({name: 'views', title: 'Views', type: 'number', initialValue: 0}),
    richBodyField,
    seoField,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.name',
      media: 'coverImage',
    },
  },
})
