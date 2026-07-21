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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "credential"],
      requireLocalEmailVerified: false,
    },
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
