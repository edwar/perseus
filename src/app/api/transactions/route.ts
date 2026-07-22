import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const rows = await prisma.appTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rows.map(r => ({
      id: r.id,
      description: r.description,
      amount: Number(r.amount),
      type: r.type,
      category: r.category,
      date: r.date,
      recurring: r.recurring,
      frequency: r.frequency,
      nextDate: r.nextDate,
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    await prisma.appTransaction.create({
      data: {
        id: body.id,
        userId: session.user.id,
        description: body.description,
        amount: body.amount,
        type: body.type,
        category: body.category ?? null,
        date: body.date,
        recurring: body.recurring ?? false,
        frequency: body.frequency ?? null,
        nextDate: body.nextDate ?? null,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST transactions]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { id, ...rest } = body
    await prisma.appTransaction.updateMany({
      where: { id, userId: session.user.id },
      data: {
        description: rest.description,
        amount: rest.amount,
        type: rest.type,
        category: rest.category ?? null,
        date: rest.date,
        recurring: rest.recurring ?? false,
        frequency: rest.frequency ?? null,
        nextDate: rest.nextDate ?? null,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH transactions]", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await prisma.appTransaction.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}