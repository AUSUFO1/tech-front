import {createHash} from 'crypto'
import {NextResponse} from 'next/server'
import {createClient} from '@sanity/client'
import {apiVersion, dataset, projectId} from '@/sanity/env'

type PostType = 'news' | 'blog' | 'jobs' | 'opportunities' | 'earn'

const PUBLIC_COMMENT_QUERY = `
  *[
    _type == "comment" &&
    postType == $postType &&
    postSlug == $postSlug &&
    status == "approved"
  ] | order(coalesce(createdAt, _createdAt) desc) {
    _id,
    name,
    message,
    createdAt
  }
`

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimitStore = new Map<string, number[]>()
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const writeToken = process.env.SANITY_API_TOKEN

const writeClient = writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    })
  : null

function isValidPostType(value: string): value is PostType {
  return ['news', 'blog', 'jobs', 'opportunities', 'earn'].includes(value)
}

function getIp(request: Request) {
  const header =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    'unknown'

  return header.split(',')[0].trim()
}

function hashIp(ip: string) {
  return createHash('sha256').update(ip).digest('hex')
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const existing = rateLimitStore.get(ip) ?? []
  const recent = existing.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitStore.set(ip, recent)
  return false
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: ip,
    }),
  })

  if (!response.ok) return false
  const payload = (await response.json()) as {success?: boolean}
  return Boolean(payload.success)
}

function normalizeName(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function normalizeMessage(value: string) {
  return value.replace(/\r\n/g, '\n').trim()
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const postType = searchParams.get('postType') ?? ''
  const postSlug = searchParams.get('postSlug') ?? ''

  if (!isValidPostType(postType) || !postSlug) {
    return NextResponse.json({error: 'Invalid query'}, {status: 400})
  }

  const comments = await readClient.fetch(PUBLIC_COMMENT_QUERY, {postType, postSlug})
  return NextResponse.json({comments})
}

export async function POST(request: Request) {
  if (!writeClient) {
    return NextResponse.json(
      {error: 'Comments are temporarily unavailable. Please try again shortly.'},
      {status: 500}
    )
  }

  const ip = getIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json({error: 'You have reached the comment limit for now. Please try again later.'}, {status: 429})
  }

  const body = (await request.json()) as {
    postType?: string
    postSlug?: string
    name?: string
    email?: string
    message?: string
    turnstileToken?: string
  }

  const postType = body.postType ?? ''
  const postSlug = body.postSlug?.trim() ?? ''
  const name = normalizeName(body.name ?? '')
  const email = body.email?.trim() ?? ''
  const message = normalizeMessage(body.message ?? '')
  const turnstileToken = body.turnstileToken ?? ''

  if (!isValidPostType(postType) || !postSlug) {
    return NextResponse.json({error: 'We could not match this comment to the right post.'}, {status: 400})
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({error: 'Please enter a valid name.'}, {status: 400})
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({error: 'Please enter a valid email address.'}, {status: 400})
  }

  if (message.length < 5) {
    return NextResponse.json({error: 'Please write a longer comment.'}, {status: 400})
  }

  if (message.length > 1500) {
    return NextResponse.json({error: 'Please shorten your comment.'}, {status: 400})
  }

  const turnstilePassed = await verifyTurnstile(turnstileToken, ip)
  if (!turnstilePassed) {
    return NextResponse.json({error: 'Please complete verification before posting your comment.'}, {status: 400})
  }

  try {
    await writeClient.create({
      _type: 'comment',
      postType,
      postSlug,
      name,
      email: email.toLowerCase(),
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ipHash: hashIp(ip),
    })

    return NextResponse.json({ok: true, message: 'Comment submitted for review.'}, {status: 201})
  } catch (error) {
    console.error('Comment submission failed', error)
    return NextResponse.json(
      {error: 'We could not post your comment right now. Please try again shortly.'},
      {status: 500}
    )
  }
}
