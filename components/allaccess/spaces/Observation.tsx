"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { observation, spaces } from "@/content/allaccess";
import type { NiemeyerPhoto } from "@/lib/niemeyerPhotos";
import { Photo, sharpWidth } from "../Photo";
import o from "./Observation.module.css";

// Same query as the CSS stage layout, so markup never flashes between modes.
const ROOM_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// Where each piece stands when it is looked at, and the wall it retires to
// once the next one comes forward (x in vw, z in px).
const FOCUS = [
  { fx: 40, wall: -37 },
  { fx: 62, wall: 35 },
  { fx: 44, wall: -12 },
];

/**
 * "Le lieu, en vrai." — an observation room, not a gallery. Each photograph
 * comes forward from the depth of a green room, is annotated like a survey
 * (what the eye catches: concrete, leather, light…), carries a museum cartel
 * with Sarah's own words, then steps back to hang in the space behind the
 * next one. Every photo appears once.
 */
export function Observation({ photos }: { photos: NiemeyerPhoto[] }) {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const pieces = Array.from(el.querySelectorAll<HTMLElement>(`.${o.piece}`));

    // ── Wide screens: a pinned room the camera walks through ──────────
    mm.add(ROOM_QUERY, () => {
      const q = (p: HTMLElement, sel: string) => Array.from(p.querySelectorAll<HTMLElement>(sel));
      const frames = pieces.map((p) => p.querySelector<HTMLElement>(`.${o.frame}`)!);
      gsap.set(frames, { xPercent: -50, yPercent: -50, z: -1500, autoAlpha: 0 });
      gsap.set(pieces.map((p) => p.querySelector(`.${o.theme}`)), { autoAlpha: 0 });
      gsap.set(pieces.map((p) => p.querySelector(`.${o.cartel}`)), { autoAlpha: 0, y: 30 });
      gsap.set(pieces.flatMap((p) => q(p, `.${o.dot}`)), { scale: 0 });
      gsap.set(pieces.flatMap((p) => q(p, `.${o.line}`)), { scaleX: 0 });
      gsap.set(pieces.flatMap((p) => q(p, `.${o.label}`)), { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const focusAt: number[] = [];
      let t = 0.4; // a breath: the empty room first

      pieces.forEach((p, i) => {
        const pos = FOCUS[i % FOCUS.length];
        const frame = frames[i];
        const theme = p.querySelector(`.${o.theme}`);
        const cartel = p.querySelector(`.${o.cartel}`);
        const dots = q(p, `.${o.dot}`);
        const lines = q(p, `.${o.line}`);
        const labels = q(p, `.${o.label}`);
        const last = i === pieces.length - 1;

        // Comes forward out of the room.
        tl.to(frame, { z: 0, autoAlpha: 1, duration: 1.3, ease: "power2.out" }, t)
          .fromTo(theme, { autoAlpha: 0, xPercent: i % 2 ? 8 : -8 }, { autoAlpha: 1, xPercent: 0, duration: 1.2, ease: "power2.out" }, t + 0.15)
          // The eye settles: survey marks draw onto what it notices.
          .to(dots, { scale: 1, duration: 0.3, stagger: 0.18, ease: "back.out(3)" }, t + 1)
          .to(lines, { scaleX: 1, duration: 0.35, stagger: 0.18, ease: "power2.out" }, t + 1.1)
          .to(labels, { autoAlpha: 1, duration: 0.3, stagger: 0.18 }, t + 1.25)
          .to(cartel, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, t + 0.9);
        focusAt.push(t + 1.3);
        t += 1.3 + 1.7; // arrive, then hold long enough to read

        if (!last) {
          // Steps back and hangs on a wall of the room behind the next one.
          tl.to(frame, { z: -700, x: `${pos.wall}vw`, autoAlpha: 0.26, duration: 1.2, ease: "power2.inOut" }, t)
            .to([theme, cartel, ...labels], { autoAlpha: 0, duration: 0.45 }, t)
            .to([...dots, ...lines], { autoAlpha: 0, duration: 0.45 }, t);
          t += 0.55;
        }
      });
      tl.to({}, { duration: 0.8 });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${Math.round(tl.duration() * 34)}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          const time = self.progress * tl.duration();
          let n = 0;
          focusAt.forEach((f, k) => {
            if (time >= f - 1.2) n = k;
          });
          if (countRef.current) countRef.current.textContent = String(n + 1).padStart(2, "0");
        },
      });

      // Cursor: the vanishing point follows it — nearer pieces move more.
      const stageEl = el.querySelector<HTMLElement>(`.${o.pieces}`)!;
      const target = { x: 50, y: 46 };
      const cur = { ...target };
      const onMove = (e: PointerEvent) => {
        target.x = 50 + ((e.clientX / window.innerWidth) * 2 - 1) * 12;
        target.y = 46 + ((e.clientY / window.innerHeight) * 2 - 1) * 8;
      };
      const tick = (_: number, dt: number) => {
        if (!st.isActive) return;
        const k = 1 - Math.pow(1 - 0.06, dt / 16.67);
        cur.x += (target.x - cur.x) * k;
        cur.y += (target.y - cur.y) * k;
        stageEl.style.perspectiveOrigin = `${cur.x.toFixed(2)}% ${cur.y.toFixed(2)}%`;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
        st.kill();
        tl.kill();
      };
    });

    // ── Phones / tablets: pieces in flow, the eye's marks drawn on arrival ─
    mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
      const tweens = pieces.map((p) =>
        gsap
          .timeline({ scrollTrigger: { trigger: p.querySelector(`.${o.frame}`), start: "top 78%" } })
          .fromTo(p.querySelector(`.${o.frame}`), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out" })
          .fromTo(p.querySelectorAll(`.${o.dot}`), { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.15, ease: "back.out(3)" }, 0.6)
          .fromTo(p.querySelectorAll(`.${o.line}`), { scaleX: 0 }, { scaleX: 1, duration: 0.35, stagger: 0.15 }, 0.7)
          .fromTo(p.querySelectorAll(`.${o.label}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.15 }, 0.8),
      );
      return () =>
        tweens.forEach((x) => {
          x.scrollTrigger?.kill();
          x.kill();
        });
    });

    return () => mm.revert();
  }, []);

  const total = String(photos.length).padStart(2, "0");

  return (
    <div ref={root} className={o.room}>
      <svg className={o.floor} viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`r${i}`} x1={500 + (i - 8) * 30} y1={0} x2={500 + (i - 8) * 190} y2={400} />
        ))}
        {[0, 18, 42, 76, 122, 184, 266, 400].map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={1000} y2={y} />
        ))}
      </svg>

      <header className={o.head}>
        <p className={`${o.kicker} aa-micro`}>
          <span>04 — {spaces.steps[3]}</span>
          <span>{spaces.galleryKicker}</span>
        </p>
        <h3 className={o.title}>
          {spaces.galleryTitle[0]} <em>{spaces.galleryTitle[1]}</em>
        </h3>
        <p className={o.lead}>« {observation.lead} »</p>
      </header>

      <ol className={o.pieces} aria-label="Observations — Espace Niemeyer">
        {photos.map((m, i) => {
          const d = observation.pieces[m.slug];
          const pos = FOCUS[i % FOCUS.length];
          const cap = sharpWidth(m);
          const cartelLeft = pos.fx < 50;
          return (
            <li
              key={m.src}
              className={o.piece}
              style={
                {
                  "--fx": `${pos.fx}%`,
                  "--ar": `${m.w} / ${m.h}`,
                  "--cap": `${cap}px`,
                } as CSSProperties
              }
              data-cartel={cartelLeft ? "right" : "left"}
            >
              {d && (
                <p className={o.theme} aria-hidden="true">
                  {d.theme}
                </p>
              )}
              <figure className={o.frame}>
                <Photo media={m} sizes={`(min-width: 1024px) min(42vw, ${cap}px), 90vw`} className={o.photo} />
                {d && (
                  <ul className={o.markers} aria-label="Ce que l'œil relève">
                    {d.markers.map((mk) => (
                      <li key={mk.label} className={o.marker} data-side={mk.side} style={{ left: `${mk.x}%`, top: `${mk.y}%` }}>
                        <i className={o.dot} aria-hidden="true" />
                        <span className={o.line} aria-hidden="true" />
                        <span className={`${o.label} aa-micro`}>{mk.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </figure>
              <aside className={o.cartel}>
                <span className={`${o.cartelNo} aa-micro`}>
                  N° {String(i + 1).padStart(2, "0")}
                  {d && <> — {d.theme}</>}
                </span>
                <p className={o.cartelTitle}>{m.caption ?? spaces.place}</p>
                {d && <p className="aa-micro">{d.materials}</p>}
                <p className={`${o.cartelMeta} aa-micro`}>
                  {spaces.galleryKicker} · {spaces.architect}
                </p>
                {d && <p className={o.cartelQuote}>« {d.quote} »</p>}
              </aside>
            </li>
          );
        })}
      </ol>

      <p className={`${o.counter} aa-micro`} aria-hidden="true">
        <span ref={countRef}>01</span> / {total}
      </p>
    </div>
  );
}
