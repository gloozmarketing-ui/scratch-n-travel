// components/ui/Button.tsx
// Vollständige Zustandsmatrix aus design.md 6.1 — 5 Varianten.
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "friendly" | "hud" | "outline" | "trust" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  success?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "friendly",
  loading = false,
  success = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[variant],
    loading ? styles.loading : "",
    success ? styles.success : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {success ? <span aria-hidden="true">✓</span> : null}
      <span className={loading ? styles.hiddenLabel : undefined}>{children}</span>
    </button>
  );
}
