// app/pricing/page.tsx
import { createClient } from "@/lib/supabase/server";
import { PricingCards } from "@/components/pricing/PricingCards";
import { AdminStripeModeToggle } from "@/components/pricing/AdminStripeModeToggle";

export default async function PricingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ background: "var(--trust-green-bg)", border: "1px solid var(--trust-green-border)", borderRadius: "var(--radius-md)", padding: 16, fontSize: "var(--fs-small)" }}>
        🚧 Pre-Launch Beta — alle Funktionen aktuell kostenlos testbar. Preise gelten ab offiziellem Launch.
      </div>

      {/* Der Stripe-Live-Mode-Toggle aus dem Original-Blueprint war öffentlich
          sichtbar (Debug-Feature im Frontend). Hier: nur gerendert, wenn die
          Server-Session (nicht der Client!) role='admin' bestätigt — echte
          Nutzer sehen diese Komponente nie im DOM. */}
      {isAdmin && <AdminStripeModeToggle />}

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", marginTop: 24 }}>
        Ein Plan für jede Reiseart
      </h1>
      <PricingCards isLoggedIn={!!user} />
    </main>
  );
}
