"use client"

import Script from 'next/script'
import {FormEvent, useEffect, useRef, useState} from 'react'

type PostType = 'news' | 'blog' | 'jobs' | 'opportunities' | 'earn'

type Comment = {
  _id: string
  name: string
  message: string
  createdAt: string
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
        }
      ) => string
      remove?: (widgetId: string) => void
      reset?: (widgetId: string) => void
    }
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ''

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

type ArticleCommentsProps = {
  postType: PostType
  postSlug: string
}

export function ArticleComments({postType, postSlug}: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)
  const turnstileRequired = Boolean(turnstileSiteKey)

  useEffect(() => {
    if (window.turnstile) {
      setTurnstileReady(true)
    }
  }, [])

  useEffect(() => {
    let active = true
    const fetchComments = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const response = await fetch(`/api/comments?postType=${postType}&postSlug=${encodeURIComponent(postSlug)}`, {
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Failed to load comments')
        const payload = (await response.json()) as {comments: Comment[]}
        if (active) setComments(payload.comments ?? [])
      } catch {
        if (active) setErrorMessage('Could not load comments right now.')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchComments()
    return () => {
      active = false
    }
  }, [postType, postSlug])

  useEffect(() => {
    if (!turnstileRequired || !turnstileReady) return
    if (!window.turnstile || !turnstileContainerRef.current) return

    if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
      window.turnstile.remove(turnstileWidgetIdRef.current)
      turnstileWidgetIdRef.current = null
      turnstileContainerRef.current.innerHTML = ''
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
      theme: 'auto',
      size: 'compact',
    })

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [turnstileReady, turnstileRequired])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setErrorMessage('Please complete all comment fields.')
      return
    }

    if (turnstileRequired && !turnstileToken) {
      setErrorMessage('Please complete verification before posting your comment.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')
    setStatusMessage('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          postType,
          postSlug,
          name,
          email,
          message,
          turnstileToken,
        }),
      })

      const payload = (await response.json()) as {message?: string; error?: string}
      if (!response.ok) {
        setErrorMessage(payload.error || 'We could not post your comment right now. Please try again shortly.')
        return
      }

      setStatusMessage(payload.message || 'Comment submitted.')
      form.reset()
      setTurnstileToken('')
      const refreshed = await fetch(`/api/comments?postType=${postType}&postSlug=${encodeURIComponent(postSlug)}`, {cache: 'no-store'})
      if (refreshed.ok) {
        const nextPayload = (await refreshed.json()) as {comments: Comment[]}
        setComments(nextPayload.comments ?? [])
      }
      if (turnstileWidgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(turnstileWidgetIdRef.current)
      }
    } catch {
      setErrorMessage('We could not post your comment right now. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      {turnstileRequired ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
        />
      ) : null}
      <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text">Comments</h2>
      <p className="mt-2 text-[0.92rem] text-muted-text">Comments are moderated and published after approval.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Your name"
            required
            className="h-11 border border-border bg-transparent px-3 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="h-11 border border-border bg-transparent px-3 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
          />
        </div>
        <textarea
          name="message"
          placeholder="Add your comment..."
          required
          rows={5}
          className="w-full border border-border bg-transparent px-3 py-3 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
        />
        {turnstileRequired ? (
          <div className="space-y-2">
            <div className="w-full overflow-hidden">
              <div className="newsletter-turnstile-wrap newsletter-turnstile-wrap--compact">
                <div ref={turnstileContainerRef} />
              </div>
            </div>
            <p className="text-[0.82rem] text-muted-text">
              {turnstileToken ? 'Verification complete.' : 'Please complete verification before posting your comment.'}
            </p>
          </div>
        ) : null}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || (turnstileRequired && !turnstileToken)}
            className="inline-flex h-11 items-center justify-center bg-primary-green px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? 'Submitting...' : turnstileRequired && !turnstileToken ? 'Complete Verification' : 'Post Comment'}
          </button>
          {statusMessage ? <p className="text-[0.88rem] text-primary-green">{statusMessage}</p> : null}
          {errorMessage ? <p className="text-[0.88rem] text-[#b91c1c] dark:text-[#fca5a5]">{errorMessage}</p> : null}
        </div>
      </form>

      <div className="mt-8 border-t border-border">
        {loading ? <p className="py-5 text-sm text-muted-text">Loading comments...</p> : null}
        {!loading && comments.length === 0 ? <p className="py-5 text-sm text-muted-text">No comments yet.</p> : null}

        {comments.map((comment) => (
          <article key={comment._id} className="border-b border-border py-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[0.84rem] font-bold uppercase tracking-[0.1em] text-primary-text">{comment.name}</p>
              <p className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-muted-text">{formatDate(comment.createdAt)}</p>
            </div>
            <p className="mt-2 text-[0.96rem] leading-7 text-muted-text">{comment.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
