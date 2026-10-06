const logos = ['NORDWIND', 'BERGMANN & SÖHNE', 'HELIOS ENERGIE', 'KÖNIG WERKE', 'ALPENSTEIN AG', 'VECTOR INDUSTRIES']

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-surface/40 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-8">
          Über 2.400 B2B-Unternehmen vertrauen LeadPulse
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-50">
          {logos.map((l) => (
            <span key={l} className="font-display font-bold text-slate-300 tracking-widest text-sm sm:text-base whitespace-nowrap">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
