import { createCrudRoute } from "@/lib/crud"

const SQL = `
  CREATE TABLE IF NOT EXISTS app_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT NOT NULL,
    category TEXT,
    date TEXT NOT NULL,
    recurring BOOLEAN DEFAULT false,
    frequency TEXT,
    next_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const crud = createCrudRoute({
  table: "app_transactions",
  columns: ["id", "user_id", "description", "amount", "type", "category", "date", "recurring", "frequency", "next_date", "created_at"],
})

export const GET = crud.GET(SQL)
export const POST = crud.POST(SQL)
export const PATCH = crud.PATCH(SQL)
export const DELETE = crud.DELETE(SQL)