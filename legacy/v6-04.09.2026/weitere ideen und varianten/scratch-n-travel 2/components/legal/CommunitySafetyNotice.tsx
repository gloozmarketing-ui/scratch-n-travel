// components/legal/CommunitySafetyNotice.tsx
// § 7 TMG / BGB Sicherheitshinweis — 4 Goldene Regeln, wiederverwendbar
// überall wo Community-Treffen vermittelt werden.
const RULES = [
  { icon: "☕", title: "Öffentliche Orte", text: "Erste Treffen ausschließlich an belebten Orten (Cafés, Strände)." },
  { icon: "📱", title: "Live-Standort", text: "Informiere Freunde oder Familie vorab über Ort und Begleitung." },
  { icon: "🚗", title: "Eigene Mobilität", text: "Sorge selbstständig für deine An- und Abreise." },
  { icon: "🛑", title: "Bauchgefühl", text: "Bei Unbehagen das Treffen jederzeit sofort abbrechen." },
];

export function CommunitySafetyNotice() {
  return (
    <div
      style={{
        background: "var(--trust-green-bg)",
        border: "1px solid var(--trust-green-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-7)",
      }}
    >
      <h3 style={{ fontSize: "var(--fs-h4)" }}>
        🛡️ Sicherheitshinweis &amp; Eigenverantwortung bei Community-Treffen (§ 7 TMG / BGB)
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
          marginTop: "var(--space-5)",
        }}
      >
        {RULES.map((r) => (
          <div key={r.title} style={{ background: "#fff", borderRadius: "var(--radius-sm)", padding: "var(--space-4)" }}>
            <b style={{ display: "block", color: "var(--trust-green)", marginBottom: 4 }}>
              {r.icon} {r.title}
            </b>
            <span style={{ fontSize: "var(--fs-small)" }}>{r.text}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: "var(--space-4)", fontSize: "var(--fs-micro)", color: "var(--text-secondary)" }}>
        ⚖️ Haftungsausschluss: Scratch&apos;n&apos;Travel stellt lediglich die technische Vermittlungsplattform bereit.
        Die Teilnahme an privaten Treffen erfolgt auf eigenes Risiko und in voller Eigenverantwortung der Teilnehmer.
      </p>
    </div>
  );
}
