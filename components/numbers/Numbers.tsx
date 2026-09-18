"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { stats } from "@/content/numbers";
import styles from "./Numbers.module.css";

function Stat({ stat }: { stat: (typeof stats)[number] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const numericTarget = Number(stat.value);
  const isNumeric = stat.verified && Number.isFinite(numericTarget);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reducedMotion) {
      if (valueRef.current) valueRef.current.textContent = stat.value;
      gsap.set([labelRef.current, toolsRef.current], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 65%", toggleActions: "play none none reverse" },
      });

      if (isNumeric && valueRef.current) {
        const counter = { n: 0 };
        tl.to(counter, {
          n: numericTarget,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            if (valueRef.current) valueRef.current.textContent = String(Math.round(counter.n));
          },
        });
      } else if (valueRef.current) {
        tl.fromTo(valueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      }

      tl.to(
        [labelRef.current, toolsRef.current],
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.1 },
        "-=0.3",
      );
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={styles.stat}>
      <p ref={valueRef} className={styles.value} data-verified={stat.verified}>
        {isNumeric ? "0" : stat.value}
      </p>
      {stat.tools && (
        <div ref={toolsRef} className={styles.tools}>
          {stat.tools.map((tool) => (
            <span key={tool} className={styles.tool}>
              {tool}
            </span>
          ))}
        </div>
      )}
      <p ref={labelRef} className={styles.label}>
        {stat.label}
      </p>
    </div>
  );
}

export function Numbers() {
  return (
    <section className={styles.section} aria-label="Quelques chiffres">
      {stats.map((stat) => (
        <Stat key={stat.label} stat={stat} />
      ))}
    </section>
  );
}
