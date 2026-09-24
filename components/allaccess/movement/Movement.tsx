"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { danse, movement, recit } from "@/content/allaccess";
import { media } from "@/content/media";
import { Photo } from "../Photo";
import s from "./Movement.module.css";

const BEAT = 0.25; // timeline units per beat — one word lands per beat

export function Movement() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const phrases = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.phrase}`));
      const dots = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.dot}`));
      const photo = stage.querySelector<HTMLElement>(`.${s.photo}`);
      const skewTo = gsap.quickTo(stage.querySelector(`.${s.floor}`), "skewX", { duration: 0.5, ease: "power3.out" });

      gsap.set(phrases, { autoAlpha: 0, yPercent: -50, "--fill": 1 });
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      let t = 0;

      phrases.forEach((ph, i) => {
        const last = i === phrases.length - 1;
        const words = Array.from(ph.querySelectorAll<HTMLElement>(`.${s.w}`));
        tl.set(ph, { autoAlpha: 1, y: 0, scale: 1 }, t);
        words.forEach((w, k) => {
          const side = k % 2 ? 1 : -1;
          tl.fromTo(
            w,
            { yPercent: 120, rotation: side * 7, autoAlpha: 0 },
            { yPercent: 0, rotation: 0, autoAlpha: 1, duration: BEAT * 0.9, ease: "back.out(2.6)" },
            t + k * BEAT,
          );
        });
        // The photo breathes on the downbeat of each phrase.
        if (photo) tl.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: BEAT * 2, ease: "power3.out" }, t);
        const len = words.length * BEAT + BEAT * 2; // land, then hold two beats
        t += len;
        // Step back: the line becomes an outline trail above the next one.
        // The last line stays lit — it is where the sequence lands.
        if (last) return;
        tl.to(ph, { y: "-=1.15em", scale: 0.62, "--fill": 0, duration: BEAT * 2, ease: "power2.inOut" }, t - BEAT)
          .to(ph, { autoAlpha: 0, duration: BEAT * 2 }, t + BEAT * 5);
      });
      tl.to({}, { duration: BEAT * 6 });

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.round(tl.duration() * 21)}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const beat = Math.floor(tl.time() / BEAT);
          dots.forEach((d, k) => (d.dataset.on = String(beat % 4 === k)));
          skewTo(gsap.utils.clamp(-9, 9, self.getVelocity() / -260));
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    });

    // Calm part reveals.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tweens = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]")).map((n) =>
        gsap.fromTo(n, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 86%" } }),
      );
      return () =>
        tweens.forEach((x) => {
          x.scrollTrigger?.kill();
          x.kill();
        });
    });

    return () => mm.revert();
  }, []);

  // Echo: ghost copies trail the cursor like a long exposure.
  const onEcho = (e: ReactPointerEvent<HTMLDivElement>) => {
    const box = echoRef.current;
    if (!box || e.pointerType !== "mouse") return;
    const r = box.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    box.querySelectorAll<HTMLElement>(`.${s.ghost}`).forEach((g, k) => {
      gsap.to(g, { x: dx * 70 * (k + 1), y: dy * 40 * (k + 1), duration: 0.5 + k * 0.25, ease: "power3.out", overwrite: "auto" });
    });
  };
  const offEcho = () => {
    echoRef.current?.querySelectorAll<HTMLElement>(`.${s.ghost}`).forEach((g) => gsap.to(g, { x: 0, y: 0, duration: 1.2, ease: "expo.out", overwrite: "auto" }));
  };

  const accentOf = (i: number) => movement.accents[i] ?? "";

  return (
    <section ref={root} id="movement" className={s.movement} data-chapter="05" data-theme-zone="dark" aria-labelledby="movement-title">
      <div ref={stageRef} className={s.stage}>
        <div className={s.photoWrap} aria-hidden="true">
          <div className={s.photo}>
            <Photo media={media.danceBW} sizes="(min-width: 768px) 30vw, 70vw" />
          </div>
        </div>

        <p className={`${s.kicker} aa-micro`}>05 — {movement.kicker}</p>
        <p className={`${s.meter} aa-micro`} aria-hidden="true">
          <span>{movement.meter}</span>
          {[0, 1, 2, 3].map((k) => (
            <i key={k} className={s.dot} data-on={String(k === 0)} />
          ))}
        </p>

        <h2 id="movement-title" className="visually-hidden">
          {recit.lines.join(" ")}
        </h2>
        <div className={s.floor} aria-hidden="true">
          {recit.lines.map((line, i) => (
            <p key={line} className={s.phrase} data-align={["left", "right", "center"][i % 3]}>
              {line.split(" ").map((w, k) => (
                <span
                  key={`${w}-${k}`}
                  className={`${s.w} ${w === accentOf(i) ? s.accent : ""} ${i === 1 && w === accentOf(i) ? s.coral : ""}`}
                >
                  {w}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <div className={s.calm} data-theme-zone="dark">
        <div className={s.calmText}>
          <p className={`${s.kicker} ${s.kickerStatic} aa-micro`} data-reveal>
            {danse.kicker}
          </p>
          <h3 className={s.calmTitle} data-reveal>
            {danse.title}
          </h3>
          {danse.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className={s.para} data-reveal>
              {p}
            </p>
          ))}
        </div>
        <div ref={echoRef} className={s.echo} onPointerMove={onEcho} onPointerLeave={offEcho} data-reveal data-cursor="echo" data-cursor-label="Move">
          {[3, 2, 1].map((k) => (
            <div key={k} className={s.ghost} style={{ opacity: 0.1 + (3 - k) * 0.06 }} aria-hidden="true">
              <Photo media={media.danceBW} sizes="(min-width: 1024px) 34vw, 86vw" />
            </div>
          ))}
          <Photo media={media.danceBW} sizes="(min-width: 1024px) 34vw, 86vw" className={s.echoMain} />
        </div>
      </div>
    </section>
  );
}
