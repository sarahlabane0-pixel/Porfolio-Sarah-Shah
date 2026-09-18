"use client";

import { useState } from "react";
import Image from "next/image";
import { mondes } from "@/content/copy";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { useReveal } from "@/lib/useReveal";
import styles from "./Mondes.module.css";

export function Mondes() {
  const [active, setActive] = useState<string | null>(null);
  const lenisRef = useLenisRef();
  const headRef = useReveal<HTMLDivElement>();

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href) return;
    event.preventDefault();
    event.stopPropagation();
    const target = document.querySelector(href);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="mondes" className={styles.section}>
      <div ref={headRef} className={styles.head}>
        <p className={styles.kicker}>{mondes.kicker}</p>
        <h2 className={styles.title}>{mondes.title}</h2>
        <p className={styles.intro}>{mondes.intro}</p>
      </div>

      <div className={styles.panels}>
        {mondes.worlds.map((world) => (
          <div
            key={world.id}
            className={styles.panel}
            data-active={active === world.id}
            // Pointer type is checked explicitly rather than splitting this
            // across mouseenter/click, since touch browsers can synthesize
            // both for a single tap — two handlers toggling the same state
            // would cancel each other out.
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(world.id);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") {
                setActive((current) => (current === world.id ? null : current));
              }
            }}
            onPointerUp={(event) => {
              if (event.pointerType !== "mouse") {
                setActive((current) => (current === world.id ? null : world.id));
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={active === world.id}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive((current) => (current === world.id ? null : world.id));
              }
            }}
          >
            <div className={styles.cover}>
              {world.image ? (
                <Image src={world.image} alt="" fill sizes="(max-width: 780px) 100vw, 40vw" />
              ) : (
                <PlaceholderImage label={`Photo à venir — ${world.label}`} />
              )}
              <div className={styles.scrim} />
            </div>

            <div className={styles.content}>
              <span className={styles.label}>{world.label}</span>
              <p className={styles.text}>{world.text}</p>
              <a
                href={world.href}
                className={styles.enter}
                data-cursor="link"
                data-cursor-label="Entrer"
                onClick={goTo}
              >
                Entrer →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
