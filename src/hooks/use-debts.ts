import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface Debt {
  id: string
  name: string
  creditor: string
  category: string
  total: number
  remaining: number
  rate: number
  monthly: number
  minimum: number | null
  installments: number | null
  paid: number
}

export function useDebts() {
  return useQuery({
    queryKey: ["debts"],
    queryFn: () => apiFetch<Debt[]>("/api/debts"),
    staleTime: 30_000,
  })
}

export function useDebtMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["debts"] }), [qc])

  const add = useMutation({
    mutationFn: (d: Omit<Debt, "id">) =>
      apiFetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...d }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (d: Debt) =>
      apiFetch("/api/debts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/debts?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}
