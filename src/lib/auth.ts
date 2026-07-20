import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"
import { headers } from "next/headers"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 604800,
    updateAge: 86400,
  },
})

export async function getSession() {
  const requestHeaders = await headers()
  return auth.api.getSession({ headers: requestHeaders })
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")
  return session
}
