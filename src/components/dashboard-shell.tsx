"use client"

import { useUIStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"
import { Header } from "./header"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-16"
      )}
    >
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
