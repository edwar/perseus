"use client"

import { useEffect, useState, useRef } from "react"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: "rect" | "circle"
  opacity: number
  gravity: number
  drag: number
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316"]

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!trigger) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 3

    particlesRef.current = Array.from({ length: 200 }, (_, i) => {
      const angle = random(0, Math.PI * 2)
      const velocity = random(8, 25)
      const hue = random(0, 360)

      return {
        id: i,
        x: centerX + random(-50, 50),
        y: centerY + random(-30, 30),
        vx: Math.cos(angle) * velocity + random(-3, 3),
        vy: Math.sin(angle) * velocity - random(5, 15),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: random(4, 12),
        rotation: random(0, 360),
        rotationSpeed: random(-15, 15),
        shape: Math.random() > 0.5 ? "rect" : "circle",
        opacity: 1,
        gravity: 0.4,
        drag: 0.98,
      }
    })

    setIsActive(true)
    let startTime = Date.now()

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const elapsed = Date.now() - startTime
      if (elapsed > 3000) {
        setIsActive(false)
        onComplete?.()
        return
      }

      for (const p of particlesRef.current) {
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag

        p.x += p.vx
        p.y += p.vy

        p.rotation += p.rotationSpeed
        p.rotationSpeed *= 0.99

        if (elapsed > 1500) {
          p.opacity = Math.max(0, 1 - (elapsed - 1500) / 1500)
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [trigger, onComplete])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}
