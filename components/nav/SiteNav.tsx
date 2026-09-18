"use client";

import { useState } from "react";
import { navItems } from "@/content/copy";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { MagneticLink } from "@/components/shared/MagneticLink";
import styles from "./SiteNav.module.css";

export function SiteNav() {
  const lenisRef = useLenisRef();
  const [open, setOpen] = useState(false);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href) return;
    event.preventDefault();
    setOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={styles.nav} aria-label="Navigation principale">
        <a href="#hero" className={styles.mark} onClick={handleNavClick}>
          Sarah Shah
        </a>

        <ul className={styles.list}>
          {navItems.map((item) => (
            <li key={item.href}>
              <MagneticLink
                href={item.href}
                className={styles.item}
                disabled={!item.available}
                onClick={handleNavClick}
                cursorLabel={item.available ? "Aller" : "Bientôt"}
              >
                <span className={styles.index}>{item.index}</span>
                {item.label}
              </MagneticLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} data-available={item.available}>
                <a href={item.href} onClick={handleNavClick}>
                  <span className={styles.index}>{item.index}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
