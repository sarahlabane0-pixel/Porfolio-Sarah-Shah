"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useReveal } from "@/lib/useReveal";
import { danse } from "@/content/copy";
import styles from "./Dance.module.css";

export function Dance() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useReveal<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  // Letters lean into the direction of scroll, proportional to velocity —
  // movement literally driving the type, echoing the section's own subject.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || reducedMotion) return;

    const setSkew = gsap.quickTo(stage, "skewY", { duration: 0.4, ease: "power3.out" });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const clamped = gsap.utils.clamp(-6, 6, velocity / 400);
        setSkew(clamped);
      },
      onLeave: () => setSkew(0),
      onLeaveBack: () => setSkew(0),
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="danse" ref={sectionRef} className={styles.section}>
      <div ref={stageRef} className={styles.stage}>
        <span className={`${styles.word} ${styles["word--first"]}`}>Mouvement</span>
        <div className={styles.photoWrap}>
          <Image
            src="/assets/danse/mouvement-01.jpg"
            alt="Sarah en mouvement"
            width={548}
            height={731}
            sizes="(max-width: 780px) 60vw, 30vw"
          />
        </div>
        <span className={`${styles.word} ${styles["word--last"]}`}>Rythme</span>
      </div>

      <div ref={textRef} className={styles.text}>
        <p className={styles.kicker}>{danse.kicker}</p>
        {danse.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
