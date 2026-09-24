"use client";

import { useEffect, useId, useRef, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { HERO_SRC, loadHeroAssets } from "@/lib/heroAssets";
import { accessPass, identity, onTheList, revealCue } from "@/content/allaccess";
import { PortraitGL, webglAvailable } from "./PortraitGL";
import s from "./Hero.module.css";

// Where the full-screen stage contracts to, per layout. Units: svh / vw.
const DESKTOP = { top: 17, bottom: 13, x: 36, scale: 0.66, ty: 2, origin: "50% 52%" };
const MOBILE = { top: 19, bottom: 37, x: 16, scale: 0.45, ty: 0, origin: "50% 41%" };

// Resting rotations of the identity pieces. GSAP owns their transforms, so
// these are applied through GSAP rather than left to CSS `rotate`.
const ROT = { panel: -6, shard: 12, pass: 7, beamL: -19, beamR: 19 };

// Cursor depth: pixels of travel per unit of (smoothed) pointer offset at a
// 1440px-wide viewport. Nearer layers travel further, so type, portrait,
// glass and pass read as sitting at different distances from the camera.
const DEPTH = { far: 7, beams: 11, sarah: 15, portrait: 20, identity: 16, pass: 14, shah: 32 };

const RIBBON_D = "M -160 1235 C 160 1090, 430 1040, 650 1135 S 1030 1190, 1300 985";

const STRUCTURE_FLOOR = Array.from({ length: 13 }, (_, i) => i - 6);

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const cueLabelRef = useRef<HTMLSpanElement>(null);
  const cueActionRef = useRef<HTMLSpanElement>(null);
  const glRef = useRef<PortraitGL | null>(null);
  const revealTl = useRef<gsap.core.Timeline | null>(null);
  const revealed = useRef(false);
  const entered = useRef(false);
  const readyRef = useRef(ready);
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ribbonId = `ribbon-${uid}`;
  const satinId = `satin-${uid}`;

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  // ── Cursor depth + WebGL portrait render loop ─────────────────────────
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const one = (sel: string) => el.querySelector<HTMLElement>(sel);
    const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));
    const layers = {
      far: all('[data-depth="far"]'),
      beams: all('[data-depth="beams"]'),
      sarah: all('[data-depth="sarah"]'),
      portrait: all('[data-depth="portrait"]'),
      identity: all('[data-depth="identity"]'),
      pass: all('[data-depth="pass"]'),
      shah: all('[data-depth="shah"]'),
    };
    const glass = all(`.${s.glass}`);
    const box = one(`.${s.portrait}`);

    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let gl: PortraitGL | null = null;
    let disposed = false;

    const sizeGL = () => {
      if (gl && box) gl.resize(box.offsetWidth, box.offsetHeight);
    };

    if (wide && webglAvailable()) {
      loadHeroAssets(true).then(({ cutout, depth }) => {
        if (disposed || !depth || !canvasRef.current) return;
        try {
          gl = new PortraitGL(canvasRef.current, cutout, depth);
          glRef.current = gl;
          sizeGL();
          gl.render(0);
          el.dataset.gl = "on";
        } catch {
          el.dataset.gl = "off";
        }
      });
    }

    const ro = new ResizeObserver(sizeGL);
    if (box) ro.observe(box);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const light = { x: 0.35, y: 0.45 };
    let pointerSeen = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerSeen = true;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const move = (els: HTMLElement[], f: number, extra = "") => {
      const x = -cur.x * f;
      const y = -cur.y * f * 0.6;
      for (const node of els) node.style.transform = `translate3d(${x}px, ${y}px, 0)${extra}`;
    };

    const tick = (time: number, dt: number) => {
      // Nothing to draw while the loader covers the stage or it's off-screen.
      if (!visible || !readyRef.current) return;
      if (!pointerSeen) {
        // Before any mouse input (or on touch), a slow autonomous drift keeps
        // the scene breathing instead of freezing.
        target.x = Math.sin(time * 0.32) * 0.28;
        target.y = Math.cos(time * 0.23) * 0.16;
      }
      // Frame-rate independent easing: the scene lags the cursor physically.
      const k = 1 - Math.pow(1 - 0.055, dt / 16.67);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      const kl = 1 - Math.pow(1 - 0.022, dt / 16.67);
      light.x += (0.25 + target.x * 0.95 - light.x) * kl;
      light.y += (0.5 - target.y * 0.75 - light.y) * kl;

      const unit = window.innerWidth / 1440;
      move(layers.far, DEPTH.far * unit);
      move(layers.beams, DEPTH.beams * unit, ` rotate(${cur.x * 1.5}deg)`);
      move(layers.sarah, DEPTH.sarah * unit);
      move(
        layers.portrait,
        DEPTH.portrait * unit,
        ` perspective(1400px) rotateY(${cur.x * 2.4}deg) rotateX(${-cur.y * 1.8}deg)`,
      );
      move(layers.identity, DEPTH.identity * unit);
      move(layers.pass, DEPTH.pass * unit, ` rotate(${cur.x * 2.5}deg)`);
      move(layers.shah, DEPTH.shah * unit);
      for (const g of glass) g.style.setProperty("--glint", cur.x.toFixed(3));

      if (gl) {
        gl.u.uMouse.value.set(-cur.x, cur.y);
        gl.u.uLight.value.set(light.x, light.y);
        gl.render(time);
      }
    };
    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      gl?.dispose();
      glRef.current = null;
      el.dataset.gl = "off";
    };
  }, [reduced]);

  // ── Entry: real portrait (A) → event structure (B) → full identity (C) ─
  useEffect(() => {
    const el = root.current;
    if (!el || !ready) return;
    const one = (sel: string) => el.querySelector<HTMLElement>(sel);
    const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

    const ctx = gsap.context(() => {
      const panel = one(`.${s.panel}`);
      const shard = one(`.${s.shard}`);
      const pass = one(`.${s.pass}`);
      const beamL = one(`.${s.beamL}`);
      const beamR = one(`.${s.beamR}`);
      gsap.set(panel, { rotation: ROT.panel, transformPerspective: 900 });
      gsap.set(shard, { rotation: ROT.shard });
      gsap.set(pass, { rotation: ROT.pass });
      gsap.set(beamL, { rotation: ROT.beamL });
      gsap.set(beamR, { rotation: ROT.beamR });

      if (reduced) {
        entered.current = true;
        return;
      }

      const h = window.innerHeight;
      const w = window.innerWidth;
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          entered.current = true;
        },
      });

      tl.fromTo(one(`.${s.portraitEntry}`), { autoAlpha: 0, y: h * 0.05, scale: 1.04 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.9 }, 0)
        .fromTo(all(`.${s.wordInner}`), { yPercent: 105 }, { yPercent: 0, duration: 1.6, stagger: 0.08 }, 0.1)
        // B — the production structure assembles around her
        .fromTo(all(`.${s.structure} [pathLength]`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.012 }, 0.4)
        .fromTo(one(`.${s.led}`), { autoAlpha: 0 }, { autoAlpha: 0.2, duration: 1.6, ease: "power2.out" }, 0.5)
        .fromTo([beamL, beamR], { autoAlpha: 0, scaleY: 0.35 }, { autoAlpha: 0.5, scaleY: 1, duration: 1.6, stagger: 0.12 }, 0.55)
        .fromTo(one(`.${s.ribbonStroke}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power3.inOut" }, 0.85)
        .fromTo(all(`.${s.ribbonText}, .${s.ribbonEdge}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 1.3)
        .fromTo(all(`.${s.code}, .${s.mark}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.07 }, 1.0)
        // C — acrylic, shard and accreditation close in
        .fromTo(panel, { x: w * 0.14, rotationY: -40, rotation: ROT.panel - 10, autoAlpha: 0 }, { x: 0, rotationY: 0, rotation: ROT.panel, autoAlpha: 1, duration: 1.6 }, 1.25)
        .fromTo(shard, { x: -w * 0.1, rotation: ROT.shard + 26, autoAlpha: 0 }, { x: 0, rotation: ROT.shard, autoAlpha: 1, duration: 1.5 }, 1.35)
        .fromTo(pass, { y: -h * 0.45, rotation: ROT.pass - 30, autoAlpha: 0 }, { y: 0, rotation: ROT.pass, autoAlpha: 1, duration: 1.7 }, 1.45)
        .fromTo(all(`[data-hud]`), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 1.8);

      // Beams keep a slow sweep once they're lit.
      tl.add(() => {
        gsap.to(beamL, { rotation: ROT.beamL + 4, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(beamR, { rotation: ROT.beamR - 3, duration: 8.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }, 2.2);
    }, el);

    return () => ctx.revert();
  }, [ready, reduced]);

  // ── Scroll: the stage is a camera, not a section ──────────────────────
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(
      // Both layouts are listed explicitly: matchMedia only runs this
      // callback when at least one condition matches.
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
        const cfg = desktop ? DESKTOP : MOBILE;
        const one = (sel: string) => el.querySelector<HTMLElement>(sel);
        const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

        const stage = one(`.${s.stage}`);
        const inner = one(`.${s.stageInner}`);
        const paper = one(`.${s.paper}`);
        const keyProxy = { value: 0 };
        const setTheme = (light: boolean) => {
          html.dataset.aaTheme = light ? "light" : "dark";
        };

        gsap.set(el, {
          "--frame-top": `${cfg.top}svh`,
          "--frame-bottom": `${cfg.bottom}svh`,
          "--frame-x": `${cfg.x}vw`,
        });
        gsap.set(inner, { transformOrigin: cfg.origin });

        const tl = gsap.timeline({ defaults: { ease: "none" }, paused: reduce });

        // 0 → 25 % : camera pushes in, type separates in depth, HUD clears.
        tl.to(all("[data-hud]"), { autoAlpha: 0, duration: 0.8 }, 0)
          .to(inner, { scale: 1.06, duration: 2.4, ease: "power1.inOut" }, 0)
          .to(all(`[data-word="sarah"] .${s.wordClip}`), { yPercent: -24, scale: 0.9, autoAlpha: 0, duration: 2.6 }, 0.9)
          .to(all(`[data-word="shah"] .${s.wordClip}`), { yPercent: 34, scale: 1.16, autoAlpha: 0, duration: 2.6 }, 0.9)
          // the event identity parts as the camera passes through it
          .to(one(`.${s.identity}`), { scale: 1.24, autoAlpha: 0, duration: 2.2 }, 1.5)
          // 30 → 60 % : the whole scene contracts into a frame on an ivory page
          .fromTo(
            stage,
            { clipPath: "inset(0svh 0vw 0svh 0vw)" },
            { clipPath: `inset(${cfg.top}svh ${cfg.x}vw ${cfg.bottom}svh ${cfg.x}vw)`, duration: 3, ease: "power2.inOut" },
            2.6,
          )
          .to(inner, { scale: cfg.scale, y: () => (window.innerHeight * cfg.ty) / 100, duration: 3, ease: "power2.inOut" }, 2.6)
          .fromTo(
            paper,
            { autoAlpha: 1, clipPath: `inset(${cfg.top}svh ${cfg.x}vw ${cfg.bottom}svh ${cfg.x}vw)` },
            { clipPath: "inset(0svh 0vw 0svh 0vw)", duration: 2.2, ease: "power3.inOut" },
            4.2,
          )
          .to(
            keyProxy,
            {
              value: 1,
              duration: 2,
              onUpdate: () => {
                if (glRef.current) glRef.current.u.uScrollKey.value = keyProxy.value;
              },
            },
            2.8,
          )
          .to([one(`.${s.frame}`), one(`.${s.rules}`)], { autoAlpha: 1, duration: 0.9 }, 4.8)
          // 60 → 80 % : YOU'RE ON THE LIST, then the welcome
          .fromTo(all(`[data-list] .${s.line} > span`), { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.16, ease: "power3.out" }, 5)
          .to(all(`.${s.labelL}, .${s.labelR}`), { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 5.4)
          .fromTo(all(`[data-intro] .${s.line} > span`), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "power3.out" }, 6.2)
          .to(one(`.${s.fields}`), { autoAlpha: 1, duration: 0.8 }, 6.6)
          // 80 → 100 % : hold, so the calm lands before the page moves on
          .to({}, { duration: 1.8 });

        if (reduce) {
          // No scrub, no camera: one pin, one short crossfade between the two
          // compositions.
          let framed = false;
          tl.progress(0);
          const st = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=120%",
              pin: true,
              onUpdate: (self) => {
                const next = self.progress > 0.25;
                if (next === framed) return;
                framed = next;
                tl.progress(next ? 1 : 0);
                setTheme(next);
                gsap.fromTo([stage, one(`.${s.copy}`)], { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.35 });
              },
            },
          });
          return () => {
            st.kill();
            setTheme(false);
          };
        }

        const trigger = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: desktop ? "+=340%" : "+=260%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setTheme(self.progress > 0.62),
          },
        });
        trigger.add(tl);

        return () => setTheme(false);
      },
    );

    return () => mm.revert();
  }, []);

  // ── Reveal: peel the event identity away to the real portrait, and back ─
  const toggleReveal = (event?: MouseEvent<HTMLButtonElement>) => {
    const el = root.current;
    if (!el || !entered.current) return;
    const one = (sel: string) => el.querySelector<HTMLElement>(sel);
    const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

    if (!revealTl.current) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      revealTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut", duration: 1.15 } })
        .to(one(`.${s.panel}`), { x: w * 0.24, rotationY: 58, rotation: ROT.panel - 12, autoAlpha: 0 }, 0)
        .to(one(`.${s.shard}`), { x: -w * 0.16, rotation: ROT.shard + 26, autoAlpha: 0 }, 0.05)
        .to(one(`.${s.pass}`), { y: h * 0.55, rotation: ROT.pass + 24, autoAlpha: 0, ease: "power3.in", duration: 0.85 }, 0)
        .to(one(`.${s.ribbonStroke}`), { strokeDashoffset: -1, duration: 1.25, ease: "power3.inOut" }, 0)
        .to(all(`.${s.ribbonText}, .${s.ribbonEdge}`), { autoAlpha: 0, duration: 0.35 }, 0)
        .to(all(`.${s.code}, .${s.mark}`), { autoAlpha: 0, duration: 0.3, stagger: 0.02 }, 0)
        .to(all(`.${s.beam}`), { autoAlpha: 0.16, duration: 1 }, 0)
        .to(one(`.${s.led}`), { autoAlpha: 0.07, duration: 1 }, 0);
    }

    const next = !revealed.current;
    revealed.current = next;
    el.dataset.state = next ? "real" : "event";
    if (next) revealTl.current.play();
    else revealTl.current.reverse();

    const copy = next ? revealCue.realState : revealCue.eventState;
    if (cueLabelRef.current) cueLabelRef.current.textContent = copy.label;
    if (cueActionRef.current) cueActionRef.current.textContent = copy.action;
    const hit = hitRef.current;
    if (hit) {
      hit.setAttribute("aria-pressed", String(next));
      hit.setAttribute("aria-label", next ? revealCue.buttonRestore : revealCue.buttonReveal);
      hit.dataset.cursorLabel = next ? "Restore" : "Reveal";
    }

    const gl = glRef.current;
    if (gl) {
      let ox = 0.5;
      let oy = 0.72;
      if (event && event.detail > 0) {
        const r = event.currentTarget.parentElement!.getBoundingClientRect();
        ox = (event.clientX - r.left) / r.width;
        oy = 1 - (event.clientY - r.top) / r.height;
      }
      gl.u.uRippleOrigin.value.set(ox, oy);
      gsap.fromTo(gl.u.uRipple, { value: 0.001 }, { value: 0.999, duration: 1.6, ease: "power2.out" });
      gsap.to(gl.u.uKey, { value: next ? 1 : 0, duration: 1.3, ease: "power2.inOut" });
    }
  };

  const onHitEnter = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && root.current) root.current.dataset.hover = "on";
  };
  const onHitLeave = () => {
    if (root.current) root.current.dataset.hover = "off";
  };

  return (
    <section
      ref={root}
      id="entree"
      className={s.hero}
      data-gl="off"
      data-state="event"
      aria-label="Entrée — Sarah Shah, All Access"
    >
      <h1 className="visually-hidden">
        Sarah Shah — communication événementielle, stratégie éditoriale et expériences de marque
      </h1>

      <div className={s.world} aria-hidden="true">
        <div className={s.paper} />
        <div className={s.rules}>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={s.stage}>
        <div className={s.stageInner}>
          <div className={s.backdrop} data-depth="far" aria-hidden="true">
            <div className={s.led} />
            <svg className={s.structure} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
              <line x1="140" y1="70" x2="1460" y2="70" pathLength={1} />
              <line x1="140" y1="112" x2="1460" y2="112" pathLength={1} />
              <polyline
                pathLength={1}
                points={Array.from({ length: 34 }, (_, i) => `${140 + i * 40},${i % 2 ? 112 : 70}`).join(" ")}
              />
              <line x1="188" y1="112" x2="188" y2="1000" pathLength={1} className={s.strong} />
              <line x1="204" y1="112" x2="204" y2="1000" pathLength={1} />
              <line x1="1396" y1="112" x2="1396" y2="1000" pathLength={1} />
              <line x1="1412" y1="112" x2="1412" y2="1000" pathLength={1} className={s.strong} />
              <rect x="420" y="150" width="760" height="530" pathLength={1} />
              <line x1="-100" y1="790" x2="1700" y2="790" pathLength={1} className={s.strong} />
              {STRUCTURE_FLOOR.map((i) => (
                <line key={i} x1={800 + i * 95} y1="790" x2={800 + i * 430} y2="1000" pathLength={1} />
              ))}
              <line x1="-100" y1="836" x2="1700" y2="836" pathLength={1} />
              <line x1="-100" y1="902" x2="1700" y2="902" pathLength={1} />
            </svg>
            <div className={s.pool} />
          </div>

          <div className={s.beams} data-depth="beams" aria-hidden="true">
            <span className={`${s.beam} ${s.beamL}`} />
            <span className={`${s.beam} ${s.beamR}`} />
          </div>

          <p className={`${s.word} ${s.sarah} ${s.solid}`} data-depth="sarah" data-word="sarah" aria-hidden="true">
            <span className={s.wordClip}>
              <span className={s.wordInner}>{identity.firstName}</span>
            </span>
          </p>
          <p className={`${s.word} ${s.shah} ${s.solid}`} data-depth="shah" data-word="shah" aria-hidden="true">
            <span className={s.wordClip}>
              <span className={s.wordInner}>{identity.lastName}</span>
            </span>
          </p>

          <div className={s.portraitPos}>
            <div className={s.portraitEntry}>
              <div className={s.portrait} data-depth="portrait">
                {/* eslint-disable-next-line @next/next/no-img-element -- raw cutout keeps its alpha untouched; also the WebGL fallback */}
                <img
                  className={s.fallback}
                  src={HERO_SRC.cutout}
                  alt="Portrait de Sarah Shah"
                  width={1122}
                  height={1402}
                  fetchPriority="high"
                />
                <canvas ref={canvasRef} className={s.gl} aria-hidden="true" />

                <div className={s.identity} aria-hidden="true">
                  <div className={s.identityDepth} data-depth="identity">
                    <svg className={s.ribbon} viewBox="0 0 1122 1402">
                      <defs>
                        <linearGradient id={satinId} gradientUnits="userSpaceOnUse" x1="0" y1="1100" x2="1122" y2="1100">
                          <stop offset="0" stopColor="#2a0712" />
                          <stop offset="0.28" stopColor="#651a35" />
                          <stop offset="0.46" stopColor="#c6c5c2" />
                          <stop offset="0.54" stopColor="#f2ece4" />
                          <stop offset="0.68" stopColor="#8a7a7f" />
                          <stop offset="1" stopColor="#2a0712" />
                        </linearGradient>
                        <path id={ribbonId} d={RIBBON_D} />
                      </defs>
                      <path
                        d={RIBBON_D}
                        className={s.ribbonStroke}
                        stroke={`url(#${satinId})`}
                        pathLength={1}
                      />
                      <use href={`#${ribbonId}`} className={s.ribbonEdge} transform="translate(0 -22)" />
                      <use href={`#${ribbonId}`} className={s.ribbonEdge} transform="translate(0 22)" />
                      <text className={s.ribbonText} dy="5">
                        <textPath href={`#${ribbonId}`}>{accessPass.ribbon.repeat(5)}</textPath>
                      </text>
                    </svg>

                    <div className={s.panelWrap}>
                      <div className={`${s.glass} ${s.panel}`}>
                        <span className={`${s.panelEtch} ${s.panelEtchTop} aa-micro`}>All access</span>
                        <span className={`${s.panelEtch} ${s.panelEtchV} aa-micro`}>Backstage — Portfolio 2026</span>
                        <span className={`${s.panelEtch} ${s.panelEtchBottom} aa-micro`}>
                          <i /> Entry
                        </span>
                      </div>
                    </div>

                    <div className={`${s.glass} ${s.shard}`} />

                    <p className={`${s.code} aa-micro`} style={{ left: "90%", top: "2.5%" }}>
                      Backstage
                    </p>
                    <p className={`${s.code} aa-micro`} style={{ left: "1%", top: "13%" }}>
                      Entry
                    </p>
                    <p className={`${s.code} aa-micro`} style={{ left: "2%", top: "73%" }}>
                      Paris / FR
                    </p>
                    <span className={s.mark} style={{ left: "22%", top: "5%" }} />
                    <span className={s.mark} style={{ left: "86%", top: "47%" }} />
                    <span className={s.mark} style={{ left: "11%", top: "39%" }} />

                    <div className={s.passDepth} data-depth="pass">
                      <div className={`${s.glass} ${s.pass}`}>
                        <span className={s.passSlot} />
                        <p className={s.passTitle}>
                          {accessPass.title} <i />
                        </p>
                        <p className={`${s.passLine} aa-micro`}>{accessPass.holder}</p>
                        <p className={`${s.passLine} aa-micro`}>{accessPass.role}</p>
                        <p className={`${s.passLine} aa-micro`}>{accessPass.level}</p>
                        <p className={`${s.passLine} aa-micro`}>{accessPass.gate}</p>
                        <span className={s.passCode} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${s.cueNote} aa-micro`} data-hud aria-hidden="true">
                  <i />
                  <span style={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
                    <span ref={cueLabelRef}>{revealCue.eventState.label}</span>
                    <span ref={cueActionRef}>{revealCue.eventState.action}</span>
                  </span>
                </div>

                <button
                  ref={hitRef}
                  type="button"
                  className={s.hit}
                  aria-pressed="false"
                  aria-label={revealCue.buttonReveal}
                  data-cursor="reveal"
                  data-cursor-label="Reveal"
                  onClick={toggleReveal}
                  onPointerEnter={onHitEnter}
                  onPointerLeave={onHitLeave}
                />
              </div>
            </div>
          </div>

          <div className={s.haze} aria-hidden="true" />

          <p className={`${s.word} ${s.sarah} ${s.outline}`} data-depth="sarah" data-word="sarah" aria-hidden="true">
            <span className={s.wordClip}>
              <span className={s.wordInner}>{identity.firstName}</span>
            </span>
          </p>
          <p className={`${s.word} ${s.shah} ${s.outline}`} data-depth="shah" data-word="shah" aria-hidden="true">
            <span className={s.wordClip}>
              <span className={s.wordInner}>{identity.lastName}</span>
            </span>
          </p>
        </div>
      </div>

      <div className={s.frame} aria-hidden="true">
        <span className={s.tick} />
        <span className={s.tick} />
        <span className={s.tick} />
        <span className={s.tick} />
        <p className={`${s.frameTag} aa-micro`}>
          <span>Sarah Shah</span>
          <span>{identity.city}</span>
        </p>
        <p className={`${s.frameCaption} aa-micro`}>
          <span>Portfolio 2026</span>
          <span>All access</span>
        </p>
      </div>

      <div className={s.copy}>
        <h2 className="visually-hidden">You&rsquo;re on the list.</h2>
        <p className={`${s.labelL} aa-micro`}>
          <span>
            <i className={s.dot} /> {onTheList.code}
          </span>
          <span>{onTheList.guest}</span>
        </p>
        <p className={`${s.labelR} aa-micro`}>
          <span>{onTheList.date}</span>
          <span>Chapitre 00 — Entrée</span>
        </p>

        <p className={s.listLeft} data-list aria-hidden="true">
          {onTheList.left.map((word) => (
            <span key={word} className={s.line}>
              <span>{word}</span>
            </span>
          ))}
        </p>
        <p className={s.listRight} data-list aria-hidden="true">
          <span className={s.line}>
            <span>{onTheList.rightSans}</span>
          </span>
          <span className={`${s.line} ${s.serif}`}>
            <span>
              {onTheList.rightSerif}
              <em>.</em>
            </span>
          </span>
        </p>

        <div className={s.intro} data-intro>
          <p className={s.welcome}>
            <span className={s.line}>
              <span>{onTheList.welcome}</span>
            </span>
          </p>
          <p className={s.introText}>
            <span className={s.line}>
              <span>{onTheList.intro}</span>
            </span>
          </p>
        </div>
        <p className={`${s.fields} aa-micro`}>{onTheList.fields}</p>
      </div>

      <div className={s.hud}>
        <p className={`${s.hudItem} ${s.hudCity} aa-micro`} data-hud>
          {identity.city} — {identity.edition}
        </p>
        <p className={`${s.hudItem} ${s.hudFields}`} data-hud>
          <strong>{identity.fields.join(" · ")}</strong>
          <span className="aa-micro">{identity.edition}</span>
        </p>
        <p className={`${s.hudItem} ${s.hudCue} aa-micro`} data-hud>
          <span>{identity.scrollCue}</span>
          <span className={s.cueTrack} />
        </p>
        <p className={`${s.hudItem} ${s.hudAvail} aa-micro`} data-hud>
          <span>
            <i className={s.dot} /> {identity.availability}
          </span>
          <span>{identity.city}</span>
        </p>
      </div>
    </section>
  );
}
