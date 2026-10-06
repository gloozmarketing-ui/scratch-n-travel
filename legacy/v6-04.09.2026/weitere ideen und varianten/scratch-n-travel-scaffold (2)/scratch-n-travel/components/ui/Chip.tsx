// components/ui/Chip.tsx
"use client";

import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  colorVar?: "family" | "pet" | "hazard" | "terracotta";
}

export function Chip({ label, active = false, onClick, colorVar }: ChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : ""} ${colorVar ? styles[colorVar] : ""}`}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
    >
      {label}
    </button>
  );
}
