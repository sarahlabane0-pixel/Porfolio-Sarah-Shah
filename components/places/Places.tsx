"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReveal } from "@/lib/useReveal";
import { niemeyer, curiosity } from "@/content/places";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import styles from "./Places.module.css";

export function Places() {
  const niemeyerRef = useReveal<HTMLDivElement>({ stagger: 0.12 });
  const curiosityHeadRef = useReveal<HTMLDivElement>();
  const spotlightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (!fine || !spotlightRef.current || !canvasRef.current) return;
    const spotlight = spotlightRef.current;
    const canvas = canvasRef.current;

    const moveX = gsap.quickTo(spotlight, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(spotlight, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const handleEnter = () => gsap.to(spotlight, { opacity: 1, duration: 0.3 });
    const handleLeave = () => gsap.to(spotlight, { opacity: 0, duration: 0.3 });

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerenter", handleEnter);
    canvas.addEventListener("pointerleave", handleLeave);
    return () => {
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerenter", handleEnter);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [fine]);

  return (
    <section id="lieux" className={styles.section}>
      <div className={styles.niemeyer}>
        <span className={styles.arc} aria-hidden="true" />
        <div ref={niemeyerRef} className={styles.niemeyerGrid} data-reveal-group>
          <div>
            <p className={styles.kicker}>{niemeyer.kicker}</p>
            <h2 className={styles.title}>{niemeyer.title}</h2>
            {niemeyer.paragraphs.map((p) => (
              <p key={p} className={styles.paragraph}>
                {p}
              </p>
            ))}
            <p className={styles.note}>{niemeyer.placeholderNote}</p>
          </div>
          <div className={styles.blobs}>
            <div className={styles.blob}>
              <PlaceholderImage label="Photo à venir — Espace Niemeyer" />
            </div>
            <div className={styles.blob}>
              <PlaceholderImage label="Photo à venir — Espace Niemeyer" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.curiosity}>
        {fine && <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" />}

        <div ref={curiosityHeadRef} className={styles.curiosityHead}>
          <p className={styles.kicker}>{curiosity.kicker}</p>
          <h2 className={styles.title}>{curiosity.title}</h2>
          <p className={styles.paragraph}>{curiosity.intro}</p>
        </div>

        <div ref={canvasRef} className={styles.canvas}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.tile} tabIndex={0}>
              <PlaceholderImage label="Photo à venir" />
            </div>
          ))}
        </div>

        <div className={styles.notes}>
          {curiosity.notes.map((note) => (
            <div key={note.title}>
              <h3 className={styles.noteTitle}>{note.title}</h3>
              <p className={styles.noteText}>{note.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.note}>{curiosity.placeholderNote}</p>
      </div>
    </section>
  );
}
