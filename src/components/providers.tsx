"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState, type ReactNode } from "react"
import { syncFromCloud, debouncedSync } from "@/lib/sync"

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function init() {
      const [txStore, balStore, bugStore, dbtStore, recStore, savStore, oblStore] =
        await Promise.all([
          import("@/store/transaction-store").then((m) => m.useTransactionStore),
          import("@/store/balance-store").then((m) => m.useBalanceStore),
          import("@/store/budget-store").then((m) => m.useBudgetStore),
          import("@/store/debt-store").then((m) => m.useDebtStore),
          import("@/store/recurring-store").then((m) => m.useRecurringStore),
          import("@/store/savings-store").then((m) => m.useSavingsStore),
          import("@/store/obligations-store").then((m) => m.useObligationsStore),
        ])

      const transactions = txStore.getState().transactions
      const balanceState = balStore.getState()
      if (balanceState.balance === 0 && transactions.length > 0) {
        const initial = transactions.reduce(
          (s, t) => s + (t.type === "INCOME" ? t.amount : -t.amount),
          0
        )
        if (initial !== 0) balanceState.setBalance(initial)
      }

      syncFromCloud()

      const unsubs = [txStore, bugStore, dbtStore, recStore, savStore, oblStore].map((store) =>
        store.subscribe((state, prev) => {
          if (state !== prev) debouncedSync()
        })
      )
      return () => unsubs.forEach((fn) => fn())
    }

    init()
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
