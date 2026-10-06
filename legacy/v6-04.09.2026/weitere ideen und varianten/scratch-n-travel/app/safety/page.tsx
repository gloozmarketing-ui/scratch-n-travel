// app/safety/page.tsx
import { SafetyRadarClient } from "@/components/safety/SafetyRadarClient";
import { CommunitySafetyNotice } from "@/components/legal/CommunitySafetyNotice";

export default function SafetyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "var(--font-hud)", fontSize: "var(--fs-micro)", color: "var(--accent-teal)" }}>
        🚦 LOCAL SAFETY &amp; SCAM-RADAR
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", marginTop: 8 }}>
        Sicherheit vor Ort
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 560 }}>
        Sicherheitsinfos sind immer sofort sichtbar — bewusst ohne Freischalt-Mechanik, anders
        als bei Story-Pins.
      </p>
      <SafetyRadarClient />
      <div style={{ marginTop: 40 }}>
        <CommunitySafetyNotice />
      </div>
    </main>
  );
}
