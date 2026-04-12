export const PAGE_SIZE = 6

export function getCurrentPage(value?: string) {
  const page = Number(value ?? '1')
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.floor(page)
}

export function paginateItems<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    startItem: totalItems === 0 ? 0 : start + 1,
    endItem: Math.min(end, totalItems),
  }
}
