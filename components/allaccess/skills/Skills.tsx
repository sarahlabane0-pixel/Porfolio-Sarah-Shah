"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { skills } from "@/content/allaccess";
import s from "./Skills.module.css";

type Kind = "making" | "human";
type Mode = "all" | Kind;

type Word = {
  label: string;
  kind: Kind;
  // Unit-sphere direction; the shell radius depends on kind and mode.
  dir: [number, number, number];
};

// Fibonacci points: an even spread without clumps. MAKING sits on the outer
// shell, HUMAN forms the core — the qualities are what the craft orbits.
function fib(n: number, offset: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i + offset;
    out.push([Math.cos(th) * r, y * 0.82, Math.sin(th) * r]);
  }
  return out;
}

const WORDS: Word[] = [
  ...fib(skills.making.length, 0.3).map((dir, i) => ({ label: skills.making[i], kind: "making" as const, dir })),
  ...fib(skills.human.length, 1.9).map((dir, i) => ({ label: skills.human[i], kind: "human" as const, dir })),
];

// Shell radius (× R) and brightness per kind, per mode.
const SHELL: Record<Mode, Record<Kind, { r: number; o: number }>> = {
  all: { making: { r: 1, o: 1 }, human: { r: 0.6, o: 1 } },
  making: { making: { r: 0.92, o: 1 }, human: { r: 0.3, o: 0.14 } },
  human: { making: { r: 1.45, o: 0.12 }, human: { r: 0.86, o: 1 } },
};

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("all");
  const modeRef = useRef<Mode>("all");
  const focusRef = useRef<number | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const el = root.current;
    const field = fieldRef.current;
    if (!el || !field) return;
    const nodes = Array.from(field.querySelectorAll<HTMLElement>("[data-word]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Per-word animated state.
    const st = WORDS.map(() => ({ r: 1, o: 1, focus: 0, ox: 0, oy: 0, blur: -1, sx: 0, sy: 0 }));
    WORDS.forEach((w, i) => {
      st[i].r = SHELL.all[w.kind].r;
    });

    let yaw = 0.4;
    const pitch = -0.12;
    const spin = 0.09; // rad/s, the idle drift
    let dragV = 0;
    const tilt = { x: 0, y: 0 };
    const pointer = { x: -9999, y: -9999, inside: false };
    const cam = { enter: reduce ? 1 : 0 };

    // Scroll: the camera travels from outside the cloud into it.
    const enterTween = reduce
      ? null
      : gsap.to(cam, {
          enter: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 10%", scrub: 1 },
        });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    const render = (dt: number) => {
      const rect = field.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const wide = W >= 1024;
      const R = Math.min(W * (wide ? 0.27 : 0.42), H * (wide ? 0.34 : 0.28), 480);
      // On wide screens the cloud sits right of the headline.
      const cx = W * (wide ? 0.6 : 0.5);
      const cy = H * (wide ? 0.53 : 0.56);
      const m = modeRef.current;
      const focused = focusRef.current;
      const k = 1 - Math.pow(1 - 0.08, dt / 16.67);

      // Camera distance: far (compact cloud) → close (words around you).
      const D = R * (5 - cam.enter * 2.2);
      const F = R * 2.8;

      const cyaw = Math.cos(yaw + tilt.x);
      const syaw = Math.sin(yaw + tilt.x);
      const cp = Math.cos(pitch + tilt.y);
      const sp = Math.sin(pitch + tilt.y);

      // Focused word's screen position, for neighbours to make room.
      const fx = focused !== null ? st[focused].sx : 0;
      const fy = focused !== null ? st[focused].sy : 0;

      WORDS.forEach((w, i) => {
        const S = st[i];
        const shell = SHELL[m][w.kind];
        S.r += (shell.r - S.r) * k * 0.7;
        S.o += (shell.o - S.o) * k;
        S.focus += ((focused === i ? 1 : 0) - S.focus) * k * 1.4;

        const [dx, dy, dz] = w.dir;
        let x = dx * S.r * R * (wide ? 1.55 : 1.05);
        let y = dy * S.r * R * 0.9;
        let z = dz * S.r * R;
        // yaw, then pitch
        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        x = x1;
        y = y1;
        z = z2;

        const d = Math.max(D - z, R * 0.35);
        const p = F / d;
        let sx = cx + x * p;
        let sy = cy + y * p;

        // Repulsion: from the cursor, and from the focused word.
        let tx = 0;
        let ty = 0;
        const push = (px: number, py: number, radius: number, amount: number) => {
          const vx = sx - px;
          const vy = sy - py;
          const dist = Math.hypot(vx, vy) || 1;
          if (dist < radius) {
            const f = (1 - dist / radius) ** 2 * amount;
            tx += (vx / dist) * f;
            ty += (vy / dist) * f;
          }
        };
        if (pointer.inside && focused === null) push(pointer.x, pointer.y, 170, 34);
        if (focused !== null && focused !== i) push(fx, fy, 260, 90);
        S.ox += (tx - S.ox) * k;
        S.oy += (ty - S.oy) * k;
        sx += S.ox;
        sy += S.oy;
        S.sx = sx;
        S.sy = sy;

        // Depth cues: nearer = larger, brighter, sharper.
        const near = gsap.utils.clamp(0, 1, (z / (S.r * R || 1) + 1) / 2);
        const behind = D - z < R * 0.5 ? gsap.utils.clamp(0, 1, (D - z - R * 0.35) / (R * 0.15)) : 1;
        const scale = Math.min(p * (0.82 + near * 0.18), 1.4) * (1 + S.focus * 0.5);
        const dim = focused !== null && focused !== i ? 0.35 : 1;
        const base = (0.34 + near * 0.66) * S.o * behind * dim;
        const opacity = base + S.focus * (1 - base);
        const blur = Math.round((1 - near) * (1 - S.focus) * 2.6 * (S.o < 0.5 ? 1.8 : 1));

        const n = nodes[i];
        n.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        n.style.opacity = opacity.toFixed(3);
        n.style.zIndex = String(Math.round(1000 + z + S.focus * 2000));
        if (blur !== S.blur) {
          S.blur = blur;
          n.style.filter = blur > 0 ? `blur(${blur}px)` : "";
        }
      });
    };

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(now - last, 64);
      last = now;
      if (!visible) return;
      if (!reduce) {
        const slow = focusRef.current !== null ? 0.15 : 1;
        yaw += (spin * slow * dt) / 1000 + dragV;
        dragV *= Math.pow(0.92, dt / 16.67);
      }
      render(dt);
    };
    gsap.ticker.add(tick);
    render(16);

    // Pointer: tilt toward the cursor, drag to spin (touch included).
    let dragging = false;
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      const r = field.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
      if (e.pointerType === "mouse" && !reduce) {
        gsap.to(tilt, { x: ((pointer.x / r.width) * 2 - 1) * 0.35, y: -((pointer.y / r.height) * 2 - 1) * 0.22, duration: 1.4, ease: "power2.out", overwrite: true });
      }
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        dragV = dx * 0.0035;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      pointer.inside = false;
      gsap.to(tilt, { x: 0, y: 0, duration: 1.6, ease: "power2.out", overwrite: true });
    };
    field.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    field.addEventListener("pointerleave", onLeave);

    const resize = () => render(16);
    window.addEventListener("resize", resize);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      enterTween?.scrollTrigger?.kill();
      enterTween?.kill();
      field.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      field.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Header reveal.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el.querySelectorAll(`.${s.line} > span`),
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 60%" } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const focus = (i: number | null) => {
    focusRef.current = i;
    const field = fieldRef.current;
    if (!field) return;
    field.dataset.focus = i === null ? "" : String(i);
    field.querySelectorAll<HTMLElement>("[data-word]").forEach((n, k) => {
      if (k === i) n.setAttribute("data-on", "");
      else n.removeAttribute("data-on");
    });
  };

  return (
    <section ref={root} id="skills" className={s.skills} data-chapter="02" data-theme-zone="dark" aria-labelledby="skills-title">
      <header className={s.head}>
        <p className={`${s.kicker} aa-micro`}>
          <span>02 — {skills.kicker}</span>
        </p>
        <h2 id="skills-title" className={s.title}>
          {skills.headline.map((l, i) => (
            <span key={l} className={s.line}>
              <span className={i ? s.serif : undefined}>{l}</span>
            </span>
          ))}
        </h2>
        <p className={s.text}>{skills.text}</p>
      </header>

      <div ref={fieldRef} className={s.field} data-mode={mode} data-focus="">
        <ul className={s.words} aria-label="Compétences">
          {WORDS.map((w, i) => (
            <li key={w.label}>
              <button
                type="button"
                data-word
                data-kind={w.kind}
                className={`${s.word} ${w.kind === "human" ? s.human : s.making}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && focus(i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && focus(null)}
                onFocus={() => focus(i)}
                onBlur={() => focus(null)}
                onClick={() => focus(focusRef.current === i ? null : i)}
                data-cursor="skill"
                data-cursor-label={w.kind === "human" ? "Human" : "Making"}
              >
                <span className={s.wordText}>{w.label}</span>
                <span className={`${s.tag} aa-micro`}>
                  <i aria-hidden="true" />
                  {w.kind === "human" ? "Human" : "Making"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.controls}>
        <div className={s.modes} role="group" aria-label="Filtrer les compétences">
          {(Object.keys(skills.modes) as Mode[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={mode === k}
              className={`${s.mode} aa-micro`}
              onClick={() => setMode(k)}
            >
              {skills.modes[k]}
            </button>
          ))}
        </div>
        <p className={`${s.hint} aa-micro`}>
          <span className={s.hintFine}>{skills.hint}</span>
          <span className={s.hintTouch}>{skills.hintTouch}</span>
        </p>
      </div>
    </section>
  );
}
