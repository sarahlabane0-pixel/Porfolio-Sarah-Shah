"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { hero } from "@/content/copy";
import styles from "./Hero.module.css";

export function Hero({ play }: { play: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const lastWordRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Entrance, sequenced right after the iris hands off.
  useEffect(() => {
    if (!play) return;

    if (reducedMotion) {
      gsap.set(
        [firstWordRef.current, portraitRef.current, lastWordRef.current, metaRef.current, scrollCueRef.current],
        { opacity: 1, x: 0, y: 0, scale: 1 },
      );
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      firstWordRef.current,
      { opacity: 0, y: 46, scale: 1.03 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1 },
      0.05,
    )
      .fromTo(
        portraitRef.current,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1.3, ease: "power2.out" },
        0.3,
      )
      .fromTo(
        lastWordRef.current,
        { opacity: 0, y: 46, scale: 1.03 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1 },
        0.55,
      )
      .fromTo(
        metaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.1,
      )
      .fromTo(
        scrollCueRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.25,
      );

    return () => {
      tl.kill();
    };
  }, [play, reducedMotion]);

  // Subtle cursor-driven depth: three layers drift at different rates.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const moveFirst = gsap.quickTo(firstWordRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const moveFirstY = gsap.quickTo(firstWordRef.current, "y", { duration: 0.9, ease: "power3.out" });
    const movePortrait = gsap.quickTo(portraitRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const movePortraitY = gsap.quickTo(portraitRef.current, "y", { duration: 0.7, ease: "power3.out" });
    const moveLast = gsap.quickTo(lastWordRef.current, "x", { duration: 1.05, ease: "power3.out" });
    const moveLastY = gsap.quickTo(lastWordRef.current, "y", { duration: 1.05, ease: "power3.out" });

    const handle = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
      moveFirst(relX * -14);
      moveFirstY(relY * -8);
      movePortrait(relX * 10);
      movePortraitY(relY * 6);
      moveLast(relX * 18);
      moveLastY(relY * 10);
    };

    section.addEventListener("pointermove", handle);
    return () => section.removeEventListener("pointermove", handle);
  }, [reducedMotion]);

  // Scroll cue: a dot travelling down the track, looping.
  useEffect(() => {
    if (reducedMotion || !scrollCueRef.current) return;
    const dot = scrollCueRef.current.querySelector(`.${styles.scrollDot}`);
    if (!dot) return;
    const tween = gsap.to(dot, {
      y: 48,
      duration: 1.6,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <section id="hero" ref={sectionRef} className={styles.section}>
      <div className={styles.stage}>
        <span ref={firstWordRef} className={`${styles.word} ${styles["word--first"]}`}>
          {hero.firstName}
        </span>

        <div ref={portraitRef} className={styles.portraitWrap}>
          <Image
            src="/assets/portraits/sarah-standing.png"
            alt="Sarah Shah"
            width={653}
            height={1452}
            priority
            className={styles.portrait}
          />
        </div>

        <span ref={lastWordRef} className={`${styles.word} ${styles["word--last"]}`}>
          {hero.lastName}
        </span>
      </div>

      <div ref={metaRef} className={styles.meta}>
        {hero.meta.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div ref={scrollCueRef} className={styles.scrollCue}>
        <span className={styles.scrollLabel}>{hero.scrollLabel}</span>
        <div className={styles.scrollTrack}>
          <span className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
