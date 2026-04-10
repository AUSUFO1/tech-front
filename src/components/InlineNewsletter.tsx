import {CompactNewsletterForm} from '@/components/CompactNewsletterForm'

export function InlineNewsletter() {
  return (
    <section className="mt-10 border border-border bg-card-background p-6 sm:p-8">
      <h2 className="font-display text-[2rem] font-bold tracking-[-0.05em] text-primary-text sm:text-[2.4rem]">
        Get Techfront Weekly
      </h2>
      <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-muted-text">
        Receive jobs, opportunities, and practical tech insights every Sunday.
      </p>
      <div className="mt-5">
        <CompactNewsletterForm buttonLabel="Subscribe" />
      </div>
    </section>
  )
}
