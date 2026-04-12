'use client'

import {useEffect, useState} from 'react'

type PostType = 'news' | 'blog' | 'jobs' | 'opportunities' | 'earn'

const VIEW_TTL_MS = 12 * 60 * 60 * 1000

function formatViews(value: number) {
  return `${value.toLocaleString()} views`
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
    const storageKey = `techfront:view:${postType}:${postSlug}`

    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        const timestamp = Number(saved)
        if (Number.isFinite(timestamp) && Date.now() - timestamp < VIEW_TTL_MS) {
          return
        }
      }
    } catch {}

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
          window.localStorage.setItem(storageKey, String(Date.now()))
        }
      } catch {}
    }

    trackView()

    return () => {
      cancelled = true
    }
  }, [postSlug, postType])

  return <span>{formatViews(views)}</span>
}
