"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  active: string
  setActive: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export function Tabs({ tabs, defaultTab, children, className }: {
  tabs: Array<{ id: string; label: string; icon?: ReactNode }>
  defaultTab?: string
  children?: ReactNode
  className?: string
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "")

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("space-y-4", className)}>
        <div className="flex gap-1 rounded-xl bg-muted p-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabPanel({ id, children, className }: {
  id: string
  children?: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)
  if (!ctx || ctx.active !== id) return null
  return <div className={cn(className)}>{children}</div>
}
