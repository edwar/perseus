import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const [goals, investments] = await Promise.all([
      prisma.appSavingGoal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.appInvestment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
    ])
    return NextResponse.json({
      goals: goals.map(g => ({
        id: g.id,
        name: g.name,
        target: Number(g.target),
        current: Number(g.current),
        deadline: g.deadline,
      })),
      investments: investments.map(i => ({
        id: i.id,
        entity: i.entity,
        amount: Number(i.amount),
        rate: Number(i.rate),
        termDays: i.termDays,
        startDate: i.startDate,
        endDate: i.endDate,
      })),
    })
  } catch {
    return NextResponse.json({ goals: [], investments: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    if (body.type === "goal") {
      await prisma.appSavingGoal.create({
        data: {
          id: body.id,
          userId: session.user.id,
          name: body.name,
          target: body.target,
          current: body.current ?? 0,
          deadline: body.deadline ?? null,
        },
      })
    } else if (body.type === "investment") {
      await prisma.appInvestment.create({
        data: {
          id: body.id,
          userId: session.user.id,
          entity: body.entity,
          amount: body.amount,
          rate: body.rate ?? 0,
          termDays: body.termDays,
          startDate: body.startDate,
          endDate: body.endDate,
        },
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST savings]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    if (body.type === "goal") {
      const { id, ...rest } = body
      await prisma.appSavingGoal.updateMany({
        where: { id, userId: session.user.id },
        data: { name: rest.name, target: rest.target, current: rest.current, deadline: rest.deadline ?? null },
      })
    } else if (body.type === "investment") {
      const { id, ...rest } = body
      await prisma.appInvestment.updateMany({
        where: { id, userId: session.user.id },
        data: { entity: rest.entity, amount: rest.amount, rate: rest.rate ?? 0, termDays: rest.termDays, startDate: rest.startDate, endDate: rest.endDate },
      })
    }
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
    const type = searchParams.get("type")
    if (!id || !type) return NextResponse.json({ error: "id and type required" }, { status: 400 })
    if (type === "goal") {
      await prisma.appSavingGoal.deleteMany({ where: { id, userId: session.user.id } })
    } else {
      await prisma.appInvestment.deleteMany({ where: { id, userId: session.user.id } })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}