"use client"

import { cn } from "@/lib/utils"

interface HeroCardProps {
  icon: React.ReactNode
  label: string
  value: string
  gradient: string
  shadow: string
  hoverShadow: string
  delay: string
}

export function HeroCard({
  icon,
  label,
  value,
  gradient,
  shadow,
  hoverShadow,
  delay,
}: HeroCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white transition-all duration-300",
        gradient,
        shadow,
        hoverShadow
      )}
      style={{ animationDelay: delay }}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
      <div className="relative z-10">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
          {icon}
        </div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  )
}
