type SectionSearchBarProps = {
  placeholder: string
}

export function SectionSearchBar({placeholder}: SectionSearchBarProps) {
  return (
    <section className="py-6 lg:py-8">
      <form action="/search" className="flex w-full max-w-[44rem] flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          placeholder={placeholder}
          className="h-12 w-full border border-border bg-transparent px-4 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center bg-primary-green px-6 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-white"
        >
          Search
        </button>
      </form>
    </section>
  )
}
