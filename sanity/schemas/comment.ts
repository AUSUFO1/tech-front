import {defineField, defineType} from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Blog', value: 'blog'},
          {title: 'Jobs', value: 'jobs'},
          {title: 'Opportunities', value: 'opportunities'},
          {title: 'Earn', value: 'earn'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postSlug',
      title: 'Post Slug',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required().min(5).max(1500),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'ipHash',
      title: 'IP Hash',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'postSlug',
      status: 'status',
    },
    prepare(selection) {
      const {title, subtitle, status} = selection
      return {
        title,
        subtitle: `${subtitle ?? ''} • ${status ?? ''}`,
      }
    },
  },
})
