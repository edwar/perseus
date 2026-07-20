"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transacciones",
  "/recurring": "Recurrentes",
  "/debts": "Deudas",
  "/savings": "Ahorros",
  "/budgets": "Presupuestos",
  "/obligations": "Obligaciones",
}

export function Header() {
  const pathname = usePathname()
  const { toggleSidebar } = useUIStore()
  const action = useHeaderStore((s) => s.action)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 max-md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold">{titles[pathname] ?? "Perseus"}</h1>
      <div className="flex-1" />
      {action}
    </header>
  )
}
