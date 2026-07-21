import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/")
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  )
}
