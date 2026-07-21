"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAuthClient } from "better-auth/client"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const authClient = createAuthClient()

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

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { data, error: authError } = await authClient.signUp.email({ name, email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message ?? "Error al registrarse")
      return
    }
    if (data) router.push("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-amber-50 lg:via-55% lg:to-45%" />

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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Perseus</h1>
            <p className="mt-2 text-base text-gray-500">Controla tus finanzas personales</p>
          </div>
        </div>

        <div className="w-full px-16 pb-12">
          <blockquote className="border-l-2 border-blue-200 pl-5">
            <p className="text-sm leading-relaxed text-gray-400 italic">
              &ldquo;La libertad financiera no se trata de tener dinero ilimitado,
              sino de controlar el que tienes.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-[45%]">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-white/60 to-white/20 p-4 shadow-lg ring-1 ring-white/40 backdrop-blur-sm">
              <Logo className="h-full w-full" />
            </div>
            <h1 className="text-2xl font-bold">Perseus</h1>
            <p className="mt-1 text-sm text-muted-foreground">Controla tus finanzas personales</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Crear cuenta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:hover:text-blue-300">
                Inicia sesión
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-gray-700">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                autoComplete="name"
                className="h-11 rounded-xl border-gray-200 bg-white/80 pl-4 text-sm shadow-sm backdrop-blur-sm transition-shadow focus-visible:shadow-blue-500/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">
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
                className="h-11 rounded-xl border-gray-200 bg-white/80 pl-4 text-sm shadow-sm backdrop-blur-sm transition-shadow focus-visible:shadow-blue-500/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border-gray-200 bg-white/80 pl-4 pr-11 text-sm shadow-sm backdrop-blur-sm transition-shadow focus-visible:shadow-blue-500/10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Creando cuenta…" : "Crear cuenta"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-amber-50 px-4 text-gray-400">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
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

          <p className="mt-8 text-center text-xs text-gray-400">
            Al registrarte aceptas nuestros{" "}
            <a href="#" className="underline hover:text-gray-600">términos</a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-gray-600">política de privacidad</a>
          </p>
        </div>
      </div>
    </div>
  )
}
