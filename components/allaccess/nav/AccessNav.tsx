"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { cv, identity, navChapters } from "@/content/allaccess";
import s from "./AccessNav.module.css";

/**
 * Minimal chrome: monogram, the six chapters, the CV, a hairline progress.
 * It also owns the page theme: every `[data-theme-zone]` element flips
 * `html[data-aa-theme]` while it sits under the nav (the hero and the Work
 * stage manage theirs from their own timelines).
 */
export function AccessNav({ visible }: { visible: boolean }) {
  const root = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useLenisRef();
  const [active, setActive] = useState<number>(-1);

  useEffect(() => {
    const el = root.current;
    if (!el || !visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const tween = gsap.fromTo(
      el.querySelectorAll("[data-nav-item]"),
      { autoAlpha: 0, y: reduce ? 0 : -10 },
      { autoAlpha: 1, y: 0, duration: reduce ? 0.3 : 1, stagger: 0.06, ease: "expo.out", delay: reduce ? 0 : 1.4 },
    );

    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    // Refreshed after every pin above them (refreshPriority -1).
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-theme-zone]")).map((z) =>
      ScrollTrigger.create({
        trigger: z,
        start: "top 40px",
        end: "bottom 40px",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) html.dataset.aaTheme = z.dataset.themeZone;
        },
      }),
    );
    const chapters = navChapters.map((c, i) => {
      const target = document.querySelector<HTMLElement>(c.href);
      return target
        ? ScrollTrigger.create({
            trigger: target,
            start: "top 50%",
            end: "bottom 50%",
            refreshPriority: -1,
            onToggle: (self) => {
              if (self.isActive) setActive(i);
              else if (i === 0 && self.direction < 0) setActive(-1);
            },
          })
        : null;
    });
    ScrollTrigger.refresh();

    return () => {
      tween.kill();
      progress.kill();
      zones.forEach((z) => z.kill());
      chapters.forEach((c) => c?.kill());
    };
  }, [visible]);

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);
    const lenis = lenisRef.current;
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(hash === "#entree" ? 0 : target, { duration: 2 });
    else target.scrollIntoView();
  };

  const current = active >= 0 ? navChapters[active] : null;

  return (
    <header ref={root} className={s.nav}>
      <a
        href="#entree"
        className={s.brand}
        data-nav-item
        aria-label={`${identity.firstName} ${identity.lastName} — retour à l'entrée`}
        onClick={(e) => go(e, "#entree")}
      >
        <span className={s.mono}>SS</span>
        <span className="aa-micro">All access</span>
      </a>

      <nav aria-label="Chapitres" className={s.chapters} data-nav-item>
        <ul>
          {navChapters.map((c, i) => (
            <li key={c.index}>
              <a
                href={c.href}
                className={`${s.chapter} aa-micro`}
                aria-current={active === i ? "true" : undefined}
                onClick={(e) => go(e, c.href)}
              >
                <b>{c.index}</b> {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className={`${s.current} aa-micro`} data-nav-item aria-hidden="true">
        {current ? `${current.index} ${current.label}` : "00 Entrée"}
      </p>

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
