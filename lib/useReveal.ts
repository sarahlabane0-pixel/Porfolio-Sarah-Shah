"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";

type RevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  stagger?: number;
};

/**
 * A plain (non-scrubbed, non-pinned) in-view reveal for headings and copy
 * blocks: fades and rises once when the element's top crosses 80% of the
 * viewport, and reverses if it scrolls back out above the fold. Kept
 * deliberately separate from the pinned scroll-scrub pattern used in Recit
 * and the professional track, since those two techniques answered two very
 * different problems.
 */
export function useReveal<T extends HTMLElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const targets = el.hasAttribute("data-reveal-group")
      ? Array.from(el.children)
      : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: options.y ?? 36 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 1,
          delay: options.delay ?? 0,
          stagger: options.stagger ?? 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return ref;
}
