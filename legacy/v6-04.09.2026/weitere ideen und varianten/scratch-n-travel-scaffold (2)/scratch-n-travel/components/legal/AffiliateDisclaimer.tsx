// components/legal/AffiliateDisclaimer.tsx
// Pflicht-Komponente überall wo Affiliate-Links vorkommen (eSIM-Modul etc.),
// Konsistenzpflicht laut Kapitel 8.10 / 12.
export function AffiliateDisclaimer() {
  return (
    <p style={{ fontSize: "var(--fs-micro)", color: "var(--text-onwarm-muted)", marginTop: "var(--space-3)" }}>
      *Enthält unabhängige Empfehlungen &amp; Werbelinks (Affiliate) gem. § 5a Abs. 4 UWG / TMG
    </p>
  );
}
