import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export interface Investment {
  id: string
  entity: string
  amount: number
  rate: number
  termDays: number
  startDate: string
  endDate: string
}

export interface SavingsData {
  goals: Goal[]
  investments: Investment[]
}

export function useSavings() {
  return useQuery({
    queryKey: ["savings"],
    queryFn: () => apiFetch<SavingsData>("/api/savings"),
    staleTime: 30_000,
  })
}

export function useSavingsMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["savings"] }), [qc])

  const addGoal = useMutation({
    mutationFn: (g: Omit<Goal, "id">) =>
      apiFetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goal", id: crypto.randomUUID(), ...g }),
      }),
    onSuccess: invalidate,
  })

  const updateGoal = useMutation({
    mutationFn: (g: Goal) =>
      apiFetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goal", ...g }),
      }),
    onSuccess: invalidate,
  })

  const deleteGoal = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/savings?id=${id}&type=goal`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  const addInvestment = useMutation({
    mutationFn: (i: Omit<Investment, "id">) =>
      apiFetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "investment", id: crypto.randomUUID(), ...i }),
      }),
    onSuccess: invalidate,
  })

  const updateInvestment = useMutation({
    mutationFn: (i: Investment) =>
      apiFetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "investment", ...i }),
      }),
    onSuccess: invalidate,
  })

  const deleteInvestment = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/savings?id=${id}&type=investment`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { addGoal, updateGoal, deleteGoal, addInvestment, updateInvestment, deleteInvestment }
}
