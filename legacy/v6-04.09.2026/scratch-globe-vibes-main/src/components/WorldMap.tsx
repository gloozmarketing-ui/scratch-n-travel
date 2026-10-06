import { useState } from "react";
import { countryPaths, freeNationPaths } from "@/data/world-paths";
import { cn } from "@/lib/utils";

const continentTone: Record<string, string> = {
  Europe: "text-spice",
  Africa: "text-sunset",
  Asia: "text-berry",
  "North America": "text-ocean",
  "South America": "text-jungle",
  Oceania: "text-citrus",
  Antarctica: "text-ice",
  "Seven seas (open ocean)": "text-ice",
};

const toneClass: Record<string, string> = {
  sunset: "text-sunset",
  ocean: "text-ocean",
  jungle: "text-jungle",
  spice: "text-spice",
  berry: "text-berry",
  sand: "text-sand",
  ice: "text-ice",
  citrus: "text-citrus",
};

export function WorldMap() {
  const [active, setActive] = useState<{ name: string; note?: string } | null>(null);

  return (
    <div className="paper relative overflow-hidden rounded-3xl border p-3 sm:p-5">
      <svg
        viewBox="0 20 1000 440"
        className="h-auto w-full"
        role="img"
        aria-label="World map with real country borders; Northern Eurasia shown as the 2030 Free Nations arrangement"
      >
        <g strokeWidth="0.6" strokeLinejoin="round" stroke="var(--color-background)">
          {countryPaths.map((c) => (
            <path
              key={c.id + c.name}
              d={c.d}
              fill="currentColor"
              className={cn(
                "cursor-pointer transition-opacity",
                continentTone[c.continent] ?? "text-muted-foreground",
                active && active.name !== c.name ? "opacity-30" : "opacity-80",
              )}
              onMouseEnter={() => setActive({ name: c.name, note: c.continent })}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </g>
        <g strokeWidth="1" strokeLinejoin="round" strokeDasharray="3 2" stroke="var(--color-background)">
          {freeNationPaths.map((n) => (
            <path
              key={n.id}
              d={n.d}
              fill="currentColor"
              className={cn(
                "cursor-pointer transition-opacity",
                toneClass[n.tone] ?? "text-muted-foreground",
                active && active.name !== n.name ? "opacity-35" : "opacity-95",
              )}
              onMouseEnter={() =>
                setActive({ name: n.name, note: "Northern Eurasia · Free Nations 2030" })
              }
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </g>
      </svg>

      <div className="mt-4 flex flex-wrap gap-2">
        {freeNationPaths.map((n) => (
          <button
            key={n.id}
            type="button"
            onMouseEnter={() =>
              setActive({ name: n.name, note: "Northern Eurasia · Free Nations 2030" })
            }
            onMouseLeave={() => setActive(null)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest transition-colors",
              active?.name === n.name ? "border-primary text-primary" : "text-muted-foreground",
            )}
          >
            {n.name}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-[2.5rem] max-w-2xl text-sm text-muted-foreground">
        {active ? (
          <>
            <span className="font-medium text-foreground">{active.name}</span>
            {active.note ? ` — ${active.note}` : null}
          </>
        ) : (
          "Echte Grenzen (Natural Earth). Northern Eurasia ist als dekolonisierte Free Nations 2030 gezeichnet statt als ein Staat."
        )}
      </p>
    </div>
  );
}
