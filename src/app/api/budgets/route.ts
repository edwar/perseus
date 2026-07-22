import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const rows = await prisma.appBudget.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rows.map(r => ({
      id: r.id,
      category: r.category,
      amount: Number(r.amount),
      color: r.color,
      items: r.items,
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    await prisma.appBudget.create({
      data: {
        id: body.id,
        userId: session.user.id,
        category: body.category,
        amount: body.amount,
        color: body.color ?? null,
        items: body.items ?? [],
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST budgets]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { id, ...rest } = body
    await prisma.appBudget.updateMany({
      where: { id, userId: session.user.id },
      data: {
        category: rest.category,
        amount: rest.amount,
        color: rest.color ?? null,
        items: rest.items ?? [],
      },
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
    await prisma.appBudget.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}