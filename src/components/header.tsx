"use client"

import { usePathname } from "next/navigation"
import { useUIStore } from "@/store/ui-store"
import { useHeaderStore } from "@/store/header-store"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transacciones",
  "/recurring": "Recurrentes",
  "/debts": "Deudas",
  "/savings": "Ahorros",
  "/budgets": "Presupuestos",
  "/monthly-review": "Resumen",
  "/obligations": "Obligaciones",
  "/documents": "Documentos",
}

export function Header() {
  const pathname = usePathname()
  const action = useHeaderStore((s) => s.action)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      <h1 className="text-lg font-semibold">{titles[pathname] ?? "Perseus"}</h1>
      <div className="flex-1" />
      {action}
    </header>
  )
}
