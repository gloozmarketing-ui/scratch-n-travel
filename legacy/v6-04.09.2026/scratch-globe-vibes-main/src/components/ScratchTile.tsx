import { useCallback, useEffect, useRef, useState } from "react";
import type { ScratchRegion } from "@/data/scratch-regions";
import { cn } from "@/lib/utils";

const BOX = 240;

const toneBg: Record<ScratchRegion["tone"], string> = {
  sunset: "bg-sunset",
  ocean: "bg-ocean",
  jungle: "bg-jungle",
  spice: "bg-spice",
  berry: "bg-berry",
  sand: "bg-sand",
  ice: "bg-ice",
  citrus: "bg-citrus",
};

const toneStroke: Record<ScratchRegion["tone"], string> = {
  sunset: "text-sunset",
  ocean: "text-ocean",
  jungle: "text-jungle",
  spice: "text-spice",
  berry: "text-berry",
  sand: "text-sand",
  ice: "text-ice",
  citrus: "text-citrus",
};

/** Deterministic serpentine scratch path used for scroll-driven reveals. */
function buildStrokes(seed: number) {
  const points: Array<{ x: number; y: number }> = [];
  const rows = 9;
  for (let r = 0; r < rows; r++) {
    const y = 18 + (r * (BOX - 36)) / (rows - 1);
    const leftToRight = (r + seed) % 2 === 0;
    const steps = 14;
    for (let s = 0; s <= steps; s++) {
      const t = leftToRight ? s / steps : 1 - s / steps;
      const wobble = Math.sin((t * 6 + r + seed) * 1.7) * 9;
      points.push({ x: 12 + t * (BOX - 24), y: y + wobble });
    }
  }
  return points;
}

type Props = {
  region: ScratchRegion;
  /** 0..1 scroll driven reveal amount. */
  progress: number;
  size?: number;
  className?: string;
};

export function ScratchTile({ region, progress, size = 240, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef(buildStrokes(region.id.length));
  const doneRef = useRef(0);
  const [revealed, setRevealed] = useState(false);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = BOX * dpr;
    canvas.height = BOX * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, BOX, BOX);

    const g = ctx.createLinearGradient(0, 0, BOX, BOX);
    g.addColorStop(0, "#e7e9ee");
    g.addColorStop(0.26, "#c3c7d0");
    g.addColorStop(0.46, "#8e939e");
    g.addColorStop(0.62, "#c9cdd6");
    g.addColorStop(0.82, "#eceef2");
    g.addColorStop(1, "#9aa0ab");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, BOX, BOX);

    // brushed metal grain
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 420; i++) {
      const y = Math.random() * BOX;
      ctx.strokeStyle = Math.random() > 0.5 ? "#ffffff" : "#5f646d";
      ctx.beginPath();
      ctx.moveTo(Math.random() * BOX, y);
      ctx.lineTo(Math.random() * BOX, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, []);

  const erase = useCallback((x: number, y: number, r: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    paintFoil();
    doneRef.current = 0;
    setRevealed(false);
  }, [paintFoil, region.id]);

  // scroll driven scratching
  useEffect(() => {
    const strokes = strokesRef.current;
    const target = Math.floor(Math.min(Math.max(progress, 0), 1) * strokes.length);
    if (target <= doneRef.current) return;
    for (let i = doneRef.current; i < target; i++) {
      erase(strokes[i]!.x, strokes[i]!.y, 24);
    }
    doneRef.current = target;
    if (target / strokes.length > 0.55) setRevealed(true);
  }, [progress, erase]);

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * BOX;
    const y = ((e.clientY - rect.top) / rect.height) * BOX;
    erase(x, y, 26);
    doneRef.current = Math.min(strokesRef.current.length, doneRef.current + 3);
    if (doneRef.current / strokesRef.current.length > 0.55) setRevealed(true);
  };

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-label={`${region.name} – ${region.words.join(", ")}`}
    >
      <div
        className="absolute inset-0"
        style={{
          width: BOX,
          height: BOX,
          transform: `scale(${size / BOX})`,
          transformOrigin: "top left",
        }}
      >
        {/* revealed layer */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `path("${region.path}")` }}
        >
          <div className={cn("absolute inset-0 opacity-90", toneBg[region.tone])} />
        </div>

        {/* words sit on top of the shape so narrow countries stay readable */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-2 text-center transition-opacity duration-500"
          style={{ opacity: revealed ? 1 : Math.min(progress * 2.4, 1) }}
        >
          <span className="rounded-full bg-card/85 px-2 font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            {region.kicker}
          </span>
          <span className="rounded-md bg-card/85 px-2 font-display text-base leading-tight text-foreground">
            {region.name}
          </span>
          <div className="mt-1 flex flex-col items-center gap-0.5">
            {region.words.slice(0, 3).map((w) => (
              <span
                key={w}
                className="rounded bg-card/85 px-1.5 text-[10px] font-medium leading-snug text-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>


        {/* outline so the shape reads as a map fragment */}
        <svg
          viewBox={`0 0 ${BOX} ${BOX}`}
          className={cn("pointer-events-none absolute inset-0", toneStroke[region.tone])}
          width={BOX}
          height={BOX}
          aria-hidden="true"
        >
          <path
            d={region.path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>

        {/* foil layer */}
        <div
          className="absolute inset-0 overflow-hidden transition-opacity duration-700"
          style={{
            clipPath: `path("${region.path}")`,
            opacity: revealed ? 0 : 1,
          }}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
        >
          <canvas
            ref={canvasRef}
            style={{ width: BOX, height: BOX }}
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
