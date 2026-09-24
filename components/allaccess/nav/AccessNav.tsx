"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cv, identity, navChapters } from "@/content/allaccess";
import s from "./AccessNav.module.css";

/**
 * Minimal chrome: monogram, the chapters (not built yet in this prototype,
 * so shown but disabled), the CV, and a hairline progress. Colour follows
 * `html[data-aa-theme]`, which the hero flips when the page turns ivory.
 */
export function AccessNav({ visible }: { visible: boolean }) {
  const root = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.fromTo(
      el.querySelectorAll("[data-nav-item]"),
      { autoAlpha: 0, y: reduce ? 0 : -10 },
      { autoAlpha: 1, y: 0, duration: reduce ? 0.3 : 1, stagger: 0.06, ease: "expo.out", delay: reduce ? 0 : 1.4 },
    );

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [visible]);

  return (
    <header ref={root} className={s.nav}>
      <a href="#entree" className={s.brand} data-nav-item aria-label={`${identity.firstName} ${identity.lastName} — retour en haut`}>
        <span className={s.mono}>SS</span>
        <span className="aa-micro">All access</span>
      </a>

      <nav aria-label="Chapitres" className={s.chapters} data-nav-item>
        <ul>
          {navChapters.map((c) => (
            <li key={c.index}>
              <span className={`${s.chapter} aa-micro`} aria-disabled="true" title="Chapitre en production">
                <b>{c.index}</b> {c.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <a
        href={cv.href}
        className={`${s.cv} aa-micro`}
        data-nav-item
        data-cursor="cv"
        data-cursor-label="Open"
        target="_blank"
        rel="noopener"
        aria-label={`${cv.longLabel} (PDF, nouvel onglet)`}
      >
        {cv.label} <span aria-hidden="true">↗</span>
      </a>

      <span className={s.progress} aria-hidden="true">
        <span ref={barRef} />
      </span>
    </header>
  );
}
