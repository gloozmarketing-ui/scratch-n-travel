import { useCallback, useEffect, useRef, useState } from "react";
import type { Treasure } from "@/data/treasures";
import { cn } from "@/lib/utils";

const BOX = 240;

const toneText: Record<Treasure["tone"], string> = {
  sunset: "text-sunset",
  ocean: "text-ocean",
  jungle: "text-jungle",
  spice: "text-spice",
  berry: "text-berry",
  sand: "text-sand",
  ice: "text-ice",
  citrus: "text-citrus",
};

const toneBg: Record<Treasure["tone"], string> = {
  sunset: "bg-sunset/12",
  ocean: "bg-ocean/12",
  jungle: "bg-jungle/12",
  spice: "bg-spice/12",
  berry: "bg-berry/12",
  sand: "bg-sand/12",
  ice: "bg-ice/12",
  citrus: "bg-citrus/12",
};

/** Serpentine coin path so the reveal feels hand-scratched, not wiped. */
function buildStrokes(seed: number) {
  const points: Array<{ x: number; y: number }> = [];
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    const y = 16 + (r * (BOX - 32)) / (rows - 1);
    const leftToRight = (r + seed) % 2 === 0;
    const steps = 15;
    for (let s = 0; s <= steps; s++) {
      const t = leftToRight ? s / steps : 1 - s / steps;
      const wobble = Math.sin((t * 5.5 + r + seed) * 1.6) * 8;
      points.push({ x: 10 + t * (BOX - 20), y: y + wobble });
    }
  }
  return points;
}

type Props = {
  treasure: Treasure;
  /** 0..1 scroll driven reveal amount. */
  progress: number;
  size?: number;
  className?: string;
};

export function ScratchTreasure({ treasure, progress, size = 220, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef(buildStrokes(treasure.id.length));
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

    const g = ctx.createLinearGradient(0, BOX, BOX, 0);
    g.addColorStop(0, "#d8c79b");
    g.addColorStop(0.22, "#f0e4c2");
    g.addColorStop(0.44, "#b39a63");
    g.addColorStop(0.62, "#eadfba");
    g.addColorStop(0.84, "#c2ab74");
    g.addColorStop(1, "#8f7a4b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, BOX, BOX);

    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 460; i++) {
      const y = Math.random() * BOX;
      ctx.strokeStyle = Math.random() > 0.5 ? "#fffdf5" : "#6b5a33";
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
  }, [paintFoil, treasure.id]);

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
      className={cn("relative select-none overflow-hidden rounded-2xl border", className)}
      style={{ width: size, height: size }}
      aria-label={`${treasure.country} – ${treasure.name}`}
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
        <div className={cn("absolute inset-0", toneBg[treasure.tone])} />

        <svg
          viewBox={`0 0 ${BOX} ${BOX}`}
          width={BOX}
          height={BOX}
          className={cn("absolute inset-0", toneText[treasure.tone])}
          aria-hidden="true"
        >
          {treasure.strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill={s.fill ? "currentColor" : "none"}
              fillOpacity={s.fill ? 0.85 : undefined}
              stroke="currentColor"
              strokeWidth={s.width ?? 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 pb-3 text-center transition-opacity duration-500"
          style={{ opacity: revealed ? 1 : Math.min(progress * 2.4, 1) }}
        >
          <span className="rounded-full bg-card/85 px-2 font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
            {treasure.kicker}
          </span>
          <span className="rounded-md bg-card/85 px-2 font-display text-base leading-tight text-foreground">
            {treasure.name}
          </span>
          <span className="rounded bg-card/85 px-1.5 text-[10px] font-medium text-muted-foreground">
            {treasure.country}
          </span>
        </div>

        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: revealed ? 0 : 1 }}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
        >
          <canvas ref={canvasRef} style={{ width: BOX, height: BOX }} className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
