"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
  className?: string
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (streak > 0) {
      setAnimated(true)
      const timer = setTimeout(() => setAnimated(false), 600)
      return () => clearTimeout(timer)
    }
  }, [streak])

  if (streak === 0) return null

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-white shadow-lg shadow-orange-500/25",
      animated && "animate-bounce",
      className
    )}>
      <Flame className="h-5 w-5" />
      <span className="font-bold">{streak}</span>
      <span className="text-sm opacity-90">días</span>
    </div>
  )
}
