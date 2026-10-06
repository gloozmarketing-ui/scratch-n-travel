// components/pricing/PricingCards.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export function PricingCards({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false);
  const push = useToast();
  const router = useRouter();

  async function startCheckout() {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else push(data.error ?? "Checkout konnte nicht gestartet werden.", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 8 }}>
      <PlanCard title="🌱 Free Explorer" price="0 €" desc="Für Gelegenheits-Reisende">
        <Button variant="outline">Kostenlos nutzen</Button>
      </PlanCard>

      <PlanCard title="Pro VIP Explorer" price="9 €" popular desc="Vollzugriff für Familien & Roadtripper">
        <Button variant="friendly" onClick={startCheckout} loading={loading}>
          In der Beta kostenlos testen
        </Button>
      </PlanCard>

      <PlanCard title="🌟 Business & Host" price="29 €" desc="Für Ferienwohnungen, Cafés & Surfschulen">
        <Button variant="outline" onClick={() => router.push("/host/onboarding")}>
          Als Host eintragen
        </Button>
      </PlanCard>
    </div>
  );
}

function PlanCard({
  title,
  price,
  desc,
  popular,
  children,
}: {
  title: string;
  price: string;
  desc: string;
  popular?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-md)",
        padding: 28,
        boxShadow: "var(--shadow-warm-card)",
        border: popular ? "2px solid var(--cta-gradient-end)" : "1px solid rgba(45,55,72,.06)",
      }}
    >
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{title}</span>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, marginTop: 8 }}>
        {price} <small style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-secondary)" }}>/ Monat</small>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-small)", marginTop: 4 }}>{desc}</p>
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
}
