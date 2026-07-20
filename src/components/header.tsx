"use client"

import { Menu } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { Button } from "@/components/ui/button"

export function Header() {
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 max-md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
    </header>
  )
}
