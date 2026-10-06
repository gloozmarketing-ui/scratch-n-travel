// components/legal/CookieFreeNotice.tsx
// §25 Abs. 2 TDDDG & DSGVO — Architekturprinzip, kein Cookie-Banner nötig,
// solange wirklich NUR localStorage/IndexedDB ohne Tracking genutzt wird.
export function CookieFreeNotice() {
  return (
    <p style={{ fontSize: "var(--fs-small)" }}>
      🔒 <strong>100% Tracking- und Werbe-Cookie-frei:</strong> Einstellungen werden ausschließlich lokal im
      Browser gespeichert (§ 25 Abs. 2 TDDDG &amp; DSGVO konform, ohne Cookie-Banner).
    </p>
  );
}
