import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const patterns = await prisma.appCategoryPattern.findMany({
      where: { userId: session.user.id },
      orderBy: { count: "desc" },
    })
    return NextResponse.json(patterns.map(p => ({
      id: p.id,
      pattern: p.pattern,
      category: p.category,
      confidence: p.confidence,
      count: p.count,
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { pattern, category } = body

    if (!pattern || !category) {
      return NextResponse.json({ error: "pattern and category required" }, { status: 400 })
    }

    const normalizedPattern = pattern.toLowerCase().trim()

    const existing = await prisma.appCategoryPattern.findUnique({
      where: {
        userId_pattern_category: {
          userId: session.user.id,
          pattern: normalizedPattern,
          category,
        },
      },
    })

    if (existing) {
      const newCount = existing.count + 1
      const newConfidence = Math.min(1, existing.confidence + 0.1)
      await prisma.appCategoryPattern.update({
        where: { id: existing.id },
        data: { count: newCount, confidence: newConfidence },
      })
    } else {
      await prisma.appCategoryPattern.create({
        data: {
          userId: session.user.id,
          pattern: normalizedPattern,
          category,
          confidence: 0.5,
          count: 1,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST category-patterns]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await prisma.appCategoryPattern.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
