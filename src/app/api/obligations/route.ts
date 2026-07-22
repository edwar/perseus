import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const [obligations, checks] = await Promise.all([
      prisma.appObligation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.appObligationCheck.findMany({
        where: { userId: session.user.id },
      }),
    ])
    const checksGrouped: Array<{ month: string; paid: string[] }> = []
    const map: Record<string, string[]> = {}
    for (const c of checks) {
      if (!map[c.month]) map[c.month] = []
      map[c.month].push(c.obligationId)
    }
    for (const [month, paid] of Object.entries(map)) {
      checksGrouped.push({ month, paid })
    }
    return NextResponse.json({
      obligations: obligations.map(o => ({ id: o.id, name: o.name })),
      checks: checksGrouped,
    })
  } catch {
    return NextResponse.json({ obligations: [], checks: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()

    if (body.type === "obligation") {
      await prisma.appObligation.create({
        data: { id: body.id, userId: session.user.id, name: body.name },
      })
    } else if (body.type === "toggle") {
      const existing = await prisma.appObligationCheck.findFirst({
        where: { userId: session.user.id, month: body.month, obligationId: body.obligationId },
      })
      if (existing) {
        await prisma.appObligationCheck.delete({ where: { id: existing.id } })
      } else {
        await prisma.appObligationCheck.create({
          data: { userId: session.user.id, month: body.month, obligationId: body.obligationId },
        })
      }
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST obligations]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { id, name } = await req.json()
    await prisma.appObligation.updateMany({
      where: { id, userId: session.user.id },
      data: { name },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await prisma.appObligationCheck.deleteMany({ where: { obligationId: id, userId: session.user.id } })
    await prisma.appObligation.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}