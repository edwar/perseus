"use client"

import { useState, useCallback } from "react"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ObligationInstance } from "@/hooks/use-obligations-v2"

interface TaskCardProps {
  instance: ObligationInstance
  onToggle: (id: string, completed: boolean) => void
}

export function TaskCard({ instance, onToggle }: TaskCardProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = useCallback(() => {
    if (!instance.completed) {
      setShowConfetti(true)
      setIsAnimating(true)
      setTimeout(() => setShowConfetti(false), 800)
      setTimeout(() => setIsAnimating(false), 600)
    }
    onToggle(instance.id, !instance.completed)
  }, [instance.id, instance.completed, onToggle])

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 50}ms`,
                animationDuration: "600ms",
              }}
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300",
          instance.completed
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          isAnimating && "scale-[1.02]"
        )}
      >
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          instance.completed
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
            : "border-2 border-muted-foreground/30 bg-background"
        )}>
          {instance.completed ? (
            <Check className="h-5 w-5 animate-in zoom-in" />
          ) : (
            <span className="text-lg">{instance.instanceNumber}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{instance.templateEmoji}</span>
            <p className={cn(
              "font-medium transition-all duration-300",
              instance.completed && "text-muted-foreground line-through"
            )}>
              {instance.templateName}
            </p>
          </div>
          {instance.templateCategory && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {instance.templateCategory}
            </p>
          )}
        </div>

        {instance.completed && (
          <div className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            ¡Listo!
          </div>
        )}
      </button>
    </div>
  )
}
