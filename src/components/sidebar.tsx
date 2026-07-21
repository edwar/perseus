"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Repeat,
  CreditCard,
  PiggyBank,
  BarChart3,
  LogOut,
  Menu,
  X,
  CheckSquare,
  ScanLine,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/recurring", label: "Recurrentes", icon: Repeat },
  { href: "/debts", label: "Deudas", icon: CreditCard },
  { href: "/savings", label: "Ahorros", icon: PiggyBank },
  { href: "/budgets", label: "Presupuestos", icon: BarChart3 },
  { href: "/obligations", label: "Obligaciones", icon: CheckSquare },
  { href: "/documents", label: "Documentos", icon: ScanLine },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="fixed right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-md md:hidden"
      >
        <X className={cn("h-4 w-4", sidebarOpen ? "block" : "hidden")} />
        <Menu className={cn("h-4 w-4", sidebarOpen ? "hidden" : "block")} />
      </button>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 md:hidden",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar: mobile=overlay, desktop=fixed */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar-background transition-all duration-300",
          "md:static md:z-auto md:translate-x-0",
          sidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:w-16"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4 shrink-0">
          <img src="/logo.svg" alt="Perseus" className="h-7 w-7 shrink-0" />
          {sidebarOpen && <span className="text-lg font-semibold text-sidebar-foreground">Perseus</span>}
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (window.innerWidth < 768) setSidebarOpen(false) }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-2 shrink-0">
          <button
            onClick={() => router.push("/login")}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-red-500 hover:bg-red-600 hover:text-white dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
