"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import s from "./AccessCursor.module.css";

/**
 * Dot + lagging ring. Only on fine pointers without reduced motion; the
 * native cursor is hidden only once this has actually mounted. Any element
 * with `data-cursor` turns the ring coral and shows its `data-cursor-label`.
 */
export function AccessCursor() {
  const root = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const html = document.documentElement;
    html.dataset.aaCursor = "on";
    el.dataset.active = "on";

    const dot = el.querySelector<HTMLElement>(`.${s.dot}`)!;
    const ring = el.querySelector<HTMLElement>(`.${s.ring}`)!;
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    let target: HTMLElement | null = null;
    const sync = () => {
      const label = target?.dataset.cursorLabel ?? "";
      el.dataset.state = target ? "hot" : "idle";
      if (labelRef.current) labelRef.current.textContent = label;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.dataset.visible = "on";
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const next = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button") ?? null;
      if (next === target) return;
      target = next;
      sync();
    };
    const onDown = () => {
      el.dataset.down = "on";
    };
    const onUp = () => {
      el.dataset.down = "off";
      // The label can change on click (Reveal ↔ Restore).
      requestAnimationFrame(sync);
    };
    const onLeave = () => {
      el.dataset.visible = "off";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      delete html.dataset.aaCursor;
      el.dataset.active = "off";
    };
  }, []);

  return (
    <div ref={root} className={s.cursor} aria-hidden="true" data-active="off" data-visible="off" data-state="idle">
      <span className={s.ring}>
        <span className={s.ringShape} />
        <span ref={labelRef} className={`${s.label} aa-micro`} />
      </span>
      <span className={s.dot} />
    </div>
  );
}
