import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface Obligation {
  id: string
  name: string
}

export interface MonthlyCheck {
  month: string
  paid: string[]
}

export interface ObligationsData {
  obligations: Obligation[]
  checks: MonthlyCheck[]
}

export function useObligations() {
  return useQuery({
    queryKey: ["obligations"],
    queryFn: () => apiFetch<ObligationsData>("/api/obligations"),
    staleTime: 30_000,
  })
}

export function useObligationsMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["obligations"] }), [qc])

  const add = useMutation({
    mutationFn: (o: Omit<Obligation, "id">) =>
      apiFetch("/api/obligations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "obligation", id: crypto.randomUUID(), ...o }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (o: Obligation) =>
      apiFetch("/api/obligations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(o),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/obligations?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  const togglePaid = useMutation({
    mutationFn: (params: { obligationId: string; month: string }) =>
      apiFetch("/api/obligations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "toggle", ...params }),
      }),
    onSuccess: invalidate,
  })

  return { add, update, remove, togglePaid }
}
