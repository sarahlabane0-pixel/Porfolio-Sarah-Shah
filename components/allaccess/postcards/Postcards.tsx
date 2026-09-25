"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { postcards, recit } from "@/content/allaccess";
import { media, type Media } from "@/content/media";
import { Photo, sharpWidth } from "../Photo";
import s from "./Postcards.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

type Card = {
  place: string;
  country: string;
  media: Media | null;
  line?: string;
  // Desktop board position (% of the board), width (vw), rotation, parallax.
  x: number;
  y: number;
  w: number;
  r: number;
  speed: number;
};

// Lines are Sarah's, from content/travels.ts. Marrakech and New York have no
// usable photograph yet (see IMAGE_TODO.md) and say so on the card.
const CARDS: Card[] = [
  { place: "Houston", country: "États-Unis", media: media.houston, line: "Imagination et réalité se côtoient.", x: 58, y: 4, w: 15, r: 4, speed: 0.9 },
  { place: "Venise", country: "Italie", media: media.veniceNight, x: 78, y: 9, w: 11, r: -6, speed: 0.6 },
  { place: "Marrakech", country: "Maroc", media: media.marrakech, line: "Jemaa el-Fna, c'est le mouvement avant tout.", x: 37, y: 38, w: 15, r: -4, speed: 1.1 },
  { place: "Palma", country: "Espagne", media: media.palmaCathedral, x: 62, y: 40, w: 9, r: 7, speed: 0.7 },
  { place: "Algérie", country: "Algérie", media: media.algeriaCoast, line: "Une lumière qui change la perspective d'une rue à l'autre.", x: 84, y: 45, w: 11, r: -4, speed: 1.0 },
  { place: "New York", country: "États-Unis", media: media.brooklyn, line: "Brooklyn, un musée à ciel ouvert.", x: 5, y: 56, w: 14, r: 5, speed: 0.6 },
  { place: "Venise", country: "Italie", media: media.veniceRialto, x: 21, y: 71, w: 12, r: -7, speed: 1.2 },
  { place: "Palma", country: "Espagne", media: media.palmaCove, x: 49, y: 71, w: 12, r: 3, speed: 0.8 },
  { place: "Algérie", country: "Algérie", media: media.algeriaDesert, x: 71, y: 76, w: 10, r: -3, speed: 1.2 },
];

export function Postcards() {
  const root = useRef<HTMLElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const breath = breathRef.current;
    if (!el || !breath) return;
    const mm = gsap.matchMedia();
    // Resting tilt of each card — through GSAP, which owns their transforms.
    gsap.set(el.querySelectorAll<HTMLElement>(`.${s.card}`), { rotation: (_: number, n: HTMLElement) => Number(n.dataset.r) });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Breath: each line comes into full ink as it crosses the reading line.
      const lines = Array.from(breath.querySelectorAll<HTMLElement>(`.${s.breathLine}`));
      const read = lines.map((line) =>
        gsap.fromTo(
          line,
          { opacity: 0.14, x: -12 },
          { opacity: 1, x: 0, ease: "none", scrollTrigger: { trigger: line, start: "top 82%", end: "top 48%", scrub: true } },
        ),
      );

      // Parallax: cards drift at their own speeds.
      const pars = Array.from(el.querySelectorAll<HTMLElement>(`.${s.par}`));
      const drift = gsap.timeline({
        scrollTrigger: { trigger: el.querySelector(`.${s.board}`), start: "top bottom", end: "bottom top", scrub: 1 },
      });
      pars.forEach((p) => {
        const sp = Number(p.dataset.speed);
        drift.fromTo(p, { y: 90 * sp }, { y: -110 * sp, ease: "none" }, 0);
      });
      // Scattered words drift the other way, slower.
      drift.fromTo(el.querySelectorAll(`.${s.fragment}`), { y: -30 }, { y: 50, ease: "none" }, 0);

      // The next card — the only blank one — grows into the next scene.
      const next = el.querySelector<HTMLElement>(`.${s.next}`);
      const grow = next
        ? gsap.fromTo(
            next,
            { scale: 1, rotation: -3, borderRadius: 4 },
            {
              scale: () => (Math.max(window.innerWidth, window.innerHeight) * 1.6) / next.offsetWidth,
              rotation: 0,
              borderRadius: 0,
              ease: "power2.in",
              scrollTrigger: { trigger: next, start: "center 75%", end: "center 20%", scrub: true, invalidateOnRefresh: true },
            },
          )
        : null;

      const label = next?.querySelector("span");
      const fade = label
        ? gsap.to(label, { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: next, start: "center 75%", end: "center 60%", scrub: true } })
        : null;

      return () => {
        fade?.scrollTrigger?.kill();
        fade?.kill();
        read.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        drift.scrollTrigger?.kill();
        drift.kill();
        grow?.scrollTrigger?.kill();
        grow?.kill();
      };
    });

    // Pick up and throw — mouse / pen only, so touch keeps scrolling.
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let top = 10;
      const ds = Draggable.create(el.querySelectorAll(`.${s.card}`), {
        type: "x,y",
        inertia: true,
        bounds: el.querySelector(`.${s.board}`),
        edgeResistance: 0.8,
        onPress() {
          top += 1;
          gsap.set(this.target, { zIndex: top });
          gsap.to(this.target, { scale: 1.06, rotation: "+=0", boxShadow: "0 3rem 4rem -1.5rem rgba(13,11,12,.45)", duration: 0.3 });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, boxShadow: "0 1.2rem 2.2rem -1rem rgba(13,11,12,.35)", duration: 0.5 });
        },
        onDrag() {
          // A little rotation in the direction of travel, like paper.
          gsap.to(this.target, { rotation: gsap.utils.clamp(-14, 14, this.deltaX * 0.9) + Number(this.target.dataset.r), duration: 0.4, overwrite: "auto" });
        },
      });
      return () => ds.forEach((d) => d.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="postcards" className={s.postcards} data-chapter="03" data-theme-zone="light" aria-labelledby="postcards-title">
      <div ref={breathRef} className={s.breath}>
        <p className={`${s.breathKicker} aa-micro`}>Interlude</p>
        <p className={s.breathText}>
          {recit.linesSecondary.map((l) => (
            <span key={l} className={s.breathLine}>
              {l}
            </span>
          ))}
        </p>
      </div>

      <div className={s.board}>
        <header className={s.head}>
          <p className={`${s.kicker} aa-micro`}>03 — {postcards.kicker}</p>
          <h2 id="postcards-title" className={s.title}>
            {postcards.titleA} <em>{postcards.titleB}</em>
          </h2>
          <p className={`${s.hint} aa-micro`}>{postcards.hint}</p>
        </header>

        {postcards.fragments.map((f, i) => (
          <span key={f} className={`${s.fragment} aa-micro`} style={{ "--i": i } as CSSProperties} aria-hidden="true">
            {f}
          </span>
        ))}

        <ul className={s.cards} aria-label="Cartes postales">
          {CARDS.map((c, i) => {
            const cap = c.media ? sharpWidth(c.media) : 9999;
            return (
              <li
                key={`${c.place}-${i}`}
                className={s.par}
                data-speed={c.speed}
                style={{ "--x": `${c.x}%`, "--y": `${c.y}%`, "--w": `min(${c.w}vw, ${cap}px)`, "--r": `${c.r}deg` } as CSSProperties}
              >
                <figure className={s.card} data-r={c.r} data-cursor="card" data-cursor-label="Drag">
                  {c.media ? (
                    <Photo media={c.media} sizes={`(min-width: 768px) min(${c.w}vw, ${cap}px), 42vw`} className={s.img} />
                  ) : (
                    <div className={s.missing} role="img" aria-label={`Photo de ${c.place} à fournir`}>
                      <span className="aa-micro">Image à fournir</span>
                      <span className="aa-micro">{c.place}</span>
                    </div>
                  )}
                  <figcaption>
                    <span className="aa-micro">
                      {c.place} — {c.country}
                    </span>
                    {c.line && <span className={s.line}>{c.line}</span>}
                  </figcaption>
                  <span className={s.stamp} aria-hidden="true">
                    SS
                  </span>
                </figure>
              </li>
            );
          })}
        </ul>

        <div className={s.nextWrap} aria-hidden="true">
          <div className={s.next}>
            <span className="aa-micro">{postcards.next}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
