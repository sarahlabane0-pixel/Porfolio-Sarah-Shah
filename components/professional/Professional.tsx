"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { experiences } from "@/content/experiences";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import styles from "./Professional.module.css";

const ACCENTS: Record<string, { a: string; b: string }> = {
  adecco: { a: "#3a0c17", b: "#e2a6ab" },
  ketil: { a: "#33122a", b: "#e7b8d1" },
  choiseul: { a: "#2b0710", b: "#d9a05c" },
  dce: { a: "#1a1030", b: "#b9b3e8" },
  disney: { a: "#3d1e12", b: "#f0c98f" },
};

export function Professional() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 901px)");

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion || !isDesktop) return;

    let lastIndex = -1;

    const ctx = gsap.context(() => {
      const rooms = gsap.utils.toArray<HTMLElement>(`.${styles.room}`);
      // xPercent is relative to the TRACK's own width (rooms.length * 100vw),
      // not the viewport — shifting by (rooms.length - 1) room-widths is
      // therefore that many /rooms.length of the track's total width.
      const distance = -((100 * (rooms.length - 1)) / rooms.length);

      gsap.to(track, {
        xPercent: distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(rooms.length - 1) * 100}%`,
          scrub: 0.7,
          pin: true,
          onUpdate: (self) => {
            const index = Math.min(rooms.length - 1, Math.round(self.progress * (rooms.length - 1)));
            if (index !== lastIndex) {
              lastIndex = index;
              setCurrent(index);
            }
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, isDesktop]);

  return (
    <section id="parcours" ref={sectionRef} className={styles.section}>
      <div className={styles.head}>
        <p className={styles.kicker}>04 — Parcours</p>
        <h2 className={styles.title}>Univers professionnel</h2>
      </div>

      <div ref={trackRef} className={styles.track}>
        {experiences.map((exp, index) => {
          const accent = ACCENTS[exp.id];
          return (
            <article
              key={exp.id}
              className={styles.room}
              data-reverse={index % 2 === 1}
              style={
                {
                  "--room-accent-a": accent.a,
                  "--room-accent-b": accent.b,
                } as React.CSSProperties
              }
            >
              <div className={styles.textCol}>
                <p className={styles.index}>{String(index + 1).padStart(2, "0")}</p>
                <h3 className={styles.company}>{exp.company}</h3>
                <p className={styles.role}>{exp.role}</p>
                <p className={styles.period}>{exp.period}</p>
                <p className={styles.standfirst}>{exp.standfirst}</p>
                {exp.missions.length > 0 && (
                  <ul className={styles.missions}>
                    {exp.missions.slice(0, 3).map((mission) => (
                      <li key={mission}>{mission}</li>
                    ))}
                  </ul>
                )}
                {exp.tools && (
                  <div className={styles.tools}>
                    {exp.tools.map((tool) => (
                      <span key={tool} className={styles.tool}>
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.mediaCol}>
                <span className={styles.watermark} aria-hidden="true">
                  {exp.company}
                </span>
                <div className={styles.photoA}>
                  {exp.photos[0]?.src ? (
                    <Image src={exp.photos[0].src} alt={exp.photos[0].alt} fill sizes="30vw" />
                  ) : (
                    <PlaceholderImage label={exp.photos[0]?.placeholderLabel ?? "Photo à venir"} />
                  )}
                </div>
                <div className={styles.photoB}>
                  {exp.photos[1]?.src ? (
                    <Image src={exp.photos[1].src} alt={exp.photos[1].alt} fill sizes="22vw" />
                  ) : (
                    <PlaceholderImage label={exp.photos[1]?.placeholderLabel ?? "Photo à venir"} />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.progress} aria-hidden="true">
        {experiences.map((exp, index) => (
          <span key={exp.id} className={styles.dot} data-current={index === current} />
        ))}
      </div>
      <p className={styles.hint}>Scroller pour avancer</p>
    </section>
  );
}
