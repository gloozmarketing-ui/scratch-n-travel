// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { CookieFreeNotice } from "@/components/legal/CookieFreeNotice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Anmelden</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: "var(--fs-small)" }}>
        Kein Passwort nötig — wir schicken dir einen Magic Link. Datensparsam, wie es
        das cookie-freie Prinzip von Scratch&apos;n&apos;Travel vorsieht.
      </p>

      {sent ? (
        <p style={{ marginTop: 24, background: "var(--trust-green-bg)", color: "var(--trust-green)", padding: 16, borderRadius: "var(--radius-md)" }}>
          ✓ Link verschickt — check dein Postfach ({email}).
        </p>
      ) : (
        <form onSubmit={sendMagicLink} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.com"
            style={{ padding: 14, borderRadius: "var(--radius-pill)", border: "1.5px solid rgba(45,55,72,.15)" }}
          />
          <Button variant="friendly" type="submit" loading={loading}>
            Magic Link senden
          </Button>
          {error && <p style={{ color: "var(--status-danger)", fontSize: "var(--fs-small)" }}>{error}</p>}
        </form>
      )}

      <div style={{ marginTop: 32 }}>
        <CookieFreeNotice />
      </div>
    </main>
  );
}
