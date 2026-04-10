type StandardPaginationProps = {
  summary?: string
}

export function StandardPagination({summary = '1-10 of 10'}: StandardPaginationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-6">
      <button className="h-10 border border-border px-4 text-[0.82rem] font-semibold text-muted-text">Back</button>
      <button className="h-10 border border-primary-green bg-primary-green px-4 text-[0.82rem] font-semibold text-white">1</button>
      <button className="h-10 border border-border px-4 text-[0.82rem] font-semibold text-primary-text">2</button>
      <button className="h-10 border border-border px-4 text-[0.82rem] font-semibold text-primary-text">3</button>
      <span className="px-2 text-muted-text">...</span>
      <button className="h-10 border border-border px-4 text-[0.82rem] font-semibold text-primary-text">Next</button>
      <p className="ml-auto text-[0.8rem] font-semibold text-muted-text">{summary}</p>
    </div>
  )
}
