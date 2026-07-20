"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState, type ReactNode } from "react"
import { syncFromCloud, debouncedSync } from "@/lib/sync"
import { useTransactionStore } from "@/store/transaction-store"
import { useBudgetStore } from "@/store/budget-store"
import { useDebtStore } from "@/store/debt-store"
import { useRecurringStore } from "@/store/recurring-store"
import { useSavingsStore } from "@/store/savings-store"

const stores = [useTransactionStore, useBudgetStore, useDebtStore, useRecurringStore, useSavingsStore]

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    syncFromCloud()

    const unsubs = stores.map((store) =>
      store.subscribe((state, prev) => {
        if (state !== prev) debouncedSync()
      })
    )
    return () => unsubs.forEach((fn) => fn())
  }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
