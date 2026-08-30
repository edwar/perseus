"use client"

import Link from "next/link"
import {
  ArrowRight,
  UserPlus,
  Wallet,
  Receipt,
  Repeat,
  TrendingDown,
  PiggyBank,
  LayoutDashboard,
  ScanLine,
  CheckCircle,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/app/logo"

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Crea tu cuenta",
    desc: "Regístrate con tu correo electrónico o con Google. Es gratis y no requiere tarjeta de crédito.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    tip: "Usa Google para crear tu cuenta en un solo clic.",
  },
  {
    number: "2",
    icon: Wallet,
    title: "Configura tus presupuestos",
    desc: "Define categorías como 'Mercado', 'Transporte', 'Arriendo', etc. Asigna un monto límite mensual a cada una. Esto le da contexto a tus gastos.",
    color: "text-warning",
    bg: "bg-orange-100",
    border: "border-orange-200",
    tip: "Empieza con 3-5 categorías básicas. Puedes agregar más después.",
  },
  {
    number: "3",
    icon: Receipt,
    title: "Registra tus transacciones",
    desc: "Hay dos formas: (a) Manual: ingresa el monto, descripción y categoría. (b) Escaneo: sube un screenshot de tu Nequi, Daviplata o banco y la IA extrae los datos automáticamente.",
    color: "text-success",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    tip: "El escaneo con IA es ideal para recibos de compras diarias. Ahorra minutos cada vez.",
  },
  {
    number: "4",
    icon: Repeat,
    title: "Configura pagos recurrentes",
    desc: "Agrega tus gastos fijos mensuales: arriendo, streaming, gym, planes de datos. Así no se te olvida ninguno y el dashboard refleja tu flujo real.",
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    border: "border-cyan-200",
    tip: "Asocia un recurrente a una deuda para registrar abonos automáticos.",
  },
  {
    number: "5",
    icon: TrendingDown,
    title: "Registra tus deudas",
    desc: "Ingresa cada deuda con su saldo total, tasa de interés, cuota mensual y cuotas restantes. Puedes escanear la factura del banco para auto-completar los datos.",
    color: "text-danger",
    bg: "bg-coral-100",
    border: "border-coral-200",
    tip: "Escanea tu factura ICETEX, Tarjeta de Crédito o préstamo bancario y los campos se llenan solos.",
  },
  {
    number: "6",
    icon: PiggyBank,
    title: "Define metas de ahorro",
    desc: "Crea metas con un monto objetivo y una fecha límite. Ej: 'Viaje a la playa: $2.000.000 para Diciembre'. El progreso se actualiza automáticamente.",
    color: "text-xp",
    bg: "bg-purple-100",
    border: "border-purple-200",
    tip: "Usa metas pequeñas al principio para crear el hábito.",
  },
  {
    number: "7",
    icon: ScanLine,
    title: "Sube documentos",
    desc: "Al escanear un recibo o factura, el documento se guarda automáticamente en la sección Documentos. Puedes ver el PDF original en un visor integrado.",
    color: "text-energy",
    bg: "bg-flame-100",
    border: "border-flame-200",
    tip: "Los documentos se organizan por año y mes para que encuentres rápido cualquier factura.",
  },
  {
    number: "8",
    icon: LayoutDashboard,
    title: "Revisa tu Dashboard",
    desc: "El dashboard te muestra un resumen completo: tu balance actual, ingresos vs gastos del mes, transacciones recientes y el progreso de tus presupuestos y ahorros.",
    color: "text-primary",
    bg: "bg-blue-100",
    border: "border-blue-200",
    tip: "Revisa el dashboard cada semana para mantener el control de tus finanzas.",
  },
]

export default function GuidePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-amber-50" />
      <div className="absolute inset-0 hidden opacity-[0.03] lg:block"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #004587 0.5px, transparent 0.5px),
            radial-gradient(circle at 80% 30%, #00afff 0.5px, transparent 0.5px),
            radial-gradient(circle at 40% 70%, #f59e0b 0.5px, transparent 0.5px),
            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,175,255,0.1) 40px, rgba(0,175,255,0.1) 41px)
          `,
          backgroundSize: "60px 60px, 80px 80px, 100px 100px, 80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold text-neutral-900">Perseus</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
                Registrarse <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>

        <section className="mx-auto mt-16 max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-linear-to-br from-white/60 to-white/20 p-4 shadow-2xl shadow-blue-900/10 ring-1 ring-white/40 backdrop-blur-sm">
            <Logo className="h-full w-full drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Cómo usar Perseus
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-500">
            Sigue estos pasos para configurar tu cuenta y empezar a controlar tus finanzas personales en minutos.
          </p>
        </section>

        <section className="mt-16 space-y-8">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />
                )}
                <div className={`relative flex gap-6 rounded-2xl border bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${s.border}`}>
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                    <Icon className={`h-7 w-7 ${s.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${s.color.replace("text-", "bg-")}`}>
                        {s.number}
                      </span>
                      <h3 className="text-lg font-semibold text-neutral-900">{s.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.desc}</p>
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50/80 px-3 py-2">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                      <p className="text-xs text-blue-700">{s.tip}</p>
                    </div>
                  </div>
                  <ChevronRight className={`hidden h-5 w-5 shrink-0 self-center sm:block ${s.color}`} />
                </div>
              </div>
            )
          })}
        </section>

        <section className="relative mt-16 overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 px-8 py-16 text-center shadow-2xl shadow-blue-500/30">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-300 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              100% gratuito
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              ¿Listo para empezar?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-blue-100">
              Crea tu cuenta gratis y empieza a tomar el control de tu dinero hoy mismo.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl active:scale-[0.98]">
                Crear cuenta gratis
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-white/10">
                Ver landing
              </a>
            </div>
            <p className="mt-5 text-xs text-blue-200/70">
              No requiere tarjeta de crédito
            </p>
          </div>
        </section>

        <footer className="mt-16 border-t border-neutral-200/60 py-8 text-center text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Perseus. Hecho en Colombia.</p>
        </footer>
      </div>
    </div>
  )
}
