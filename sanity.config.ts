'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const isDevelopment = process.env.NODE_ENV === 'development'
const previewSecret = process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_SECRET || process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET

const typeToPathPrefix: Record<string, string> = {
  news: '/news',
  blog: '/blog',
  job: '/jobs',
  opportunity: '/opportunities',
}

async function resolvePathPrefix(documentType: string, doc: unknown, context: {getClient?: (options: {apiVersion: string}) => {fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>}}) {
  if (documentType !== 'blog') return typeToPathPrefix[documentType]

  const categoryRef = (doc as {category?: {_ref?: string}} | undefined)?.category?._ref
  if (!categoryRef || typeof context.getClient !== 'function') return typeToPathPrefix[documentType]

  const id = categoryRef.replace(/^drafts\./, '')
  const client = context.getClient({apiVersion})
  const category = await client.fetch<{contentType?: string} | null>(
    `*[_type == "category" && _id in [$publishedId, $draftId]][0]{contentType}`,
    {publishedId: id, draftId: `drafts.${id}`}
  )

  return category?.contentType === 'earn' ? '/earn' : typeToPathPrefix[documentType]
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
      const pathPrefix = documentType ? await resolvePathPrefix(documentType, doc, context) : undefined

      if (!slug || !documentType || !pathPrefix) return prev

      const publishedUrl = `${siteUrl}${pathPrefix}/${encodeURIComponent(slug)}`
      if (!isDevelopment && !previewSecret) return publishedUrl

      const previewPath = isDevelopment
        ? `/api/draft/enable?type=${encodeURIComponent(documentType)}&slug=${encodeURIComponent(slug)}`
        : `/api/draft/enable?secret=${encodeURIComponent(previewSecret ?? '')}&type=${encodeURIComponent(documentType)}&slug=${encodeURIComponent(slug)}`
      return `${siteUrl}${previewPath}`
    },
  },
})
