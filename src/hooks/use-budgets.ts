import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface Budget {
  id: string
  category: string
  amount: number
  color: string
  items?: Array<{ name: string; amount: number }>
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => apiFetch<Budget[]>("/api/budgets"),
    staleTime: 30_000,
  })
}

export function useBudgetMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["budgets"] }), [qc])

  const add = useMutation({
    mutationFn: (b: Omit<Budget, "id">) =>
      apiFetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...b }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (b: Budget) =>
      apiFetch("/api/budgets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/budgets?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}
