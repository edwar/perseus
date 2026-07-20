"use client"

import { cn } from "@/lib/utils"
import { Header } from "./header"

export function DashboardShell({ children }: { children: React.ReactNode }) {

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        "ml-0",
      )}
    >
      <Header />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
