"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, className = "" }: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getColor = (p: number) => {
    if (p >= 100) return "#16C784" // success
    if (p >= 70) return "#2563FF"  // primary
    if (p >= 40) return "#FF8A34"  // warning
    return "#FF5A5F"               // danger
  }

  const color = getColor(animatedProgress)
  const isComplete = animatedProgress >= 100

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center rounded-full",
      isComplete && "animate-pulse-glow",
      className
    )}>
      {/* Glass background */}
      <div className="absolute inset-0 rounded-full bg-card/80 backdrop-blur-md border border-border/30 shadow-lg" />

      <svg width={size} height={size} className="-rotate-90 relative z-10">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center z-20">
        <span
          className="text-2xl font-extrabold tabular-nums tracking-tight leading-none"
          style={{ color }}
        >
          {Math.round(animatedProgress)}
        </span>
        <span
          className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5"
          style={{ color: `${color}99` }}
        >
          %
        </span>
      </div>
    </div>
  )
}
