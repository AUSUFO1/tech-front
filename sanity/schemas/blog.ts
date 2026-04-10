import {defineField, defineType} from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3}),
    defineField({name: 'coverImage', title: 'Cover Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'trending', title: 'Trending', type: 'boolean', initialValue: false}),
    defineField({name: 'views', title: 'Views', type: 'number', initialValue: 0}),
    defineField({name: 'body', title: 'Body', type: 'array', of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}], validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.name',
      media: 'coverImage',
    },
  },
})