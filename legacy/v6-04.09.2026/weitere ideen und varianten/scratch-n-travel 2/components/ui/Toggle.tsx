// components/ui/Toggle.tsx
"use client";

import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  variant?: "default" | "hazard";
}

export function Toggle({ checked, onChange, label, variant = "default" }: ToggleProps) {
  return (
    <label className={styles.wrap}>
      <span>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        className={`${styles.track} ${checked ? styles.on : ""} ${
          variant === "hazard" ? styles.hazard : ""
        }`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
}
