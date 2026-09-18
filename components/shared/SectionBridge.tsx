"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import styles from "./SectionBridge.module.css";

/**
 * A short connective strip between two sections: its background color is
 * scroll-scrubbed from the previous section's dominant tone to the next
 * one's, with a thin vertical thread that grows and fades as it crosses,
 * so consecutive sections read as one continuous colour journey rather
 * than a stack of independently-revealed blocks.
 */
export function SectionBridge({ from, to }: { from: string; to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { backgroundColor: to });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { backgroundColor: from });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      tl.to(el, { backgroundColor: to, duration: 1, ease: "none" }, 0)
        .fromTo(
          lineRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.4, ease: "none" },
          0,
        )
        .to(lineRef.current, { opacity: 0, duration: 0.4, ease: "none" }, 0.6);
    }, el);

    return () => ctx.revert();
  }, [from, to, reducedMotion]);

  return (
    <div ref={ref} className={styles.bridge} aria-hidden="true">
      <div ref={lineRef} className={styles.line} />
    </div>
  );
}
