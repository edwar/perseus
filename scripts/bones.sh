#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LAYOUT="$ROOT/src/app/(dashboard)/layout.tsx"
CONFIG="$ROOT/boneyard.config.json"

# Backup original files
cp "$LAYOUT" "$LAYOUT.bak"
cp "$CONFIG" "$CONFIG.bak"

# Patch layout: skip auth when __boneyard cookie is set
cat > "$LAYOUT" << 'LAYOUT_EOF'
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/sidebar"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isBoneyardCapture = cookieStore.get("__boneyard")?.value === "1"
  if (!isBoneyardCapture) {
    const session = await getSession()
    if (!session) redirect("/")
  }
  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar />
        <DashboardShell>{children}</DashboardShell>
      </div>
    </Providers>
  )
}
LAYOUT_EOF

# Patch boneyard config: add auth cookie and routes
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('$CONFIG', 'utf8'));
config.routes = ['/dashboard', '/transactions', '/budgets', '/debts', '/obligations', '/recurring', '/savings', '/documents'];
config.auth = { cookies: [{ name: '__boneyard', value: '1', domain: 'localhost', path: '/' }] };
fs.writeFileSync('$CONFIG', JSON.stringify(config, null, 2) + '\n');
"

cleanup() {
  mv "$LAYOUT.bak" "$LAYOUT"
  mv "$CONFIG.bak" "$CONFIG"
  echo "✓ Original files restored"
}
trap cleanup EXIT

echo "💀 Capturing bones..."
npx boneyard-js build http://localhost:3000
