// components/scratch/ScratchCanvas.tsx
//
// Scratch-Engine gemäß design.md Kapitel 7.2–7.4.
// WICHTIG: Diese Komponente kennt KEINE Regionsnamen oder -grenzen. Sie nimmt
// ausschließlich eine RegionConfig (aus lib/regions.ts) entgegen und rendert
// generisch — harte Regel 1 aus dem Masterprompt.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RegionConfig } from "@/lib/regions";

interface ScratchCanvasProps {
  region: RegionConfig;
  /** Wird bei Erreichen des scratchThreshold aus der Config aufgerufen. */
  onUnlocked?: (regionCode: string) => void;
  /** Sampling-Auflösung fürs Fortschritts-Zählen — Default gemäß 7.2.3 */
  sampleSize?: number;
}

const THROTTLE_MS = 150; // 7.2.3: alle ~150ms, nicht pro Frame
const RADIUS_DESKTOP = 36;
const RADIUS_MOBILE = 24;

export function ScratchCanvas({ region, onUnlocked, sampleSize = 128 }: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastSample = useRef(0);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const isTouch = useRef(false);

  const drawFoil = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#D4AF37"); // --gold-primary
    grad.addColorStop(0.5, "#FFE066"); // --gold-highlight
    grad.addColorStop(1, "#997A15"); // --gold-shadow
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d")!;
    drawFoil(ctx, canvas.width, canvas.height);

    // Offscreen low-res sampling canvas (7.2.3): max sampleSize x sampleSize,
    // unabhängig von echter Auflösung -> performant auch bei großen Regionen.
    const sc = document.createElement("canvas");
    sc.width = sampleSize;
    sc.height = sampleSize;
    sampleCanvasRef.current = sc;
  }, [drawFoil, sampleSize]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize, region.code]);

  const measureProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const sample = sampleCanvasRef.current;
    if (!canvas || !sample) return;
    const sctx = sample.getContext("2d")!;
    sctx.clearRect(0, 0, sample.width, sample.height);
    sctx.drawImage(canvas, 0, 0, sample.width, sample.height);
    const data = sctx.getImageData(0, 0, sample.width, sample.height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4) {
      total++;
      if (data[i] === 0) cleared++;
    }
    const pct = total ? cleared / total : 0;
    setProgress(pct);

    if (!unlocked && pct >= region.scratchThreshold) {
      setUnlocked(true);
      triggerShockwave();
      onUnlocked?.(region.code);
    }
  }, [onUnlocked, region.code, region.scratchThreshold, unlocked]);

  const triggerShockwave = useCallback(() => {
    // Restliche Foil fadet aus (300ms) statt hart verschwindet.
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.transition = "opacity 300ms ease";
    canvas.style.opacity = "0";
    // Haptik nur mit Feature-Detection (7.2.4)
    if ("vibrate" in navigator) {
      navigator.vibrate([40, 60, 120]);
    }
    // Server-Sync erst bei bedeutsamem Event (75%-Trigger), nicht bei jeder Bewegung (7.4)
    // -> hier würde ein Call an /api/regions/[code]/unlock erfolgen (siehe app/api Stub).
  }, []);

  const scratchAt = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || unlocked) return;
      const ctx = canvas.getContext("2d")!;
      ctx.globalCompositeOperation = "destination-out";
      const radius = isTouch.current ? RADIUS_MOBILE : RADIUS_DESKTOP;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      const now = performance.now();
      if (now - lastSample.current > THROTTLE_MS) {
        lastSample.current = now;
        measureProgress();
      }
    },
    [measureProgress, unlocked]
  );

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label={`Region ${region.name} freirubbeln. Enter drücken für Tastatur-Alternative.`}
        style={{ position: "absolute", inset: 0, touchAction: "none", cursor: "grab" }}
        onPointerDown={(e) => {
          isTouch.current = e.pointerType === "touch";
          drawing.current = true;
          const p = getPos(e);
          scratchAt(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const p = getPos(e);
          scratchAt(p.x, p.y);
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
        onKeyDown={(e) => {
          // 11. Barrierefreiheit: Tastatur-Alternative ist Pflicht, kein optionales Feature.
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setProgress(1);
            if (!unlocked) {
              setUnlocked(true);
              triggerShockwave();
              onUnlocked?.(region.code);
            }
          }
        }}
      />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -22, left: 0, fontFamily: "var(--font-hud)", fontSize: "var(--fs-micro)", color: "var(--gold-highlight)" }}>
        {(progress * 100).toFixed(0)}%
      </div>
    </div>
  );
}
