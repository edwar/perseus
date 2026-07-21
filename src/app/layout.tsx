import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "@/bones/registry"
import "./globals.css"

const fontSans = Inter({ variable: "--font-sans", subsets: ["latin"] })
const fontMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Perseus - Finanzas Personales",
  description: "Controla tus gastos, ingresos y ahorros en un solo lugar",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
