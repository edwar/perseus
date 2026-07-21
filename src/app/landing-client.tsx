import { Logo } from "./logo"
import { LandingCard } from "./landing-card"

const features = [
  {
    title: "Dashboard",
    desc: "Resumen completo de tus finanzas: ingresos, gastos, balance y transacciones recientes en tiempo real.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Transacciones",
    desc: "Registra cada ingreso y gasto. Organiza por categorías, busca y edita. Escanea recibos con IA.",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Deudas",
    desc: "Controla tus deudas con saldo, tasa de interés y progreso de pago. Escanea facturas bancarias.",
    gradient: "from-red-500 to-red-600",
  },
  {
    title: "Ahorros",
    desc: "Define metas de ahorro con monto objetivo y fecha límite. Sigue tu progreso mes a mes.",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Presupuestos",
    desc: "Asigna presupuestos por categoría con items detallados. Compara tu gasto real vs planeado.",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    title: "Recurrentes",
    desc: "Administra pagos e ingresos periódicos. Asocia a deudas para registrar abonos automáticos.",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Obligaciones",
    desc: "Lleva el control de tus obligaciones financieras mensuales con pagos parciales y fechas de corte.",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Documentos",
    desc: "Almacena recibos y facturas escaneados. Visor PDF integrado y búsqueda por año y mes.",
    gradient: "from-orange-500 to-orange-600",
  },
]

export function LandingPage() {
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

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900">Perseus</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
              Iniciar sesión
            </a>
            <a href="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30">
              Registrarse
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </header>

        <section className="mx-auto mt-24 max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-white/60 to-white/20 p-5 shadow-2xl shadow-blue-900/10 ring-1 ring-white/40 backdrop-blur-sm">
            <Logo className="h-full w-full drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Controla tus{" "}
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              finanzas personales
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500">
            Perseus te ayuda a registrar, organizar y visualizar tus ingresos, gastos, deudas y ahorros
            en un solo lugar. Con escaneo inteligente de recibos y facturas.
          </p>
          <div className="mt-6">
            <a href="/guide" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver guía paso a paso
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="/register" className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-8 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]">
              Comenzar gratis
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="/login" className="inline-flex items-center rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Iniciar sesión
            </a>
          </div>
        </section>

        <section className="mt-32">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Todo lo que necesitas para tus finanzas
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Ocho módulos diseñados para darte control total de tu dinero.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <LandingCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        <section className="mt-32 rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 px-8 py-16 text-center shadow-2xl shadow-blue-500/30">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Empieza hoy a tomar el control
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-blue-100">
            Sin tarjeta de crédito. Sin complicaciones. Crea tu cuenta gratis en segundos.
          </p>
          <a href="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-medium text-blue-700 shadow-lg transition-all hover:bg-blue-50 active:scale-[0.98]">
            Crear cuenta gratis
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </section>

        <footer className="mt-20 border-t border-gray-200/60 py-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Perseus. Hecho en Colombia.</p>
        </footer>
      </div>
    </div>
  )
}
