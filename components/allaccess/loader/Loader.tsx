"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { loadHeroAssets } from "@/lib/heroAssets";
import { accessPass, identity } from "@/content/allaccess";
import s from "./Loader.module.css";

// The counter never finishes faster than this, so the "access check" reads
// as a beat rather than a flash — but it still tracks the real loads.
const MIN_SECONDS = 1.1;

/**
 * Credential check before the doors open. The counter follows the real
 * loading of what the first screen needs (portrait, depth map, fonts);
 * the opening is an abstract split of the night panel, not a logo reveal.
 * `onOpen` fires as the split starts so the hero's entry plays underneath.
 */
export function Loader({ onOpen }: { onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useLenisRef();
  const onOpenRef = useRef(onOpen);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;

    // Lock scroll while the check runs. Lenis is created in the provider's
    // effect, which runs after this one — so stop it on the next frame.
    html.style.overflow = "hidden";
    let locked: typeof lenisRef.current = null;
    const raf = requestAnimationFrame(() => {
      locked = lenisRef.current;
      locked?.stop();
    });

    const shown = { value: 0 };
    let real = 0;
    let finished = false;
    const started = performance.now();

    const render = () => {
      if (countRef.current) countRef.current.textContent = String(Math.round(shown.value)).padStart(3, "0");
      el.style.setProperty("--p", (shown.value / 100).toFixed(3));
    };

    // Displayed value eases toward min(real progress, time floor).
    const tick = () => {
      const floor = Math.min(1, (performance.now() - started) / (MIN_SECONDS * 1000));
      const goal = Math.min(real, floor) * 100;
      shown.value += (goal - shown.value) * (1 - Math.pow(0.88, gsap.ticker.deltaRatio()));
      if (goal === 100 && shown.value > 99.5) shown.value = 100;
      render();
      if (shown.value === 100 && !finished) {
        finished = true;
        gsap.ticker.remove(tick);
        open();
      }
    };

    const release = () => {
      html.style.overflow = "";
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
      lenisRef.current?.start();
    };

    const open = () => {
      if (statusRef.current) statusRef.current.textContent = "Access granted";
      el.dataset.granted = "true";

      if (reduce) {
        onOpenRef.current();
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.2,
          onComplete: () => {
            release();
            setGone(true);
          },
        });
        return;
      }

      const tl = gsap.timeline({
        delay: 0.38,
        onComplete: () => {
          release();
          setGone(true);
        },
      });
      tl.to(el.querySelectorAll(`.${s.meta}, .${s.count}, .${s.scan}`), { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
        .add(() => onOpenRef.current(), 0.18)
        // Split along the horizon: two night panels part vertically with a
        // slight skew, the coral seam flares and dies.
        .to(el.querySelector(`.${s.seam}`), { scaleX: 1, duration: 0.5, ease: "expo.out" }, 0.05)
        .to(el.querySelector(`.${s.seam}`), { autoAlpha: 0, duration: 0.4 }, 0.55)
        .to(el.querySelector(`.${s.top}`), { yPercent: -100, skewY: -2.5, duration: 1.25, ease: "expo.inOut" }, 0.3)
        .to(el.querySelector(`.${s.bottom}`), { yPercent: 100, skewY: 2.5, duration: 1.25, ease: "expo.inOut" }, 0.3);
    };

    gsap.ticker.add(tick);
    loadHeroAssets(wide, (r) => {
      real = Math.max(real, r);
    })
      .catch(() => undefined)
      .finally(() => {
        real = 1;
      });

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      html.style.overflow = "";
      locked?.start();
    };
  }, [lenisRef]);

  if (gone) return null;

  return (
    <div ref={root} className={s.loader} role="status" aria-live="polite">
      <div className={`${s.panel} ${s.top}`} />
      <div className={`${s.panel} ${s.bottom}`} />
      <span className={s.seam} />

      <div className={`${s.meta} ${s.metaTop} aa-micro`}>
        <span>
          {identity.firstName} {identity.lastName}
        </span>
        <span>{accessPass.title}</span>
      </div>

      <div className={s.scan} aria-hidden="true" />

      <p className={s.count} aria-hidden="true">
        <span ref={countRef}>000</span>
      </p>

      <div className={`${s.meta} ${s.metaBottom} aa-micro`}>
        <span ref={statusRef}>Checking credentials</span>
        <span>
          {identity.city} — {identity.edition}
        </span>
      </div>
    </div>
  );
}
