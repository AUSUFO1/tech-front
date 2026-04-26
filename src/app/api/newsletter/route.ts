import {createHash} from 'crypto'
import {createClient} from '@sanity/client'
import {NextResponse} from 'next/server'
import {resend, resendFromEmail, resendReplyToEmail} from '@/lib/resend'
import {apiVersion, dataset, projectId} from '@/sanity/env'

const AVAILABLE_CHANNELS = new Map([
  ['gizpulse-weekly', 'GizPulse Weekly'],
  ['jobs-alerts', 'Jobs Alerts'],
  ['opportunity-radar', 'Opportunity Radar'],
])

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

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

function getIp(request: Request) {
  const header =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    'unknown'

  return header.split(',')[0].trim()
}

function verifyEmail(email: string) {
  return EMAIL_PATTERN.test(email)
}

function normalizeName(name: string) {
  return name.replace(/\s+/g, ' ').trim()
}

function subscriberId(email: string) {
  return `newsletter-subscriber-${createHash('sha256').update(email.toLowerCase()).digest('hex')}`
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

function buildWelcomeEmail(name: string | undefined, channels: string[]) {
  const introName = name?.trim() ? name.trim() : 'there'
  const selectedChannels = channels
    .map((channel) => AVAILABLE_CHANNELS.get(channel))
    .filter(Boolean) as string[]

  const selectedList = selectedChannels.map((channel) => `<li>${channel}</li>`).join('')

  return `
    <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;padding:40px 32px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 12px;font-family:Sora,Inter,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#16a34a;">
          GizPulse
        </p>
        <h1 style="margin:0 0 18px;font-family:Sora,Inter,Arial,sans-serif;font-size:40px;line-height:0.98;font-weight:800;letter-spacing:-0.06em;">
          Welcome to GizPulse Weekly
        </h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#475569;">
          Hi ${introName}, your subscription is in. We will keep you close to practical jobs, opportunities, and useful tech stories.
        </p>
        <p style="margin:24px 0 12px;font-size:14px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#16a34a;">
          Selected newsletters
        </p>
        <ul style="margin:0 0 24px;padding-left:20px;color:#0f172a;font-size:16px;line-height:1.8;">
          ${selectedList}
        </ul>
        <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e2e8f0;font-size:14px;line-height:1.8;color:#64748b;">
          Stay ahead. Stay informed. Earn with Tech.
        </p>
      </div>
    </div>
  `
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string
    name?: string
    channels?: string[]
    turnstileToken?: string
  }

  const email = body.email?.trim() ?? ''
  const name = normalizeName(body.name ?? '')
  const channels = Array.isArray(body.channels)
    ? body.channels.filter((channel): channel is string => AVAILABLE_CHANNELS.has(channel))
    : []
  const turnstileToken = body.turnstileToken ?? ''
  const ip = getIp(request)

  if (!verifyEmail(email)) {
    return NextResponse.json({error: 'Please enter a valid email address.'}, {status: 400})
  }

  if (channels.length === 0) {
    return NextResponse.json({error: 'Please select at least one newsletter.'}, {status: 400})
  }

  if (name.length > 80) {
    return NextResponse.json({error: 'Please use a shorter name.'}, {status: 400})
  }

  const turnstilePassed = await verifyTurnstile(turnstileToken, ip)
  if (!turnstilePassed) {
    return NextResponse.json({error: 'Verification failed. Please try again.'}, {status: 400})
  }

  if (!writeClient) {
    return NextResponse.json(
      {error: 'Newsletter signup is temporarily unavailable. Please try again shortly.'},
      {status: 500}
    )
  }

  try {
    const id = subscriberId(email)
    const existingSubscriber = await writeClient.fetch<{createdAt?: string} | null>(
      `*[_type == "newsletterSubscriber" && _id == $id][0]{createdAt}`,
      {id}
    )

    await writeClient.createOrReplace({
      _id: id,
      _type: 'newsletterSubscriber',
      email: email.toLowerCase(),
      name,
      channels,
      status: 'active',
      source: 'newsletter-page',
      updatedAt: new Date().toISOString(),
      createdAt: existingSubscriber?.createdAt ?? new Date().toISOString(),
    })

    if (!resend) {
      return NextResponse.json(
        {message: 'You are subscribed. Email sending will be enabled once Resend is configured.'},
        {status: 201}
      )
    }

    const subject =
      channels.length === 1
        ? `You are subscribed to ${AVAILABLE_CHANNELS.get(channels[0])}`
        : 'You are subscribed to GizPulse newsletters'

    try {
      await resend.emails.send({
        from: resendFromEmail,
        to: email,
        replyTo: resendReplyToEmail,
        subject,
        html: buildWelcomeEmail(name, channels),
      })
    } catch (error) {
      console.error('Newsletter welcome email failed', error)

      return NextResponse.json(
        {ok: true, message: 'Subscription successful. Your welcome email may take a little longer to arrive.'},
        {status: 201}
      )
    }

    return NextResponse.json({ok: true, message: 'Subscription successful. Check your inbox.'}, {status: 201})
  } catch (error) {
    console.error('Newsletter signup failed', error)

    return NextResponse.json(
      {error: 'We could not complete your subscription right now. Please try again shortly.'},
      {status: 500}
    )
  }
}
