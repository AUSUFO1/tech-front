import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

function buildTargetPath(pathname?: string | null, type?: string | null, slug?: string | null) {
  if (pathname && pathname.startsWith('/')) return pathname
  if (!slug) return '/'

  const encodedSlug = encodeURIComponent(slug)
  const sectionMap: Record<string, string> = {
    news: 'news',
    blog: 'blog',
    job: 'jobs',
    opportunity: 'opportunities',
  }

  const section = type ? sectionMap[type] : undefined
  return section ? `/${section}/${encodedSlug}` : '/'
}

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url)
  const secret = searchParams.get('secret')
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const path = searchParams.get('path')

  const isDevelopment = process.env.NODE_ENV === 'development'
  const expectedSecret = process.env.SANITY_PREVIEW_SECRET || process.env.SANITY_STUDIO_PREVIEW_SECRET

  if (!isDevelopment && (!expectedSecret || secret !== expectedSecret)) {
    return NextResponse.json({error: 'Invalid preview secret'}, {status: 401})
  }

  const draft = await draftMode()
  draft.enable()

  const targetPath = buildTargetPath(path, type, slug)
  return NextResponse.redirect(new URL(targetPath, origin))
}
