'use client'

import dynamic from 'next/dynamic'

const CompactNewsletterForm = dynamic(
  () => import('@/components/CompactNewsletterForm').then((mod) => mod.CompactNewsletterForm),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 w-full rounded-[8px] border border-white/50 bg-white/10" aria-hidden="true" />
    ),
  }
)

export function HomeNewsletterSignup() {
  return (
    <CompactNewsletterForm
      buttonLabel="Subscribe Now"
      className="flex flex-col gap-4 sm:flex-row"
      inputClassName="h-13 w-full rounded-[8px] border !border-white bg-transparent px-4 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-white placeholder:text-white/75 focus:outline-none"
      buttonClassName="inline-flex h-13 items-center justify-center whitespace-nowrap rounded-[8px] bg-white px-6 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-primary-green"
      helperTextClassName="text-[0.8rem] text-white/80"
      successClassName="text-[0.84rem] text-white"
      errorClassName="text-[0.84rem] text-white/80"
    />
  )
}
