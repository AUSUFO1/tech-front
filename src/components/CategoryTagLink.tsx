import Link from 'next/link'

type CategoryTagLinkProps = {
  href: string
  label: string
  className?: string
}

export function CategoryTagLink({href, label, className}: CategoryTagLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex bg-primary-green px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] !text-white transition-opacity hover:opacity-90 ${
        className ?? ''
      }`}
    >
      {label}
    </Link>
  )
}
