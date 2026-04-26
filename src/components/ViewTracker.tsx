'use client'

import {useEffect, useState} from 'react'

type PostType = 'news' | 'blog' | 'jobs' | 'opportunities' | 'earn'

const VIEW_TTL_MS = 12 * 60 * 60 * 1000

type StoredViewState = {
  timestamp: number
  views: number
}

function formatViews(value: number) {
  return `${value.toLocaleString()} views`
}

function getStoredViewState(storageKey: string) {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return null

    const parsed = JSON.parse(saved) as Partial<StoredViewState>
    const timestamp = Number(parsed.timestamp)
    const views = Number(parsed.views)

    if (!Number.isFinite(timestamp) || !Number.isFinite(views)) {
      return null
    }

    return {timestamp, views} satisfies StoredViewState
  } catch {
    return null
  }
}

export function ViewTracker({
  postType,
  postSlug,
  initialViews,
}: {
  postType: PostType
  postSlug: string
  initialViews: number
}) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    const storageKey = `gizpulse:view:${postType}:${postSlug}`
    const storedState = getStoredViewState(storageKey)

    if (storedState && Date.now() - storedState.timestamp < VIEW_TTL_MS) {
      if (storedState.views >= initialViews) {
        const timer = window.setTimeout(() => {
          setViews(storedState.views)
        }, 0)

        return () => {
          window.clearTimeout(timer)
        }
      }
      return
    }

    let cancelled = false

    const trackView = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({postType, postSlug}),
        })

        if (!response.ok) return

        const payload = (await response.json()) as {views?: number}

        if (!cancelled && typeof payload.views === 'number') {
          setViews(payload.views)
          window.localStorage.setItem(
            storageKey,
            JSON.stringify({
              timestamp: Date.now(),
              views: payload.views,
            } satisfies StoredViewState)
          )
        }
      } catch {}
    }

    trackView()

    return () => {
      cancelled = true
    }
  }, [initialViews, postSlug, postType])

  return <span>{formatViews(views)}</span>
}
