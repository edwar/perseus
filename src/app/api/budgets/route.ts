import { createCrudRoute } from "@/lib/crud"

const SQL = `
  CREATE TABLE IF NOT EXISTS app_budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    color TEXT,
    items JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const crud = createCrudRoute({
  table: "app_budgets",
  columns: ["id", "user_id", "category", "amount", "color", "items", "created_at"],
})

export const GET = crud.GET(SQL)
export const POST = crud.POST(SQL)
export const PATCH = crud.PATCH(SQL)
export const DELETE = crud.DELETE(SQL)