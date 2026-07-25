"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: "rect" | "circle" | "star" | "ribbon"
  opacity: number
  gravity: number
  drag: number
  wobble: number
  wobbleSpeed: number
}

const COLORS = [
  "#16C784", // success
  "#2563FF", // primary
  "#FF8A34", // warning
  "#7C3AED", // xp
  "#F6C344", // achievement
  "#00C2FF", // cyan
  "#FF7A00", // energy
  "#34D399", // emerald-light
  "#60A5FA", // blue-light
]

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    if (!trigger) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 3

    // Create particles with variety
    particlesRef.current = Array.from({ length: 150 }, () => {
      const angle = random(0, Math.PI * 2)
      const velocity = random(6, 20)
      const shapes: Particle["shape"][] = ["rect", "circle", "star", "ribbon"]
      const shapeWeights = [0.3, 0.3, 0.2, 0.2]
      let r = Math.random()
      let shapeIdx = 0
      for (let i = 0; i < shapeWeights.length; i++) {
        r -= shapeWeights[i]
        if (r <= 0) { shapeIdx = i; break }
      }

      return {
        x: centerX + random(-80, 80),
        y: centerY + random(-40, 40),
        vx: Math.cos(angle) * velocity + random(-2, 2),
        vy: Math.sin(angle) * velocity - random(4, 12),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: random(3, 10),
        rotation: random(0, 360),
        rotationSpeed: random(-20, 20),
        shape: shapes[shapeIdx],
        opacity: 1,
        gravity: random(0.3, 0.5),
        drag: random(0.97, 0.99),
        wobble: random(0, Math.PI * 2),
        wobbleSpeed: random(0.05, 0.15),
      }
    })

    const startTime = Date.now()
    let running = true

    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
      const spikes = 5
      const outerRadius = size / 2
      const innerRadius = size / 4
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / spikes - Math.PI / 2
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    }

    function drawRibbon(ctx: CanvasRenderingContext2D, p: Particle) {
      const w = p.size * 1.5
      const h = p.size * 0.4
      ctx.beginPath()
      ctx.moveTo(-w / 2, -h / 2)
      ctx.quadraticCurveTo(0, h, w / 2, -h / 2)
      ctx.quadraticCurveTo(0, -h * 2, -w / 2, -h / 2)
      ctx.fill()
    }

    function animate() {
      if (!running || !ctx || !canvas) return

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const elapsed = Date.now() - startTime
      if (elapsed > 3500) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        onComplete?.()
        return
      }

      for (const p of particlesRef.current) {
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.wobble += p.wobbleSpeed

        p.x += p.vx + Math.sin(p.wobble) * 0.5
        p.y += p.vy

        p.rotation += p.rotationSpeed
        p.rotationSpeed *= 0.98

        if (elapsed > 1800) {
          p.opacity = Math.max(0, 1 - (elapsed - 1800) / 1700)
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        switch (p.shape) {
          case "rect":
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
            break
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
            break
          case "star":
            drawStar(ctx, 0, 0, p.size)
            break
          case "ribbon":
            drawRibbon(ctx, p)
            break
        }

        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      running = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [trigger, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: trigger ? "block" : "none" }}
    />
  )
}
