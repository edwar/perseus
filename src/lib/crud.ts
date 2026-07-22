import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export interface CrudConfig {
  table: string
  columns: string[]
}

export function createCrudRoute(config: CrudConfig) {
  const { table, columns } = config
  const cols = columns.join(", ")
  const placeholders = columns.map((_, i) => `$${i + 2}`).join(", ")
  const updates = columns.filter(c => c !== "id").map((c, i) => `${c} = $${i + 2}`).join(", ")

  async function ensureTable(createSql: string) {
    await prisma.$executeRawUnsafe(createSql)
  }

  function GET(createSql: string) {
    return async function () {
      try {
        const session = await requireAuth()
        await ensureTable(createSql)
        const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          `SELECT ${cols} FROM ${table} WHERE user_id = $1 ORDER BY created_at DESC`,
          session.user.id
        )
        return NextResponse.json(rows)
      } catch {
        return NextResponse.json([])
      }
    }
  }

  function POST(createSql: string) {
    return async function (req: NextRequest) {
      try {
        const session = await requireAuth()
        const body = await req.json()
        await ensureTable(createSql)
        const values = columns.map(c => body[c] ?? null)
        await prisma.$executeRawUnsafe(
          `INSERT INTO ${table} (${cols}) VALUES ($1, ${placeholders.slice(3)})`,
          session.user.id,
          ...values
        )
        return NextResponse.json({ ok: true })
      } catch (err) {
        console.error(`[POST ${table}]`, err)
        return NextResponse.json({ error: "Create failed" }, { status: 500 })
      }
    }
  }

  function PATCH(createSql: string) {
    return async function (req: NextRequest) {
      try {
        const session = await requireAuth()
        const body = await req.json()
        const { id, ...rest } = body
        await ensureTable(createSql)
        const setCols = columns.filter(c => c !== "id" && c !== "user_id")
        const setValues = setCols.map(c => rest[c] ?? null)
        await prisma.$executeRawUnsafe(
          `UPDATE ${table} SET ${setCols.map((c, i) => `${c} = $${i + 3}`).join(", ")} WHERE id = $1 AND user_id = $2`,
          id,
          session.user.id,
          ...setValues
        )
        return NextResponse.json({ ok: true })
      } catch (err) {
        console.error(`[PATCH ${table}]`, err)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
      }
    }
  }

  function DELETE(createSql: string) {
    return async function (req: NextRequest) {
      try {
        const session = await requireAuth()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
        await ensureTable(createSql)
        await prisma.$executeRawUnsafe(
          `DELETE FROM ${table} WHERE id = $1 AND user_id = $2`,
          id,
          session.user.id
        )
        return NextResponse.json({ ok: true })
      } catch (err) {
        console.error(`[DELETE ${table}]`, err)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
      }
    }
  }

  return { GET, POST, PATCH, DELETE }
}