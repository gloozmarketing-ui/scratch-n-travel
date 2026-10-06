// components/ui/Card.tsx
import { ReactNode } from "react";
import styles from "./Card.module.css";

export function Card({ children, hoverable = false }: { children: ReactNode; hoverable?: boolean }) {
  return <div className={`${styles.card} ${hoverable ? styles.hoverable : ""}`}>{children}</div>;
}

/**
 * Story-Pin-Card — 6.2, drei Zustände.
 * Der "locked/unlocked"-Status kommt bewusst als Prop von außen (Server- oder
 * localStorage-State), die Karte selbst enthält keine Freischalt-Logik.
 */
interface StoryPinCardProps {
  category: string;
  title: string;
  quote: string;
  author: string;
  rating: number;
  reviewCount: number;
  locked: boolean;
  coords?: string;
  onUnlockRequest: () => void;
}

export function StoryPinCard({
  category,
  title,
  quote,
  author,
  rating,
  reviewCount,
  locked,
  coords,
  onUnlockRequest,
}: StoryPinCardProps) {
  return (
    <div className={`${styles.card} ${styles.pinCard} ${!locked ? styles.verified : ""}`}>
      <span className={styles.category}>{category}</span>
      <h3>{title}</h3>
      <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
      {locked ? (
        <div className={styles.lockedRow}>
          <span>🔒 GPS-Koordinaten gesperrt</span>
          <button className={styles.unlockBtn} onClick={onUnlockRequest}>
            Ehrenkodex akzeptieren & Freischalten 🔑
          </button>
        </div>
      ) : (
        <div className={styles.unlockedRow}>
          <code>{coords}</code>
        </div>
      )}
      <p className={styles.authorLine}>
        Verifiziert von: {author} · {rating.toFixed(1)} ★ ({reviewCount} Bewertungen)
      </p>
    </div>
  );
}
