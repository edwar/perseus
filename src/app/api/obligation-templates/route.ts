import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const templates = await prisma.appObligationTemplate.findMany({
      where: { userId: session.user.id },
      include: { tasks: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(templates.map(t => ({
      id: t.id,
      name: t.name,
      emoji: t.emoji,
      category: t.category,
      frequency: t.frequency,
      daysOfWeek: t.daysOfWeek,
      timesPerDay: t.timesPerDay,
      createdAt: t.createdAt.toISOString(),
      tasks: t.tasks.map(task => ({
        id: task.id,
        name: task.name,
        emoji: task.emoji,
        sortOrder: task.sortOrder,
      })),
    })))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { name, emoji, category, frequency, daysOfWeek, timesPerDay, tasks } = body

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 })
    }

    const template = await prisma.appObligationTemplate.create({
      data: {
        userId: session.user.id,
        name,
        emoji: emoji || "📋",
        category: category || null,
        frequency: frequency || "daily",
        daysOfWeek: daysOfWeek || null,
        timesPerDay: timesPerDay || 1,
        tasks: {
          create: (tasks || []).map((t: { name: string; emoji?: string }, i: number) => ({
            name: t.name,
            emoji: t.emoji || "✓",
            sortOrder: i,
          })),
        },
      },
      include: { tasks: true },
    })

    return NextResponse.json({ id: template.id, ok: true })
  } catch (err) {
    console.error("[POST obligation-templates]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { id, tasks, ...rest } = body

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    await prisma.appObligationTemplate.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(rest.name !== undefined && { name: rest.name }),
        ...(rest.emoji !== undefined && { emoji: rest.emoji }),
        ...(rest.category !== undefined && { category: rest.category }),
        ...(rest.frequency !== undefined && { frequency: rest.frequency }),
        ...(rest.daysOfWeek !== undefined && { daysOfWeek: rest.daysOfWeek }),
        ...(rest.timesPerDay !== undefined && { timesPerDay: rest.timesPerDay }),
      },
    })

    if (tasks && Array.isArray(tasks)) {
      await prisma.appObligationTask.deleteMany({ where: { templateId: id } })
      await prisma.appObligationTask.createMany({
        data: tasks.map((t: { name: string; emoji?: string }, i: number) => ({
          templateId: id,
          name: t.name,
          emoji: t.emoji || "✓",
          sortOrder: i,
        })),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH obligation-templates]", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    await prisma.appObligationTaskInstance.deleteMany({
      where: { instance: { templateId: id, userId: session.user.id } },
    })
    await prisma.appObligationInstance.deleteMany({
      where: { templateId: id, userId: session.user.id },
    })
    await prisma.appObligationTask.deleteMany({
      where: { templateId: id },
    })
    await prisma.appObligationTemplate.deleteMany({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
