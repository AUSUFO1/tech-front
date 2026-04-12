'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const previewSecret =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_SECRET ||
      process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ||
      process.env.SANITY_STUDIO_PREVIEW_SECRET ||
      process.env.SANITY_PREVIEW_SECRET
    : process.env.SANITY_STUDIO_PREVIEW_SECRET ||
      process.env.SANITY_PREVIEW_SECRET

const typeToPathPrefix: Record<string, string> = {
  news: '/news',
  blog: '/blog',
  job: '/jobs',
  opportunity: '/opportunities',
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [structureTool({structure})],
  document: {
    productionUrl: async (prev, context) => {
      const doc = context.document
      const slug = (doc?.slug as {current?: string} | undefined)?.current
      const documentType = typeof doc?._type === 'string' ? doc._type : undefined
      const pathPrefix = documentType ? typeToPathPrefix[documentType] : undefined

      if (!slug || !documentType || !pathPrefix) return prev

      const publishedUrl = `${siteUrl}${pathPrefix}/${encodeURIComponent(slug)}`
      if (process.env.NODE_ENV === 'production') return publishedUrl
      if (!previewSecret) return publishedUrl

      const previewPath = `/api/draft/enable?secret=${encodeURIComponent(previewSecret)}&type=${encodeURIComponent(documentType)}&slug=${encodeURIComponent(slug)}`
      return `${siteUrl}${previewPath}`
    },
  },
})
