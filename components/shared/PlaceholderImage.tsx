import styles from "./PlaceholderImage.module.css";

/**
 * Stands in for a photo Sarah hasn't sent yet. Deliberately reads as an
 * intentional textured panel rather than a broken image, and always says
 * in plain text what's missing so the gap is never silently papered over.
 */
export function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className={styles.placeholder} role="img" aria-label={label}>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
