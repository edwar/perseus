export function LandingCard({ title, desc, gradient }: { title: string; desc: string; gradient: string }) {
  return (
    <div className="rounded-xl border-0 bg-white/70 p-5 shadow-lg shadow-blue-900/5 ring-1 ring-gray-200/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${gradient}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
    </div>
  )
}
