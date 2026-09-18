"use client";

import { useReveal } from "@/lib/useReveal";
import styles from "./Ornaments.module.css";

export function ZelligeOrnament() {
  const ref = useReveal<HTMLDivElement>({ y: 0, stagger: 0.02, duration: 0.7 });
  return (
    <div ref={ref} className={styles.zelligeGrid} data-reveal-group aria-hidden="true">
      {Array.from({ length: 36 }).map((_, i) => (
        <span key={i} className={styles.zelligeTile} />
      ))}
    </div>
  );
}

export function NewYorkOrnament() {
  return (
    <div aria-hidden="true">
      <div className={styles.marqueeStack}>
        <span className={styles.marqueeLine}>
          MANHATTAN — BROADWAY — MANHATTAN — BROADWAY —{" "}
        </span>
        <span className={styles.marqueeLine} data-dir="reverse">
          BROOKLYN — STREET ART — BROOKLYN — STREET ART —{" "}
        </span>
        <span className={styles.marqueeLine}>HIP-HOP — ÉNERGIE — HIP-HOP — ÉNERGIE — </span>
      </div>
      <svg
        className={styles.liberty}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M12 2 L13 6 L11 6 Z" />
        <rect x="10" y="6" width="4" height="3" />
        <path d="M8 9 L16 9 L15 12 L9 12 Z" />
        <rect x="9" y="12" width="6" height="7" />
        <rect x="7" y="19" width="10" height="2" />
        <path d="M12 2 L12 0 M9 3 L8 1.3 M15 3 L16 1.3 M7 5 L5 4 M17 5 L19 4" />
      </svg>
    </div>
  );
}

export function HoustonOrnament() {
  return (
    <div aria-hidden="true">
      <span className={styles.orbitPath} />
      <span className={styles.orbitDot} />
    </div>
  );
}

export function VeniceOrnament({ label }: { label: string }) {
  return (
    <>
      <div className={styles.ripple} aria-hidden="true" />
      <span className={styles.mirrorText} aria-hidden="true">
        {label}
      </span>
    </>
  );
}

export function PalmaOrnament() {
  return <div className={styles.glare} aria-hidden="true" />;
}

export function AlgiersOrnament() {
  return <div className={styles.columns} aria-hidden="true" />;
}

export function DesertOrnament() {
  return <div className={styles.desertHaze} aria-hidden="true" />;
}
