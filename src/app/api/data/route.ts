import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

const VALID_KEYS = ["transactions", "budgets", "debts", "recurring", "savings", "obligations", "balance"] as const
type DataKey = (typeof VALID_KEYS)[number]

function isValidKey(k: string): k is DataKey {
  return VALID_KEYS.includes(k as DataKey)
}

const safeJson = (v: unknown) => JSON.stringify(v ?? null)

export async function GET() {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS user_data (
        user_id TEXT PRIMARY KEY,
        transactions JSONB DEFAULT '[]'::jsonb,
        budgets JSONB DEFAULT '[]'::jsonb,
        debts JSONB DEFAULT '[]'::jsonb,
        recurring JSONB DEFAULT '[]'::jsonb,
        savings JSONB DEFAULT '[]'::jsonb,
        obligations JSONB DEFAULT '[]'::jsonb,
        balance JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT * FROM user_data WHERE user_id = $1 LIMIT 1`,
      userId
    )

    if (rows.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO user_data (user_id) VALUES ($1)`,
        userId
      )
      return NextResponse.json({})
    }

    const row = rows[0]
    const result: Record<string, unknown> = {}
    for (const key of VALID_KEYS) {
      const val = row[key]
      if (val == null) {
        result[key] = key === "balance" ? {} : []
      } else if (typeof val === "string") {
        try { result[key] = JSON.parse(val) } catch { result[key] = key === "balance" ? {} : [] }
      } else {
        result[key] = val
      }
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { key, data } = await req.json()

    if (!isValidKey(key)) {
      return NextResponse.json({ error: `Invalid key: ${key}` }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS user_data (
        user_id TEXT PRIMARY KEY,
        transactions JSONB DEFAULT '[]'::jsonb,
        budgets JSONB DEFAULT '[]'::jsonb,
        debts JSONB DEFAULT '[]'::jsonb,
        recurring JSONB DEFAULT '[]'::jsonb,
        savings JSONB DEFAULT '[]'::jsonb,
        obligations JSONB DEFAULT '[]'::jsonb,
        balance JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(
      `INSERT INTO user_data (user_id, ${key}, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (user_id) DO UPDATE SET ${key} = $2::jsonb, updated_at = NOW()`,
      session.user.id,
      safeJson(data)
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
