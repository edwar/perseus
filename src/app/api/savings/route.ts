import { createCrudRoute } from "@/lib/crud"

const GOAL_SQL = `
  CREATE TABLE IF NOT EXISTS app_savings_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    target DECIMAL(15,2) NOT NULL,
    current DECIMAL(15,2) DEFAULT 0,
    deadline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const INV_SQL = `
  CREATE TABLE IF NOT EXISTS app_investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    entity TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    rate DECIMAL(5,2) DEFAULT 0,
    term_days INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const goalCrud = createCrudRoute({
  table: "app_savings_goals",
  columns: ["id", "user_id", "name", "target", "current", "deadline", "created_at"],
})

const invCrud = createCrudRoute({
  table: "app_investments",
  columns: ["id", "user_id", "entity", "amount", "rate", "term_days", "start_date", "end_date", "created_at"],
})

export async function GET() {
  try {
    const [goals, investments] = await Promise.all([
      goalCrud.GET(GOAL_SQL)(),
      invCrud.GET(INV_SQL)(),
    ])
    const goalData = await goals.json()
    const invData = await investments.json()
    return Response.json({ goals: goalData, investments: invData })
  } catch {
    return Response.json({ goals: [], investments: [] })
  }
}

export const POST = goalCrud.POST(GOAL_SQL)