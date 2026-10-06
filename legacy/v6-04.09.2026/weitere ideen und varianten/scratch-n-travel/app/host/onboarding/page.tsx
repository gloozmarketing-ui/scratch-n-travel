// app/host/onboarding/page.tsx
import { getRegions } from "@/lib/regions";
import { HostOnboardingClient } from "@/components/host/HostOnboardingClient";

export default async function HostOnboardingPage() {
  const { regions } = await getRegions();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "var(--font-hud)", fontSize: "var(--fs-micro)", color: "var(--accent-teal)" }}>
        🌟 B2B HOST- &amp; PARTNER-PORTAL
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", marginTop: 8 }}>
        Betrieb eintragen
      </h1>
      <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
        <ValueProp icon="💸" title="0% Provision" />
        <ValueProp icon="🧬" title="Zielgerichtetes Hobby-Matching" />
        <ValueProp icon="🔑" title="Volle Einnahmenkontrolle" />
      </div>
      <HostOnboardingClient regions={regions} />
    </main>
  );
}

function ValueProp({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: 16, boxShadow: "var(--shadow-warm-card)", flex: 1, minWidth: 180 }}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <p style={{ fontWeight: 700, marginTop: 8, fontSize: "var(--fs-small)" }}>{title}</p>
    </div>
  );
}
