"use client"

import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { Header } from "./header"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)

  return (
    <div
      className={cn(
        "flex flex-1 flex-col h-screen transition-all duration-300",
        "md:ml-16",
        sidebarOpen && "md:ml-64",
      )}
    >
      <Header />
      <main className="flex-1 bg-linear-to-br from-background via-background to-muted/30 p-4 md:p-6 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  )
}
