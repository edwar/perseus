import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useTransactions(filters?: { categoryId?: string; month?: number; year?: number }) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.categoryId) params.set("categoryId", filters.categoryId)
      if (filters?.month) params.set("month", String(filters.month))
      if (filters?.year) params.set("year", String(filters.year))
      const res = await fetch(`/api/transactions?${params}`)
      if (!res.ok) throw new Error("Error al cargar transacciones")
      return res.json()
    },
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error al crear transacción")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
