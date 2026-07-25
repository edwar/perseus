import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Empty({ icon: Icon, title, description, action, className }: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-20 text-center", className)}>
      {Icon && (
        <div className="relative animate-stagger-in" style={{ animationDelay: "0ms" }}>
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 blur-xl animate-pulse-glow" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 ring-1 ring-blue-100/50">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
      )}
      <div className="animate-stagger-in" style={{ animationDelay: "100ms" }}>
        <p className="text-base font-bold text-foreground">{title}</p>
        {description && <p className="mt-1.5 max-w-xs text-sm text-muted-foreground leading-relaxed">{description}</p>}
      </div>
      <div className="animate-stagger-in" style={{ animationDelay: "200ms" }}>
        {action}
      </div>
    </div>
  )
}
