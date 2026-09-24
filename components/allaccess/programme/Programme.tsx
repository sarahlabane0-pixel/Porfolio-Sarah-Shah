"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { mondes, programme } from "@/content/allaccess";
import { media, type Media } from "@/content/media";
import { Photo } from "../Photo";
import s from "./Programme.module.css";

// One real photograph per world (Mondes texts are Sarah's).
const COVERS: Record<string, Media> = {
  projets: media.ketilTheatre,
  voyages: media.veniceNight,
  lieux: media.aura,
  mouvement: media.danceBW,
};

export function Programme() {
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenisRef();

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el.querySelectorAll(`.${s.item}`),
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 70%" } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const go = (hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target, { duration: 2 });
    else target.scrollIntoView();
  };

  return (
    <section ref={root} className={s.programme} data-theme-zone="light" aria-labelledby="programme-title">
      <p className={`${s.kicker} aa-micro`}>
        <span>00 — {programme.kicker}</span>
        <span>{mondes.intro}</span>
      </p>
      <h2 id="programme-title" className="visually-hidden">
        {programme.title}
      </h2>
      <ol className={s.list}>
        {mondes.worlds.map((w, i) => (
          <li key={w.id} className={s.item}>
            <a
              href={programme.targets[w.id]}
              className={s.link}
              onClick={(e) => {
                e.preventDefault();
                go(programme.targets[w.id]);
              }}
              data-cursor="programme"
              data-cursor-label="Go"
            >
              <span className={s.cover} aria-hidden="true">
                <Photo media={COVERS[w.id]} sizes="(min-width: 1024px) 24vw, 90vw" />
              </span>
              <span className={`${s.index} aa-micro`}>0{i + 1}</span>
              <span className={s.label}>{w.label}</span>
              <span className={s.text}>{w.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
