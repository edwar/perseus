import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")

    const where: Record<string, unknown> = { userId: session.user.id }
    if (date) where.date = date

    const instances = await prisma.appObligationInstance.findMany({
      where,
      include: { template: true },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(instances.map(i => ({
      id: i.id,
      templateId: i.templateId,
      templateName: i.template.name,
      templateEmoji: i.template.emoji,
      templateCategory: i.template.category,
      date: i.date,
      instanceNumber: i.instanceNumber,
      completed: i.completed,
      completedAt: i.completedAt,
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { templateId, date } = body

    if (!templateId || !date) {
      return NextResponse.json({ error: "templateId and date required" }, { status: 400 })
    }

    const template = await prisma.appObligationTemplate.findFirst({
      where: { id: templateId, userId: session.user.id },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const existing = await prisma.appObligationInstance.findMany({
      where: { userId: session.user.id, templateId, date },
    })

    if (existing.length >= template.timesPerDay) {
      return NextResponse.json({ ok: true, instances: existing })
    }

    const newInstances = []
    for (let i = existing.length + 1; i <= template.timesPerDay; i++) {
      const instance = await prisma.appObligationInstance.create({
        data: {
          userId: session.user.id,
          templateId,
          date,
          instanceNumber: i,
        },
      })
      newInstances.push(instance)
    }

    return NextResponse.json({ ok: true, instances: [...existing, ...newInstances] })
  } catch (err) {
    console.error("[POST obligation-instances]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { id, completed } = body

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    await prisma.appObligationInstance.updateMany({
      where: { id, userId: session.user.id },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH obligation-instances]", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await prisma.appObligationInstance.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
