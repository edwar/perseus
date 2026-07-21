"use client"

import { ArrowRight, BarChart3, TrendingDown, Wallet, PiggyBank, Repeat, ScanLine, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function Logo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <path d="M434.96 246.919c-.906-9.367-6.325-18.06-13.863-23.876h.003l-25.428-26.458 4.602 19.086a2584 2584 0 0 0-285.748.117c-16.062.943-30.909 15.052-32.466 31.131-5.993 64.29-6.188 128.576-.619 192.868l-18.068-2.061s24.841 26.582 29.414 30.337h.002c5.92 5.694 13.678 9.487 21.737 9.955a2583 2583 0 0 0 287.97 0c16.058-.941 30.912-15.049 32.464-31.129a1074 1074 0 0 0 0-199.97" fill="#004587" />
      <path d="M254.686 257.047a6.003 6.003 0 0 1-3.121-7.894L330.34 67.414a6 6 0 0 1 7.896-3.118l88.777 38.482a6.003 6.003 0 0 1 3.121 7.894L351.356 292.41a5.997 5.997 0 0 1-7.893 3.118z" fill="#00afff" />
      <path d="M267.917 250.708c-2.436-1.06-3.455-4.125-2.273-6.853L330.635 93.92l26.142-9.964 43.605 18.906 9.918 26.385-64.701 149.268c-1.182 2.724-4.115 4.078-6.554 3.023z" fill="#00eee4" />
      <path d="m413.947 108.739-13.565-5.879a19 19 0 0 0-.799 1.613c-4.064 9.382.243 20.28 9.621 24.348q.543.232 1.096.424l5.92-13.658c1.182-2.723.161-5.793-2.273-6.848M356.37 84.978c.146-.339.278-.68.407-1.023l-13.958-6.049c-2.439-1.055-5.37.3-6.554 3.023l-5.63 12.99q.676.367 1.391.682c9.38 4.066 20.278-.243 24.344-9.623M345.599 278.513l5.547-12.798a20 20 0 0 0-1.25-.604c-9.377-4.066-20.278.244-24.344 9.621q-.173.406-.326.816l13.819 5.988c2.439 1.056 5.372-.299 6.554-3.023M282.34 255.237c4.064-9.382-.244-20.28-9.621-24.341a17 17 0 0 0-1.245-.487l-5.83 13.446c-1.182 2.729-.163 5.794 2.273 6.853l13.729 5.95c.248-.461.482-.934.694-1.421M357.953 132.517c-6.203-2.685-9.051-9.894-6.361-16.099 2.687-6.203 9.894-9.051 16.099-6.364 6.2 2.69 9.051 9.899 6.361 16.102-2.687 6.201-9.896 9.054-16.099 6.361M307.556 248.788c-6.203-2.69-9.051-9.899-6.364-16.097 2.69-6.205 9.896-9.053 16.099-6.366 6.203 2.69 9.053 9.899 6.361 16.102-2.686 6.2-9.893 9.048-16.096 6.361M327.522 210.65c-18.155-7.869-27.055-27.667-19.88-44.224 7.175-16.552 27.711-23.596 45.863-15.724 18.156 7.869 27.053 27.667 19.88 44.219-7.177 16.557-27.71 23.596-45.863 15.729" fill="#00afff" />
      <path d="m188.701 237.661-30.23-195.755a6.007 6.007 0 0 1 6.851-5.016l95.623 14.769a6 6 0 0 1 5.016 6.848l-30.23 195.76a6 6 0 0 1-6.851 5.012z" fill="#00afff" />
      <path d="M199.895 228.174c-2.627-.407-4.385-3.116-3.93-6.049l24.941-161.501 22.767-16.255 46.97 7.253 16.272 23.023-24.831 160.777c-.453 2.938-2.948 4.985-5.574 4.583z" fill="#00eee4" />
      <path d="M252.159 241.228a5.554 5.554 0 0 1-3.143 7.199l-109.434 42.906a5.55 5.55 0 0 1-7.194-3.143L65.309 117.098a5.555 5.555 0 0 1 3.143-7.199l109.434-42.904a5.557 5.557 0 0 1 7.197 3.145" fill="#FFD548" />
      <path d="M153.396 234.238c-7.506 2.941-15.977-.755-18.92-8.264-2.943-7.504.755-15.975 8.264-18.923 7.506-2.943 15.98.755 18.92 8.264 2.943 7.507-.755 15.98-8.264 18.923" fill="#FF6081" />
      <path d="M161.733 255.498c-7.509 2.943-15.982-.76-18.925-8.261-2.943-7.509.758-15.98 8.266-18.923 7.509-2.948 15.98.755 18.923 8.259 2.943 7.508-.758 15.979-8.264 18.925" fill="#ECBC4B" />
      <path d="M403.856 415.03c-1.555 16.08-16.406 30.188-32.464 31.129a2582 2582 0 0 1-287.967 0c-16.062-.94-30.912-15.049-32.466-31.129a1074.3 1074.3 0 0 1 0-199.97c1.554-16.08 16.401-30.193 32.466-31.131a2583 2583 0 0 1 287.967 0c16.06.938 30.907 15.052 32.464 31.131a1074 1074 0 0 1 0 199.97" fill="#FF854A" />
      <path d="M422.482 314.783h-61.57c-3.859 0-6.468 4.244-5.83 9.482l5.314 43.454c.638 5.238 4.283 9.485 8.147 9.485h52.641a977 977 0 0 0 1.298-62.421" fill="#004587" />
      <path d="M219.756 273.059c-3.274 29.172-29.582 50.164-58.752 46.892-29.175-3.277-50.166-29.582-46.892-58.754 3.274-29.173 29.582-50.169 58.754-46.892 29.173 3.276 50.167 29.584 46.89 58.754" fill="#FFFFFF" />
      <path d="M210.184 271.982c-2.424 21.574-21.871 37.093-43.444 34.671-21.573-2.417-37.098-21.873-34.671-43.442 2.419-21.571 21.871-37.093 43.444-34.671 21.571 2.422 37.093 21.875 34.671 43.442" fill="#004587" />
      <path d="M335.359 275.198c-3.269 29.172-29.577 50.164-58.749 46.892-29.177-3.277-50.169-29.584-46.892-58.757 3.277-29.175 29.582-50.166 58.752-46.889 29.177 3.271 50.169 29.581 46.889 58.754" fill="#FFFFFF" />
      <path d="M318.093 274.252c-2.422 21.571-21.871 37.095-43.442 34.671-21.576-2.422-37.095-21.873-34.673-43.444 2.422-21.569 21.871-37.098 43.444-34.671 21.571 2.422 37.09 21.873 34.671 43.444" fill="#004587" />
      <ellipse cx="389.998" cy="334.268" rx="17.831" ry="17.829" fill="#004587" />
    </svg>
  )
}

const features = [
  {
    icon: Wallet,
    title: "Dashboard",
    desc: "Resumen completo de tus finanzas: ingresos, gastos, balance y transacciones recientes en tiempo real.",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: ArrowRight,
    title: "Transacciones",
    desc: "Registra cada ingreso y gasto. Organiza por categorías, busca y edita. Escanea recibos con IA.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: TrendingDown,
    title: "Deudas",
    desc: "Controla tus deudas con saldo, tasa de interés y progreso de pago. Escanea facturas bancarias.",
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    icon: PiggyBank,
    title: "Ahorros",
    desc: "Define metas de ahorro con monto objetivo y fecha límite. Sigue tu progreso mes a mes.",
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    icon: BarChart3,
    title: "Presupuestos",
    desc: "Asigna presupuestos por categoría con items detallados. Compara tu gasto real vs planeado.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: Repeat,
    title: "Recurrentes",
    desc: "Administra pagos e ingresos periódicos. Asocia a deudas para registrar abonos automáticos.",
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    icon: CheckSquare,
    title: "Obligaciones",
    desc: "Lleva el control de tus obligaciones financieras mensuales con pagos parciales y fechas de corte.",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    icon: ScanLine,
    title: "Documentos",
    desc: "Almacena recibos y facturas escaneados. Visor PDF integrado y búsqueda por año y mes.",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
]

export function LandingPage() {
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

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900">Perseus</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </a>
            <a href="/register">
              <Button size="sm" className="gap-1.5 bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
                Registrarse <ArrowRight className="h-3.5 w-3.5" />
              </Button>
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
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="gap-2 bg-linear-to-r from-blue-600 to-blue-500 px-8 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]">
                Comenzar gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="/login">
              <Button variant="outline" size="lg" className="px-8">
                Iniciar sesión
              </Button>
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
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} className="border-0 bg-white/70 shadow-lg shadow-blue-900/5 ring-1 ring-gray-200/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                  <CardContent className="p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}>
                      <Icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-500">{f.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-32 rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 px-8 py-16 text-center shadow-2xl shadow-blue-500/30">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Empieza hoy a tomar el control
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-blue-100">
            Sin tarjeta de crédito. Sin complicaciones. Crea tu cuenta gratis en segundos.
          </p>
          <a href="/register">
            <Button size="lg" className="mt-8 gap-2 bg-white px-8 text-blue-700 shadow-lg transition-all hover:bg-blue-50 active:scale-[0.98]">
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </section>

        <footer className="mt-20 border-t border-gray-200/60 py-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Perseus. Hecho en Colombia.</p>
        </footer>
      </div>
    </div>
  )
}
