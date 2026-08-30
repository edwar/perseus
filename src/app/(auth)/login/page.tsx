"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAuthClient } from "better-auth/client"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/app/logo"

const authClient = createAuthClient()

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { data, error: authError } = await authClient.signIn.email({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message ?? "Error al iniciar sesión")
      return
    }
    if (data) router.push("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Fondo izquierdo con patrón sutil */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-amber-50 lg:via-55% lg:to-45%" />

      {/* Patrón decorativo de fondo (solo desktop) */}
      <div className="absolute inset-0 hidden opacity-[0.03] lg:block"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #004587 0.5px, transparent 0.5px),
            radial-gradient(circle at 80% 30%, #00afff 0.5px, transparent 0.5px),
            radial-gradient(circle at 40% 70%, #f59e0b 0.5px, transparent 0.5px),
            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,175,255,0.1) 40px, rgba(0,175,255,0.1) 41px)
          `,
          backgroundSize: '60px 60px, 80px 80px, 100px 100px, 80px 80px'
        }}
      />

      {/* Panel izquierdo — Mascota / Logo */}
      <div className="relative hidden w-[55%] flex-col items-center justify-center lg:flex">
        <div className="flex flex-1 flex-col items-center justify-center px-16">
          <div className="flex w-full max-w-md items-center justify-center">
            <div className="flex aspect-square w-full items-center justify-center rounded-[2.5rem] bg-linear-to-br from-white/60 to-white/20 p-8 shadow-2xl shadow-blue-900/10 ring-1 ring-white/40 backdrop-blur-sm">
              <div className="h-full w-full drop-shadow-2xl">
                <Logo className="h-full w-full" />
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Perseus</h1>
            <p className="mt-2 text-base text-neutral-500">Controla tus finanzas personales</p>
          </div>
        </div>

        <div className="w-full px-16 pb-12">
          <blockquote className="border-l-2 border-blue-200 pl-5">
            <p className="text-sm leading-relaxed text-neutral-400 italic">
              &ldquo;La libertad financiera no se trata de tener dinero ilimitado,
              sino de controlar el que tienes.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div className="relative flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-[45%]">
        <div className="w-full max-w-sm rounded-3xl bg-white/40 p-6 sm:p-8 shadow-xl shadow-gray-200/50 backdrop-blur-md ring-1 ring-white/60">
          {/* Mobile header */}
          <div className="mb-6 sm:mb-10 flex flex-col items-center text-center lg:hidden">
            <div className="mb-3 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-linear-to-br from-white/60 to-white/20 p-3 sm:p-4 shadow-lg ring-1 ring-white/40 backdrop-blur-sm">
              <Logo className="h-full w-full" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Perseus</h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">Controla tus finanzas personales</p>
          </div>

          <div className="mb-5 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Iniciar sesión</h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-700 dark:hover:text-blue-300">
                Regístrate
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-neutral-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="h-11 rounded-xl border-gray-200 bg-white/80 pl-4 text-sm shadow-sm backdrop-blur-sm transition-all focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:shadow-blue-500/10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-neutral-700">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border-gray-200 bg-white/80 pl-4 pr-11 text-sm shadow-sm backdrop-blur-sm transition-all focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:shadow-blue-500/10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-sm text-danger">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/35 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="relative my-5 sm:my-7">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-orange-50 px-4 text-neutral-400">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-md active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => authClient.signIn.social({ provider: "google" })}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <p className="mt-5 sm:mt-8 text-center text-xs text-neutral-400">
            Al iniciar sesión aceptas nuestros{" "}
            <a href="#" className="underline hover:text-gray-600">términos</a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-gray-600">política de privacidad</a>
          </p>
        </div>
      </div>
    </div>
  )
}
