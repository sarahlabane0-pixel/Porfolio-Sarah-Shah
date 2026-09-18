"use client";

import { useReveal } from "@/lib/useReveal";
import { MagneticLink } from "@/components/shared/MagneticLink";
import { contact } from "@/content/copy";
import styles from "./Contact.module.css";

export function Contact() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08, y: 24 });

  return (
    <section id="contact" className={styles.section}>
      <div ref={ref} className={styles.card} data-reveal-group>
        <div className={styles.seal}>SS</div>
        <p className={styles.kicker}>{contact.kicker}</p>
        <h2 className={styles.title}>{contact.title}</h2>
        <p className={styles.subtitle}>{contact.subtitle}</p>
        <div className={styles.divider} />

        <div className={styles.links}>
          <MagneticLink
            href={`mailto:${contact.email}`}
            className={styles.link}
            cursorLabel="Écrire"
            strength={0.25}
          >
            {contact.email}
          </MagneticLink>
          <MagneticLink
            href={`tel:${contact.phoneHref}`}
            className={styles.link}
            cursorLabel="Appeler"
            strength={0.25}
          >
            {contact.phone}
          </MagneticLink>
        </div>

        <p className={styles.location}>{contact.location}</p>

        <div className={styles.footerRow}>
          <span>Sarah Shah</span>
          <span>Communication &amp; événementiel</span>
        </div>
      </div>
    </section>
  );
}
