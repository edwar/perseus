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

function Logo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <path d="M434.96 246.919c-.906-9.367-6.325-18.06-13.863-23.876h.003l-25.428-26.458 4.602 19.086a2584 2584 0 0 0-285.748.117c-16.062.943-30.909 15.052-32.466 31.131-5.993 64.29-6.188 128.576-.619 192.868l-18.068-2.061s24.841 26.582 29.414 30.337h.002c5.92 5.694 13.678 9.487 21.737 9.955a2583 2583 0 0 0 287.97 0c16.058-.941 30.912-15.049 32.464-31.129a1074 1074 0 0 0 0-199.97" fill="#004587" />
      <path d="M254.686 257.047a6.003 6.003 0 0 1-3.121-7.894L330.34 67.414a6 6 0 0 1 7.896-3.118l88.777 38.482a6.003 6.003 0 0 1 3.121 7.894L351.356 292.41a5.997 5.997 0 0 1-7.893 3.118z" fill="#00afff" />
      <path d="M267.917 250.708c-2.436-1.06-3.455-4.125-2.273-6.853L330.635 93.92l26.142-9.964 43.605 18.906 9.918 26.385-64.701 149.268c-1.182 2.724-4.115 4.078-6.554 3.023z" fill="#00eee4" />
      <path d="M252.159 241.228a5.554 5.554 0 0 1-3.143 7.199l-109.434 42.906a5.55 5.55 0 0 1-7.194-3.143L65.309 117.098a5.555 5.555 0 0 1 3.143-7.199l109.434-42.904a5.557 5.557 0 0 1 7.197 3.145" fill="#FFD548" />
      <path d="M403.856 415.03c-1.555 16.08-16.406 30.188-32.464 31.129a2582 2582 0 0 1-287.967 0c-16.062-.94-30.912-15.049-32.466-31.129a1074.3 1074.3 0 0 1 0-199.97c1.554-16.08 16.401-30.193 32.466-31.131a2583 2583 0 0 1 287.967 0c16.06.938 30.907 15.052 32.464 31.131a1074 1074 0 0 1 0 199.97" fill="#FF854A" />
      <path d="M219.756 273.059c-3.274 29.172-29.582 50.164-58.752 46.892-29.175-3.277-50.166-29.582-46.892-58.754 3.274-29.173 29.582-50.169 58.754-46.892 29.173 3.276 50.167 29.584 46.89 58.754" fill="#FFFFFF" />
      <path d="M210.184 271.982c-2.424 21.574-21.871 37.093-43.444 34.671-21.573-2.417-37.098-21.873-34.671-43.442 2.419-21.571 21.871-37.093 43.444-34.671 21.571 2.422 37.093 21.875 34.671 43.442" fill="#004587" />
      <ellipse cx="389.998" cy="334.268" rx="17.831" ry="17.829" fill="#004587" />
    </svg>
  )
}

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
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    tip: "Empieza con 3-5 categorías básicas. Puedes agregar más después.",
  },
  {
    number: "3",
    icon: Receipt,
    title: "Registra tus transacciones",
    desc: "Hay dos formas: (a) Manual: ingresa el monto, descripción y categoría. (b) Escaneo: sube un screenshot de tu Nequi, Daviplata o banco y la IA extrae los datos automáticamente.",
    color: "text-emerald-600",
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
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    tip: "Escanea tu factura ICETEX, Tarjeta de Crédito o préstamo bancario y los campos se llenan solos.",
  },
  {
    number: "6",
    icon: PiggyBank,
    title: "Define metas de ahorro",
    desc: "Crea metas con un monto objetivo y una fecha límite. Ej: 'Viaje a la playa: $2.000.000 para Diciembre'. El progreso se actualiza automáticamente.",
    color: "text-violet-600",
    bg: "bg-violet-100",
    border: "border-violet-200",
    tip: "Usa metas pequeñas al principio para crear el hábito.",
  },
  {
    number: "7",
    icon: ScanLine,
    title: "Sube documentos",
    desc: "Al escanear un recibo o factura, el documento se guarda automáticamente en la sección Documentos. Puedes ver el PDF original en un visor integrado.",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-200",
    tip: "Los documentos se organizan por año y mes para que encuentres rápido cualquier factura.",
  },
  {
    number: "8",
    icon: LayoutDashboard,
    title: "Revisa tu Dashboard",
    desc: "El dashboard te muestra un resumen completo: tu balance actual, ingresos vs gastos del mes, transacciones recientes y el progreso de tus presupuestos y ahorros.",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    border: "border-indigo-200",
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
            <span className="text-lg font-bold text-gray-900">Perseus</span>
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cómo usar Perseus
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500">
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
                      <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.desc}</p>
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

        <section className="mt-16 rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 px-8 py-14 text-center shadow-2xl shadow-blue-500/30">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Listo para empezar?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-blue-100">
            Crea tu cuenta gratis y empieza a tomar el control de tu dinero hoy mismo.
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-8 gap-2 bg-white px-8 text-blue-700 shadow-lg transition-all hover:bg-blue-50 active:scale-[0.98]">
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>

        <footer className="mt-16 border-t border-gray-200/60 py-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Perseus. Hecho en Colombia.</p>
        </footer>
      </div>
    </div>
  )
}
