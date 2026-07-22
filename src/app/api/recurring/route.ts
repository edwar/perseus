import { createCrudRoute } from "@/lib/crud"

const SQL = `
  CREATE TABLE IF NOT EXISTS app_recurring (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT NOT NULL,
    frequency TEXT NOT NULL,
    day_of_month INTEGER NOT NULL,
    category TEXT,
    debt_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const crud = createCrudRoute({
  table: "app_recurring",
  columns: ["id", "user_id", "name", "amount", "type", "frequency", "day_of_month", "category", "debt_id", "created_at"],
})

export const GET = crud.GET(SQL)
export const POST = crud.POST(SQL)
export const PATCH = crud.PATCH(SQL)
export const DELETE = crud.DELETE(SQL)