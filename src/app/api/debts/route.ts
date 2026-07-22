import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const rows = await prisma.appDebt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      creditor: r.creditor,
      category: r.category,
      total: Number(r.total),
      remaining: Number(r.remaining),
      rate: Number(r.rate),
      monthly: Number(r.monthly),
      minimum: r.minimum ? Number(r.minimum) : null,
      installments: r.installments,
      paid: r.paid,
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    await prisma.appDebt.create({
      data: {
        id: body.id,
        userId: session.user.id,
        name: body.name,
        creditor: body.creditor ?? null,
        category: body.category ?? null,
        total: body.total,
        remaining: body.remaining,
        rate: body.rate ?? 0,
        monthly: body.monthly ?? 0,
        minimum: body.minimum ?? null,
        installments: body.installments ?? null,
        paid: body.paid ?? 0,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST debts]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { id, ...rest } = body
    await prisma.appDebt.updateMany({
      where: { id, userId: session.user.id },
      data: {
        name: rest.name,
        creditor: rest.creditor ?? null,
        category: rest.category ?? null,
        total: rest.total,
        remaining: rest.remaining,
        rate: rest.rate ?? 0,
        monthly: rest.monthly ?? 0,
        minimum: rest.minimum ?? null,
        installments: rest.installments ?? null,
        paid: rest.paid ?? 0,
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
    await prisma.appDebt.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}