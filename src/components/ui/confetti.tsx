"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"]

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string; delay: number; rotation: number }>>([])

  useEffect(() => {
    if (!trigger) return

    const newPieces = Array.from({ length: 80 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    }))

    setPieces(newPieces)

    const timer = setTimeout(() => {
      setPieces([])
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [trigger, onComplete])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: "-10px",
            animationDelay: `${piece.delay}s`,
          }}
        >
          <div
            className="w-2 h-3 rounded-sm"
            style={{
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
