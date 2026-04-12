import Link from 'next/link'

type CoverImageMetaProps = {
  caption?: string
  credit?: string
  sourceUrl?: string
  className?: string
}

export function CoverImageMeta({caption, credit, sourceUrl, className}: CoverImageMetaProps) {
  if (!caption && !credit) return null

  return (
    <p className={className ?? 'mt-4 text-[0.86rem] leading-6 text-muted-text'}>
      {caption ? <span>{caption}</span> : null}
      {caption && credit ? <span> </span> : null}
      {credit ? (
        sourceUrl ? (
          <Link href={sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-primary-green">
            {credit}
          </Link>
        ) : (
          <span>{credit}</span>
        )
      ) : null}
    </p>
  )
}
