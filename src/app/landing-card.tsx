export function LandingCard({ title, desc, gradient, icon }: { title: string; desc: string; gradient: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border-0 bg-white/70 p-4 sm:p-5 shadow-lg shadow-blue-900/5 ring-1 ring-neutral-200/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl landing-card animate-fade-in-up">
      <div className={`mb-3 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-linear-to-br ${gradient}`}>
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="text-xs leading-relaxed text-neutral-500">{desc}</p>
    </div>
  )
}
