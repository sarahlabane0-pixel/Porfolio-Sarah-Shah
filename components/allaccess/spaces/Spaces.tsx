"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { curiosity, niemeyer, spaces } from "@/content/allaccess";
import { media } from "@/content/media";
import type { NiemeyerPhoto } from "@/lib/niemeyerPhotos";
import { webglAvailable } from "../hero/PortraitGL";
import { Photo, sharpWidth } from "../Photo";
import s from "./Spaces.module.css";

/**
 * `photos` are Sarah's Espace Niemeyer photographs, read at build time from
 * public/assets/places/niemeyer/ (see lib/niemeyerPhotos.ts). The first one
 * is the picture the 3D lines are pulled out of; all of them get the gallery.
 */
export function Spaces({ photos }: { photos: NiemeyerPhoto[] }) {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Each photograph has one role, and appears once: the dome is where the 3D
  // journey arrives; every other photo hangs in the exhibition after it.
  const arrival = photos.find((m) => m.slug === spaces.arrivalSlug) ?? photos[photos.length - 1];
  const exhibits = photos.filter((m) => m !== arrival);
  const missing = photos.length === 0;
  const revealRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const el = root.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!el || !stage || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = !window.matchMedia("(min-width: 1024px)").matches;
    const steps = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.step}`));

    const reveal = revealRef.current;
    // Opening onto the photograph: a circle from the dome's centre, the
    // photo settling as it opens, the words over the real place.
    const setReveal = (p: number) => {
      if (!reveal) return;
      const r = gsap.utils.clamp(0, 1, (p - 0.8) / 0.16);
      const e = r * r * (3 - 2 * r);
      reveal.style.setProperty("--r", `${(e * 78).toFixed(2)}%`);
      reveal.style.setProperty("--k", e.toFixed(3));
      reveal.dataset.open = String(e > 0.001);
    };

    if (!webglAvailable()) {
      stage.dataset.gl = "off";
      setReveal(1);
      return;
    }

    let gl: import("./NiemeyerGL").NiemeyerGL | null = null;
    let disposed = false;
    let st: ScrollTrigger | null = null;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(stage);

    const size = () => gl?.resize(stage.clientWidth, stage.clientHeight);
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gl?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    const tick = (time: number) => {
      if (gl && visible) gl.render(time);
    };

    // Three.js only loads when this chapter is about to be needed.
    const font = getComputedStyle(stage).getPropertyValue("--aa-display") || "sans-serif";
    import("./NiemeyerGL").then(({ NiemeyerGL }) => {
      if (disposed) return;
      gl = new NiemeyerGL(canvas, {
        lite,
        font: getComputedStyle(stage).fontFamily || font,
        photoLabel: missing ? spaces.photoLabel : spaces.sheetLabel,
        missing,
      });
      size();
      stage.dataset.gl = "on";

      if (reduce) {
        // One still composition: volume, light and the words.
        gl.setProgress(0.9);
        gl.render(0);
        setReveal(1);
        gsap.ticker.add(tick);
        return;
      }

      st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: lite ? "+=300%" : "+=400%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          gl?.setProgress(self.progress);
          const k = self.progress < 0.3 ? 0 : self.progress < 0.62 ? 1 : 2;
          steps.forEach((n, i) => (n.dataset.on = String(i <= k)));
          stage.dataset.words = String(self.progress > 0.7);
          setReveal(self.progress);
        },
      });
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);
      ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      st?.kill();
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      gl?.dispose();
    };
  }, [missing]);

  // Calm part: reveal on entry.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tweens = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]")).map((n) =>
      gsap.fromTo(n, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 85%" } }),
    );
    // Exhibition: each frame opens like a wall being lit, the photograph
    // drifting slowly inside it as you walk past.
    const hangs = Array.from(el.querySelectorAll<HTMLElement>(`.${s.exhibitFrame}`)).flatMap((f) => {
      const img = f.querySelector("img");
      return [
        gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: f, start: "top 90%", end: "top 35%", scrub: 1 } }),
        gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.04, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } }),
      ];
    });
    return () => {
      hangs.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  const gallery = spaces.gallery.map((g) => ({ ...g, media: media[g.key] }));

  return (
    <section ref={root} id="spaces" className={s.spaces} data-chapter="04" aria-labelledby="spaces-title">
      <div ref={stageRef} className={s.stage} data-gl="pending" data-theme-zone="dark">
        <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
        <header className={s.overlay}>
          <p className={`${s.kicker} aa-micro`}>04 — {spaces.kicker}</p>
          <p className={s.place}>{spaces.place}</p>
          <p className={`${s.note} aa-micro`}>{spaces.note}</p>
        </header>
        {arrival && (
          <div ref={revealRef} className={s.reveal} data-open="false" style={{ "--cap": `${Math.round(arrival.w / 1.25)}px` } as CSSProperties}>
            <figure className={s.revealFrame}>
              <Photo media={arrival} sizes={`(min-width: 768px) min(88vw, ${Math.round(arrival.w / 1.25)}px), 90vw`} className={s.revealImg} />
              <figcaption className={s.revealCaption}>
                <span className="aa-micro">{spaces.place}</span>
                {arrival.caption && <span className="aa-micro">{arrival.caption}</span>}
              </figcaption>
            </figure>
            <p className={s.revealTitle} aria-hidden="true">
              I collect spaces<em>.</em>
            </p>
          </div>
        )}
        <h2 id="spaces-title" className={s.fallbackTitle}>
          {spaces.title.replace(".", "")}
          <em>.</em>
        </h2>
        <ol className={s.steps} aria-hidden="true">
          {spaces.steps.map((t, i) => (
            <li key={t} className={`${s.step} aa-micro`} data-on={String(i === 0)}>
              <span>0{i + 1}</span> {t}
            </li>
          ))}
        </ol>
      </div>

      <div className={s.calm} data-theme-zone="dark">
        {(exhibits.length > 0 || missing) && (
        <div className={s.photos}>
          <header className={s.photosHead} data-reveal>
            <p className={`${s.kickerDark} aa-micro`}>{spaces.galleryKicker}</p>
            <h3 className={s.photosTitle}>
              {spaces.galleryTitle[0]} <em>{spaces.galleryTitle[1]}</em>
            </h3>
          </header>
          {exhibits.length > 0 && (
            <ol className={s.exhibits} aria-label="Photographies de l'Espace Niemeyer">
              {exhibits.map((m, i) => {
                const cap = sharpWidth(m);
                const note = spaces.notes[m.slug];
                return (
                  <li key={m.src} className={s.exhibit} data-side={i % 2 ? "right" : "left"}>
                    <figure className={s.exhibitFrame} style={{ "--ar": `${m.w} / ${m.h}`, "--cap": `${cap}px` } as CSSProperties}>
                      <Photo media={m} sizes={`(min-width: 1024px) min(46vw, ${cap}px), 88vw`} />
                    </figure>
                    <aside className={s.cartel} data-reveal>
                      <span className="aa-micro">N° {String(i + 1).padStart(2, "0")}</span>
                      <p className={s.cartelTitle}>{m.caption ?? spaces.place}</p>
                      <p className="aa-micro">{spaces.galleryKicker}</p>
                      <p className="aa-micro">{spaces.architect}</p>
                      {note && <p className={s.cartelNote}>« {note} »</p>}
                    </aside>
                  </li>
                );
              })}
            </ol>
          )}
          {missing && (
            <ul className={s.track} aria-label="Photographies de l'Espace Niemeyer à fournir">
              {spaces.missing.map((label, i) => (
                <li key={label} className={`${s.shot} ${s.shotMissing}`} style={{ "--ar": i === 1 ? "4 / 5" : "3 / 2" } as CSSProperties}>
                  <span className="aa-micro">Photographie à fournir</span>
                  <span className="aa-micro">Espace Niemeyer — {label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        )}

        <div className={s.text}>
          <p className={`${s.kickerDark} aa-micro`} data-reveal>
            {niemeyer.kicker}
          </p>
          <h3 className={s.calmTitle} data-reveal>
            {niemeyer.title}
          </h3>
          {niemeyer.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className={s.para} data-reveal>
              {p}
            </p>
          ))}
        </div>

        <div className={s.curiosity}>
          <p className={`${s.kickerDark} aa-micro`} data-reveal>
            {curiosity.kicker}
          </p>
          <h3 className={s.curiosityTitle} data-reveal>
            {curiosity.title}
          </h3>
          <p className={s.para} data-reveal>
            {curiosity.intro}
          </p>
        </div>

        {/* Panels expand on hover / focus / tap — the place you look at gets the room. */}
        <ul className={s.panels} data-reveal>
          {gallery.map((g, i) => (
            <li key={g.key} className={s.panel} data-open={String(open === i)}>
              <button
                type="button"
                className={s.panelBtn}
                aria-expanded={open === i}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                data-cursor="place"
                data-cursor-label="Look"
              >
                <Photo media={g.media} sizes="(min-width: 1024px) 40vw, 80vw" className={s.panelImg} />
                <span className={s.panelLabel}>
                  <span className="aa-micro">0{i + 1}</span>
                  <span>{g.title}</span>
                </span>
              </button>
              {"noteIndex" in g && (
                <p className={s.panelNote}>{curiosity.notes[g.noteIndex].text}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
