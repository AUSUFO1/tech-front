import Link from 'next/link'

type StandardPaginationProps = {
  summary: string
  currentPage: number
  totalPages: number
  createPageHref: (page: number) => string
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({length: totalPages}, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
}

export function StandardPagination({summary, currentPage, totalPages, createPageHref}: StandardPaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages)

  if (totalPages <= 1) {
    return <p className="py-6 text-[0.8rem] font-semibold text-muted-text">{summary}</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-6">
      {currentPage > 1 ? (
        <Link href={createPageHref(currentPage - 1)} className="inline-flex h-10 items-center border border-border px-4 text-[0.82rem] font-semibold text-primary-text">
          Back
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center border border-border px-4 text-[0.82rem] font-semibold text-muted-text">Back</span>
      )}

      {pages.map((page, index) => {
        const previous = pages[index - 1]
        const showGap = previous && page - previous > 1

        return (
          <div key={page} className="flex items-center gap-2">
            {showGap ? <span className="px-2 text-muted-text">...</span> : null}
            {page === currentPage ? (
              <span className="inline-flex h-10 items-center border border-primary-green bg-primary-green px-4 text-[0.82rem] font-semibold text-white">
                {page}
              </span>
            ) : (
              <Link href={createPageHref(page)} className="inline-flex h-10 items-center border border-border px-4 text-[0.82rem] font-semibold text-primary-text">
                {page}
              </Link>
            )}
          </div>
        )
      })}

      {currentPage < totalPages ? (
        <Link href={createPageHref(currentPage + 1)} className="inline-flex h-10 items-center border border-border px-4 text-[0.82rem] font-semibold text-primary-text">
          Next
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center border border-border px-4 text-[0.82rem] font-semibold text-muted-text">Next</span>
      )}

      <p className="ml-auto text-[0.8rem] font-semibold text-muted-text">{summary}</p>
    </div>
  )
}
