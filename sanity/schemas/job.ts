import {defineField, defineType} from 'sanity'
import {coverImageField, richBodyField, seoField} from './shared'

export const job = defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'company', title: 'Company', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'remote', title: 'Remote', type: 'boolean', initialValue: false}),
    defineField({name: 'employmentType', title: 'Employment Type', type: 'string', options: {list: ['Full-time', 'Part-time', 'Contract', 'Internship', 'NYSC', 'Temporary']}}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().min(20).max(220)}),
    coverImageField,
    defineField({name: 'applicationUrl', title: 'Application URL', type: 'url', validation: (Rule) => Rule.required()}),
    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'views', title: 'Views', type: 'number', initialValue: 0}),
    richBodyField,
    seoField,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
    },
  },
})
