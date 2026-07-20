"use client"

import { useUIStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        "md:ml-0",
        sidebarOpen ? "md:ml-64" : "md:ml-16"
      )}
    >
      <main className="flex-1 p-4 pt-14 md:pt-6 md:p-6">{children}</main>
    </div>
  )
}
