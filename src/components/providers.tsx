"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState, type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function hydrateAll() {
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

      await Promise.all([
        txStore.getState().hydrate(),
        bugStore.getState().hydrate(),
        dbtStore.getState().hydrate(),
        recStore.getState().hydrate(),
        savStore.getState().hydrate(),
        oblStore.getState().hydrate(),
      ])

      const txs = txStore.getState().transactions
      let computed = 0
      for (const tx of txs) {
        computed += tx.type === "INCOME" ? tx.amount : -tx.amount
      }
      balStore.getState().hydrate(computed)
    }

    hydrateAll()
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
