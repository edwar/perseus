import { createCrudRoute } from "@/lib/crud"

const SQL = `
  CREATE TABLE IF NOT EXISTS app_debts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    creditor TEXT,
    category TEXT,
    total DECIMAL(15,2) NOT NULL,
    remaining DECIMAL(15,2) NOT NULL,
    rate DECIMAL(5,2) DEFAULT 0,
    monthly DECIMAL(15,2) DEFAULT 0,
    minimum DECIMAL(15,2),
    installments INTEGER,
    paid INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const crud = createCrudRoute({
  table: "app_debts",
  columns: ["id", "user_id", "name", "creditor", "category", "total", "remaining", "rate", "monthly", "minimum", "installments", "paid", "created_at"],
})

export const GET = crud.GET(SQL)
export const POST = crud.POST(SQL)
export const PATCH = crud.PATCH(SQL)
export const DELETE = crud.DELETE(SQL)