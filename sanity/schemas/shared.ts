import {defineArrayMember, defineField} from 'sanity'

export const coverImageField = defineField({
  name: 'coverImage',
  title: 'Cover Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(160),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'credit',
      title: 'Image Credit',
      type: 'string',
      description: 'Example: Photo by Annie Spratt / Unsplash',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Image Source URL',
      type: 'url',
    }),
  ],
})

export const richBodyField = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({type: 'block'}),
    defineArrayMember({
      name: 'tableBlock',
      title: 'Table',
      type: 'object',
      fields: [
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'headerRow',
          title: 'First Row Is Header',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'tableRow',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [{type: 'string'}],
                  validation: (Rule) => Rule.required().min(1),
                }),
              ],
              preview: {
                select: {
                  cells: 'cells',
                },
                prepare(selection) {
                  const cells = Array.isArray(selection.cells) ? selection.cells : []
                  return {
                    title: cells.join(' | '),
                  }
                },
              },
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      preview: {
        select: {
          caption: 'caption',
          rows: 'rows',
        },
        prepare(selection) {
          const rows = Array.isArray(selection.rows) ? selection.rows.length : 0
          return {
            title: selection.caption || 'Table',
            subtitle: `${rows} row${rows === 1 ? '' : 's'}`,
          }
        },
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().min(5).max(160),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'credit',
          title: 'Image Credit',
          type: 'string',
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Image Source URL',
          type: 'url',
        }),
      ],
    }),
  ],
})

export const seoField = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Optional override. Leave blank to use the article title automatically. Recommended: 50 to 60 characters.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Optional override. Leave blank to use the article excerpt automatically. Recommended: 140 to 160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Optional override. Leave blank to use the cover image for social sharing automatically.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
        defineField({
          name: 'credit',
          title: 'Image Credit',
          type: 'string',
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Image Source URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional. Leave blank for GizPulse to use the page URL automatically.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      description: 'Leave off for normal published articles. Turn on only if you explicitly do not want this page indexed by search engines.',
    }),
  ],
})
