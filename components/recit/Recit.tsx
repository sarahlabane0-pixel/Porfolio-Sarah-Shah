"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { colors } from "@/lib/colors";
import { recit } from "@/content/copy";
import styles from "./Recit.module.css";

export function Recit() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const lines = linesRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!section || lines.length === 0) return;

    if (reducedMotion) {
      gsap.set(lines, { opacity: 1, filter: "blur(0px)", y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Trigger and pin target must be the same element — pinning a child
      // while triggering off its parent produces a spacer sized to the
      // child's natural content height instead of the scroll duration,
      // which silently caps how far the page can actually scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${lines.length * 11 + 60}%`,
          scrub: 0.6,
          pin: true,
        },
      });

      tl.to(section, {
        backgroundColor: colors.bordeauxDeep,
        duration: lines.length,
        ease: "none",
      });

      lines.forEach((line, index) => {
        tl.to(
          line,
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, ease: "power2.out" },
          index === 0 ? 0 : "-=0.35",
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  let cursor = 0;

  return (
    <section id="recit" ref={sectionRef} className={styles.section}>
      <div className={styles.pinTarget}>
        <p className={styles.eyebrow}>{recit.eyebrow}</p>

        <div className={styles.block}>
          {recit.lines.map((text) => {
            const idx = cursor++;
            return (
              <span
                key={text}
                ref={(el) => {
                  linesRef.current[idx] = el;
                }}
                className={styles.line}
              >
                {text}
              </span>
            );
          })}
        </div>

        <div className={styles.block}>
          {recit.linesSecondary.map((text) => {
            const idx = cursor++;
            return (
              <span
                key={text}
                ref={(el) => {
                  linesRef.current[idx] = el;
                }}
                className={`${styles.line} ${styles["line--secondary"]}`}
              >
                {text}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
