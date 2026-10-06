import { ScratchTile } from "./ScratchTile";
import { scratchRegions } from "@/data/scratch-regions";
import { cn } from "@/lib/utils";

type Props = {
  side: "left" | "right";
  /** Global scroll progress 0..1 */
  progress: number;
};

/**
 * Fixed scratch rail along a page edge. Tiles reveal one after another as the
 * page scrolls, and can also be scratched by hand with the pointer ("coin").
 */
export function ScratchRail({ side, progress }: Props) {
  const regions = scratchRegions.filter((_, i) => (side === "left" ? i % 2 === 0 : i % 2 === 1));
  const step = 1 / regions.length;

  return (
    <div
      aria-hidden={false}
      className={cn(
        "pointer-events-none fixed top-0 z-20 hidden h-screen w-[168px] flex-col justify-center gap-6 overflow-hidden px-3 xl:flex xl:w-[212px]",
        side === "left" ? "left-0 items-start" : "right-0 items-end",
      )}
    >
      {regions.map((region, i) => {
        const local = (progress - i * step * 0.82) / (step * 1.5);
        const tileProgress = Math.min(Math.max(local, 0), 1);
        const offset = (i % 2 === 0 ? 1 : -1) * 14;
        return (
          <div
            key={region.id}
            className="pointer-events-auto transition-transform duration-500"
            style={{
              transform: `translateX(${side === "left" ? offset : -offset}px) rotate(${
                (i % 3) * 3 - 3
              }deg)`,
              opacity: 0.45 + tileProgress * 0.55,
            }}
          >
            <ScratchTile region={region} progress={tileProgress} size={150} />
          </div>
        );
      })}
    </div>
  );
}
