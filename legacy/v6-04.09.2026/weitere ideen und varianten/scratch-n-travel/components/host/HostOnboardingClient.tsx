// components/host/HostOnboardingClient.tsx
"use client";

import { useState } from "react";
import type { RegionConfig } from "@/lib/regions";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/ui/Toast";

const STEPS = ["Betriebsart", "Region", "Hobby-Tags", "Fotos", "Verifizierung", "Auszahlung"];
const BUSINESS_TYPES = ["🏠 Ferienwohnung", "☕ Café", "🏄 Surfschule", "🍽️ Restaurant", "🚐 Tour-Anbieter"];
const HOBBY_TAGS = ["Surfen", "Naturwein", "Klettern", "Hundefreundlich", "Familienfreundlich", "Streetfood"];

export function HostOnboardingClient({ regions }: { regions: RegionConfig[] }) {
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState(regions[0]?.code ?? "");
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [photos, setPhotos] = useState<File[]>([]);
  const [docUploaded, setDocUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const push = useToast();

  const canNext = [
    !!businessType,
    !!regionCode,
    tags.size > 0,
    photos.length > 0,
    docUploaded,
    true,
  ][step];

  async function finish() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ businessType, regionCode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // weiter zu Stripe-Onboarding
      } else {
        push(data.error ?? "Stripe Connect konnte nicht gestartet werden.", "danger");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      {/* Stepper */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div
              style={{
                height: 4,
                borderRadius: 4,
                background: i <= step ? "var(--trust-green)" : "rgba(45,55,72,.1)",
              }}
            />
            <span style={{ fontSize: "var(--fs-micro)", color: i === step ? "var(--trust-green)" : "var(--text-onwarm-muted)", fontWeight: i === step ? 700 : 500 }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: 28, boxShadow: "var(--shadow-warm-card)" }}>
        {step === 0 && (
          <StepBlock title="Welche Art von Betrieb führst du?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {BUSINESS_TYPES.map((b) => (
                <Chip key={b} label={b} active={businessType === b} onClick={() => setBusinessType(b)} />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock title="In welcher Region bist du tätig?">
            <select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
              style={{ padding: 12, borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(45,55,72,.15)", width: "100%" }}
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="Über welche Hobby-Tags sollen dich Reisende finden?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {HOBBY_TAGS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={tags.has(t)}
                  onClick={() =>
                    setTags((prev) => {
                      const next = new Set(prev);
                      next.has(t) ? next.delete(t) : next.add(t);
                      return next;
                    })
                  }
                />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title="Lade ein paar Fotos deines Betriebs hoch">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
            />
            {photos.length > 0 && (
              <p style={{ marginTop: 8, fontSize: "var(--fs-small)", color: "var(--text-secondary)" }}>
                {photos.length} Datei(en) ausgewählt
              </p>
            )}
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title="Gewerbenachweis zur Verifizierung hochladen">
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-secondary)", marginBottom: 12 }}>
              Nötig für den Verifiziert-Partner-Badge — Dokumente werden nur zur Prüfung genutzt.
            </p>
            <Button variant="outline" onClick={() => setDocUploaded(true)}>
              {docUploaded ? "✓ Dokument hochgeladen" : "Dokument auswählen"}
            </Button>
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title="Auszahlungen einrichten">
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-secondary)" }}>
              Letzter Schritt: Stripe-Connect-Setup, damit Buchungen direkt und provisionsfrei bei
              dir ankommen.
            </p>
          </StepBlock>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Zurück
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="friendly" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Weiter
            </Button>
          ) : (
            <Button variant="trust" onClick={finish} loading={submitting}>
              Zu Stripe Connect →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: "var(--fs-h4)", marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}
