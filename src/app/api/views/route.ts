import {NextResponse} from 'next/server'
import {createClient} from '@sanity/client'
import {apiVersion, dataset, projectId} from '@/sanity/env'

type PostType = 'news' | 'blog' | 'jobs' | 'opportunities' | 'earn'

const writeToken = process.env.SANITY_API_TOKEN

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
})

function isValidPostType(value: string): value is PostType {
  return ['news', 'blog', 'jobs', 'opportunities', 'earn'].includes(value)
}

const typeMap: Record<PostType, 'news' | 'blog' | 'job' | 'opportunity' | 'blog'> = {
  news: 'news',
  blog: 'blog',
  jobs: 'job',
  opportunities: 'opportunity',
  earn: 'blog',
}

async function incrementViews(postType: PostType, postSlug: string) {
  const documentType = typeMap[postType]
  const earnCategoryFilter =
    postType === 'earn'
      ? ' && category->title in ["Freelancing", "Career Growth"]'
      : ''

  const query = `*[_type == "${documentType}" && slug.current == $slug${earnCategoryFilter}][0]{_id, views}`
  const item = await readClient.fetch<{_id?: string; views?: number} | null>(query, {slug: postSlug})

  if (!item?._id) return null

  const nextViews = (item.views ?? 0) + 1
  await readClient.patch(item._id).set({views: nextViews}).commit()
  return nextViews
}

export async function POST(request: Request) {
  if (!writeToken) {
    return NextResponse.json({error: 'View tracking unavailable.'}, {status: 500})
  }

  const body = (await request.json()) as {
    postType?: string
    postSlug?: string
  }

  const postType = body.postType ?? ''
  const postSlug = body.postSlug?.trim() ?? ''

  if (!isValidPostType(postType) || !postSlug) {
    return NextResponse.json({error: 'Invalid post data.'}, {status: 400})
  }

  try {
    const views = await incrementViews(postType, postSlug)

    if (views === null) {
      return NextResponse.json({error: 'Post not found.'}, {status: 404})
    }

    return NextResponse.json({ok: true, views})
  } catch (error) {
    console.error('View increment failed', error)
    return NextResponse.json({error: 'Could not update views.'}, {status: 500})
  }
}
