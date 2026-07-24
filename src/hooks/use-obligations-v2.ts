import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    throw new Error("Network error")
  }
}

export interface ObligationTemplate {
  id: string
  name: string
  emoji: string
  category: string | null
  frequency: "daily" | "weekly" | "monthly" | "once"
  daysOfWeek: number[] | null
  timesPerDay: number
  createdAt?: string
}

export interface ObligationInstance {
  id: string
  templateId: string
  templateName: string
  templateEmoji: string
  templateCategory: string | null
  date: string
  instanceNumber: number
  completed: boolean
  completedAt: string | null
}

export function useObligationTemplates() {
  return useQuery({
    queryKey: ["obligation-templates"],
    queryFn: () => apiFetch<ObligationTemplate[]>("/api/obligation-templates"),
    staleTime: 30_000,
  })
}

export function useObligationInstances(date: string) {
  return useQuery({
    queryKey: ["obligation-instances", date],
    queryFn: () => apiFetch<ObligationInstance[]>(`/api/obligation-instances?date=${date}`),
    staleTime: 10_000,
  })
}

export function useObligationMutations() {
  const qc = useQueryClient()
  const invalidateTemplates = useCallback(() => qc.invalidateQueries({ queryKey: ["obligation-templates"] }), [qc])
  const invalidateInstances = useCallback(() => qc.invalidateQueries({ queryKey: ["obligation-instances"] }), [qc])

  const addTemplate = useMutation({
    mutationFn: (t: Omit<ObligationTemplate, "id">) =>
      apiFetch("/api/obligation-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      }),
    onSuccess: invalidateTemplates,
  })

  const updateTemplate = useMutation({
    mutationFn: (t: ObligationTemplate) =>
      apiFetch("/api/obligation-templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      }),
    onSuccess: invalidateTemplates,
  })

  const deleteTemplate = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/obligation-templates?id=${id}`, { method: "DELETE" }),
    onSuccess: () => { invalidateTemplates(); invalidateInstances() },
  })

  const createInstances = useMutation({
    mutationFn: (params: { templateId: string; date: string }) =>
      apiFetch("/api/obligation-instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }),
    onSuccess: invalidateInstances,
  })

  const toggleInstance = useMutation({
    mutationFn: (params: { id: string; completed: boolean }) =>
      apiFetch("/api/obligation-instances", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }),
    onSuccess: invalidateInstances,
  })

  return { addTemplate, updateTemplate, deleteTemplate, createInstances, toggleInstance }
}
