import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export interface ScannedDoc {
  id: string
  publicId: string
  url: string
  type: "receipt" | "invoice"
  uploadedAt: string
  data: Record<string, unknown>
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents")
      const json = await res.json()
      return (json.resources ?? []) as ScannedDoc[]
    },
    staleTime: 30_000,
  })
}

export function useDocumentMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["documents"] }), [qc])

  const remove = useMutation({
    mutationFn: (publicId: string) =>
      apiFetch(`/api/documents?publicId=${encodeURIComponent(publicId)}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { remove }
}
