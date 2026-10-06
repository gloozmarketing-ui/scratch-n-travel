// app/concierge/page.tsx
import { ConciergeChat } from "@/components/concierge/ConciergeChat";

export default function ConciergePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)" }}>KI Travel Concierge</h1>
      <ConciergeChat />
    </main>
  );
}
