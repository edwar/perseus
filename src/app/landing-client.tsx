"use client"

import { useState } from "react"
import { Logo } from "./logo"
import { LandingCard } from "./landing-card"

const features = [
  {
    title: "Dashboard",
    desc: "Resumen completo de tus finanzas: ingresos, gastos, balance y transacciones recientes en tiempo real.",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9" rx="1"/><rect x="7" y="8" width="4" height="13" rx="1"/><rect x="11" y="4" width="4" height="17" rx="1"/><rect x="15" y="9" width="4" height="12" rx="1"/>
      </svg>
    ),
  },
  {
    title: "Transacciones",
    desc: "Registra cada ingreso y gasto. Organiza por categorías, busca y edita. Escanea recibos con IA.",
    gradient: "from-emerald-500 to-emerald-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/>
      </svg>
    ),
  },
  {
    title: "Deudas",
    desc: "Controla tus deudas con saldo, tasa de interés y progreso de pago. Escanea facturas bancarias.",
    gradient: "from-coral-400 to-coral-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Ahorros",
    desc: "Define metas de ahorro con monto objetivo y fecha límite. Sigue tu progreso mes a mes.",
    gradient: "from-purple-500 to-purple-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
      </svg>
    ),
  },
  {
    title: "Presupuestos",
    desc: "Asigna presupuestos por categoría con items detallados. Compara tu gasto real vs planeado.",
    gradient: "from-orange-500 to-orange-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a3 3 0 0 0-3-3h-9"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
      </svg>
    ),
  },
  {
    title: "Recurrentes",
    desc: "Administra pagos e ingresos periódicos. Asocia a deudas para registrar abonos automáticos.",
    gradient: "from-cyan-500 to-cyan-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>
      </svg>
    ),
  },
  {
    title: "Obligaciones",
    desc: "Lleva el control de tus obligaciones financieras mensuales con pagos parciales y fechas de corte.",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: "Documentos",
    desc: "Almacena recibos y facturas escaneados. Visor PDF integrado y búsqueda por año y mes.",
    gradient: "from-flame-400 to-flame-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
      </svg>
    ),
  },
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-amber-50" />
      <div
        className="absolute inset-0 hidden opacity-[0.03] lg:block"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #004587 0.5px, transparent 0.5px),
            radial-gradient(circle at 80% 30%, #00afff 0.5px, transparent 0.5px),
            radial-gradient(circle at 40% 70%, #f59e0b 0.5px, transparent 0.5px),
            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,175,255,0.1) 40px, rgba(0,175,255,0.1) 41px)`,
          backgroundSize: "60px 60px, 80px 80px, 100px 100px, 80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold text-neutral-900">Perseus</span>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            <a href="/login" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
              Iniciar sesión
            </a>
            <a href="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30">
              Registrarse
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>

          {/* Mobile menu dropdown - positioned absolutely */}
          <div 
            className={`sm:hidden absolute top-full right-0 mt-2 w-56 rounded-xl border border-neutral-200/60 bg-white/95 p-2 shadow-xl backdrop-blur-sm transition-all duration-200 origin-top-right z-50 ${
              mobileMenuOpen 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="flex flex-col gap-1">
              <a href="/login" className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                Iniciar sesión
              </a>
              <a href="/register" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20">
                Registrarse
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </header>

        <section className="mx-auto mt-16 sm:mt-24 max-w-3xl text-center">
          <div className="mx-auto mb-6 sm:mb-8 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[1.5rem] sm:rounded-[1.75rem] bg-linear-to-br from-white/60 to-white/20 p-4 sm:p-5 shadow-2xl shadow-blue-900/10 ring-1 ring-white/40 backdrop-blur-sm animate-fade-in">
            <Logo className="h-full w-full drop-shadow-lg" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Controla tus{" "}
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              finanzas personales
            </span>
          </h1>
          <p className="mx-auto mt-5 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-neutral-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Perseus te ayuda a registrar, organizar y visualizar tus ingresos, gastos, deudas y ahorros
            en un solo lugar. Con escaneo inteligente de recibos y facturas.
          </p>
          <div className="mt-5 sm:mt-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="/guide" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver guía paso a paso
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-8 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]">
              Comenzar gratis
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
              Iniciar sesión
            </a>
          </div>
        </section>

        <section className="mt-20 sm:mt-32">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Todo lo que necesitas para tus finanzas
            </h2>
            <p className="mt-2 sm:mt-3 text-sm text-neutral-500">
              Ocho módulos diseñados para darte control total de tu dinero.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <LandingCard key={f.title} title={f.title} desc={f.desc} gradient={f.gradient} icon={f.icon} />
            ))}
          </div>
        </section>

        <section className="relative mt-20 sm:mt-32 overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 px-6 py-12 sm:px-8 sm:py-20 text-center shadow-2xl shadow-blue-500/30">
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Empieza hoy a tomar el control
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-blue-100">
              Sin tarjeta de crédito. Sin complicaciones. Crea tu cuenta gratis en segundos.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl active:scale-[0.98]">
                Crear cuenta gratis
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="/guide" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-white/10">
                Ver demo
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </a>
            </div>
            <p className="mt-5 text-xs text-blue-200/70">
              No requiere tarjeta de crédito
            </p>
          </div>
        </section>

        <footer className="mt-12 sm:mt-20 border-t border-neutral-200/60 py-6 sm:py-8 text-center text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Perseus. Hecho en Colombia.</p>
        </footer>
      </div>
    </div>
  )
}
