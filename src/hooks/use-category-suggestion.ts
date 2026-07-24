import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"

interface CategorySuggestion {
  category: string
  confidence: number
}

async function fetchSuggestions(description: string): Promise<CategorySuggestion[]> {
  if (!description || description.length < 3) return []

  const res = await fetch("/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  })

  if (!res.ok) return []
  return res.json()
}

export function useCategorySuggestion(description: string) {
  const [debouncedDesc, setDebouncedDesc] = useState(description)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDesc(description), 300)
    return () => clearTimeout(timer)
  }, [description])

  const { data: suggestions = [] } = useQuery({
    queryKey: ["category-suggestion", debouncedDesc],
    queryFn: () => fetchSuggestions(debouncedDesc),
    enabled: debouncedDesc.length >= 3,
    staleTime: 60_000,
  })

  return { suggestions }
}
