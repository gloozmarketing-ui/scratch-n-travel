// components/safety/SafetyRadarClient.tsx
"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type Category = "wucher" | "gefahr" | "tipp";

const ITEMS: { category: Category; light: string; title: string; text: string }[] = [
  { category: "wucher", light: "🟡", title: "Überteuerte Taxis am Flughafen Lissabon", text: "Meter einfordern oder App-basierte Anbieter nutzen — feste 'Touristenpreise' sind verhandelbar." },
  { category: "gefahr", light: "🔴", title: "Taschendiebstahl-Hotspot Tram 28", text: "Besonders in Stoßzeiten auf Rucksäcke/Taschen achten, Wertsachen vorne tragen." },
  { category: "tipp", light: "🟢", title: "Trinkgeld-Etikette in Portugal", text: "5–10% sind üblich, aber nicht verpflichtend wie in den USA." },
];

const LABELS: Record<Category, string> = { wucher: "🟡 Abzocke & Wucher", gefahr: "🔴 Gefahrenzonen", tipp: "🟢 Verhaltenstipps" };

export function SafetyRadarClient() {
  const [active, setActive] = useState<Category | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const push = useToast();

  const filtered = active ? ITEMS.filter((i) => i.category === active) : ITEMS;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(Object.keys(LABELS) as Category[]).map((c) => (
          <Chip key={c} label={LABELS[c]} active={active === c} onClick={() => setActive(active === c ? null : c)} />
        ))}
        <Button variant="danger" onClick={() => setReportOpen(true)}>
          + Scam/Gefahr Melden
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {filtered.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: 18, boxShadow: "var(--shadow-warm-card)" }}>
            <strong>
              {item.light} {item.title}
            </strong>
            <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: "var(--fs-small)" }}>{item.text}</p>
          </div>
        ))}
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmitted={() => {
          setReportOpen(false);
          push("Danke! Deine Meldung geht in die Moderationswarteschlange.", "success");
        }}
      />
    </div>
  );
}

function ReportModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: () => void }) {
  const [category, setCategory] = useState<Category>("wucher");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await fetch("/api/safety-reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category, location, description }),
      });
      onSubmitted();
      setLocation("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="🚨 Scam oder Gefahr melden">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        <label style={{ fontSize: "var(--fs-small)", fontWeight: 600 }}>
          Kategorie
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            style={{ width: "100%", marginTop: 4, padding: 10, borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(45,55,72,.15)" }}
          >
            {(Object.keys(LABELS) as Category[]).map((c) => (
              <option key={c} value={c}>
                {LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: "var(--fs-small)", fontWeight: 600 }}>
          Ort
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z. B. Rossio-Platz, Lissabon"
            style={{ width: "100%", marginTop: 4, padding: 10, borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(45,55,72,.15)" }}
          />
        </label>
        <label style={{ fontSize: "var(--fs-small)", fontWeight: 600 }}>
          Beschreibung
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", marginTop: 4, padding: 10, borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(45,55,72,.15)", fontFamily: "inherit" }}
          />
        </label>
        <Button variant="trust" onClick={submit} loading={loading} disabled={!location || !description}>
          Melden
        </Button>
      </div>
    </Modal>
  );
}
