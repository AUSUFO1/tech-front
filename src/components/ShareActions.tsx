"use client"

import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {useMemo, useSyncExternalStore} from 'react'
import {FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter} from 'react-icons/fa6'
import {Link2} from 'lucide-react'
import {getTopicHref} from '@/lib/link-mapping'

type ShareActionsProps = {
  title: string
  topics?: string[]
  topicHrefs?: Record<string, string>
}

function subscribe() {
  return () => {}
}

export function ShareActions({title, topics = [], topicHrefs = {}}: ShareActionsProps) {
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => ''
  )
  const pageUrl = useMemo(() => {
    const query = searchParams?.toString()
    return origin ? `${origin}${pathname}${query ? `?${query}` : ''}` : ''
  }, [origin, pathname, searchParams])

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(pageUrl)

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return
    try {
      await navigator.share({title, url: pageUrl})
    } catch {
      // ignore
    }
  }

  const handleCopy = async () => {
    if (!pageUrl) return
    await navigator.clipboard.writeText(pageUrl)
  }

  return (
    <section className="mt-10 border-t border-border pt-6">
      {topics.length > 0 ? (
        <>
          <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-text">Explore More On These Topics</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => (
              (() => {
                const href = topicHrefs[topic] ?? getTopicHref(topic)

                if (href) {
                  return (
                    <Link
                      key={topic}
                      href={href}
                      className="inline-flex h-10 items-center border border-border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-primary-text transition-colors hover:border-primary-green hover:text-primary-green"
                    >
                      {topic}
                    </Link>
                  )
                }

                return (
                  <span
                    key={topic}
                    className="inline-flex h-10 items-center border border-border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-primary-text"
                  >
                    {topic}
                  </span>
                )
              })()
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-text">Share This Story</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-primary-text">
          <a href={pageUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : '#'} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-primary-green">
            <FaFacebookF className="h-4 w-4" />
          </a>
          <a href={pageUrl ? `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` : '#'} target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-primary-green">
            <FaXTwitter className="h-4 w-4" />
          </a>
          <a href={pageUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` : '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-primary-green">
            <FaLinkedinIn className="h-4 w-4" />
          </a>
          <a href={pageUrl ? `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` : '#'} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-primary-green">
            <FaWhatsapp className="h-4 w-4" />
          </a>
          <button type="button" onClick={handleCopy} aria-label="Copy link" className="transition-colors hover:text-primary-green">
            <Link2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={handleNativeShare} className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary-text hover:text-primary-green">
            Share
          </button>
        </div>
      </div>
    </section>
  )
}
