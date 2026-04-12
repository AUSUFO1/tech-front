import {defineField, defineType} from 'sanity'
import {coverImageField, richBodyField, seoField} from './shared'

export const opportunity = defineType({
  name: 'opportunity',
  title: 'Opportunity',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'organization', title: 'Organization', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'opportunityType', title: 'Opportunity Type', type: 'string', options: {list: ['Scholarship', 'Fellowship', 'Bootcamp', 'Accelerator', 'Training', 'Grant', 'NYSC']}}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'deadline', title: 'Deadline', type: 'datetime'}),
    defineField({name: 'applicationUrl', title: 'Application URL', type: 'url', validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().min(20).max(220)}),
    coverImageField,
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'views', title: 'Views', type: 'number', initialValue: 0}),
    richBodyField,
    seoField,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'organization',
    },
  },
})
