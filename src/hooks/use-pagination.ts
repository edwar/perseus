import { useMemo } from "react"

interface UsePaginationOptions<T> {
  items: T[]
  page: number
  pageSize?: number
  filterFn?: (item: T) => boolean
}

interface UsePaginationResult<T> {
  filtered: T[]
  paginated: T[]
  totalPages: number
  safePage: number
}

export function usePagination<T>({
  items,
  page,
  pageSize = 15,
  filterFn,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const filtered = useMemo(() => {
    if (!filterFn) return items
    return items.filter(filterFn)
  }, [items, filterFn])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = page > totalPages ? 1 : page

  const paginated = useMemo(() => {
    return filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  }, [filtered, safePage, pageSize])

  return { filtered, paginated, totalPages, safePage }
}
