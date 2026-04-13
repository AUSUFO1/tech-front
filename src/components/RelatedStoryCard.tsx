import Link from 'next/link'
import {AppImage} from '@/components/AppImage'

type RelatedStoryCardProps = {
  href: string
  title: string
  imageUrl: string
  date?: string
}

function formatDate(date?: string) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function RelatedStoryCard({href, title, imageUrl, date}: RelatedStoryCardProps) {
  return (
    <article className="border-t border-border pt-4">
      <Link href={href} className="block overflow-hidden">
        <AppImage
          src={imageUrl}
          alt={title}
          className="aspect-[4/3] w-full bg-card-background object-contain sm:h-[160px] sm:aspect-auto sm:object-cover"
          width={800}
          height={520}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="mt-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-green">{formatDate(date)}</p>
        <h3 className="mt-3 font-display text-[1.35rem] font-bold leading-[1.05] tracking-[-0.04em] text-primary-text">
          <Link
            href={href}
            className="no-underline decoration-current/45 underline-offset-4 transition hover:text-primary-green hover:underline hover:decoration-current"
          >
            {title}
          </Link>
        </h3>
      </div>
    </article>
  )
}

