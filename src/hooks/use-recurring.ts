import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface RecurringItem {
  id: string
  name: string
  amount: number
  type: "INCOME" | "EXPENSE"
  frequency: string
  dayOfMonth: number
  category: string
  debtId?: string
}

export function useRecurring() {
  return useQuery({
    queryKey: ["recurring"],
    queryFn: () => apiFetch<RecurringItem[]>("/api/recurring"),
    staleTime: 30_000,
  })
}

export function useRecurringMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["recurring"] }), [qc])

  const add = useMutation({
    mutationFn: (d: Omit<RecurringItem, "id">) =>
      apiFetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...d }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (d: RecurringItem) =>
      apiFetch("/api/recurring", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/recurring?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}
