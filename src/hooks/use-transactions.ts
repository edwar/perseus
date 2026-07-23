import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "EXPENSE" | "INCOME"
  category: string
  date: string
  recurring?: boolean
  frequency?: string
  nextDate?: string
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiFetch<Transaction[]>("/api/transactions"),
    staleTime: 30_000,
  })
}

export function useTransactionMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["transactions"] }), [qc])

  const add = useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) =>
      apiFetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...tx }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (tx: Transaction) =>
      apiFetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/transactions?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}
