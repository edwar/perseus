import { prisma } from "../src/lib/db"

async function main() {
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

  const rows = await prisma.$queryRawUnsafe<Array<{ id: string; data: unknown }>>(
    `SELECT id, data FROM app_sync`
  )

  if (rows.length === 0) {
    console.log("No hay datos en app_sync para migrar")
    return
  }

  for (const row of rows) {
    const userId = row.id === "main" ? null : row.id.replace("user_", "")
    if (!userId) {
      console.log(`Saltando row '${row.id}' — no tiene userId`)
      continue
    }

    const data = row.data as Record<string, unknown>

    await prisma.$executeRawUnsafe(
      `INSERT INTO user_data (user_id, transactions, budgets, debts, recurring, savings, obligations)
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb)
       ON CONFLICT (user_id) DO UPDATE SET
         transactions = EXCLUDED.transactions,
         budgets = EXCLUDED.budgets,
         debts = EXCLUDED.debts,
         recurring = EXCLUDED.recurring,
         savings = EXCLUDED.savings,
         obligations = EXCLUDED.obligations`,
      userId,
      JSON.stringify(data["perseus-transactions"] ?? []),
      JSON.stringify(data["perseus-budgets"] ?? []),
      JSON.stringify(data["perseus-debts"] ?? []),
      JSON.stringify(data["perseus-recurring"] ?? []),
      JSON.stringify(data["perseus-savings"] ?? []),
      JSON.stringify(data["perseus-obligations"] ?? [])
    )

    console.log(`Migrados datos de app_sync.${row.id} → user_data.${userId}`)
  }

  console.log("Migración completada exitosamente")
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
