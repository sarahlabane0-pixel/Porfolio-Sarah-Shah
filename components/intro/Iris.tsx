"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { useReducedMotion } from "@/lib/reducedMotion";
import { iris } from "@/content/copy";
import styles from "./Iris.module.css";

const SEEN_KEY = "sarah-shah-iris-seen";

export function Iris({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgFadeRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [done, setDone] = useState(false);
  const lenisRef = useLenisRef();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    lenisRef.current?.stop();

    const release = () => {
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
      onComplete();
    };

    if (
      reducedMotion ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem(SEEN_KEY) === "1")
    ) {
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          release();
        },
      });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
      sessionStorage.setItem(SEEN_KEY, "1");
      return () => {
        tl.kill();
      };
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setDone(true);
        release();
      },
    });

    gsap.set(clipRef.current, { clipPath: "circle(0vmax at 50% 47%)" });
    gsap.set(imageRef.current, { filter: "blur(18px)" });
    gsap.set(skipRef.current, { opacity: 0 });

    tl.to(bgFadeRef.current, { opacity: 1, duration: 1.1 }, 0)
      .to(
        clipRef.current,
        { clipPath: "circle(3.2vmax at 50% 47%)", duration: 1, ease: "power3.out" },
        0.1,
      )
      .to(imageRef.current, { filter: "blur(5px)", duration: 1 }, 0.1)
      .to(skipRef.current, { opacity: 1, duration: 0.6 }, 0.6)
      .to({}, { duration: 0.45 })
      .to(
        clipRef.current,
        { clipPath: "circle(130vmax at 50% 47%)", duration: 1.7, ease: "power4.inOut" },
        ">",
      )
      .to(imageRef.current, { filter: "blur(0px)", duration: 1.3, ease: "power2.out" }, "<")
      .to({}, { duration: 0.35 })
      .to(skipRef.current, { opacity: 0, duration: 0.3 }, "<")
      .to(overlayRef.current, { opacity: 0, duration: 0.85, ease: "power2.inOut" });

    sessionStorage.setItem(SEEN_KEY, "1");

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    document.documentElement.style.overflow = "";
    lenisRef.current?.start();
    gsap.killTweensOf([overlayRef.current, clipRef.current, imageRef.current]);
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        setDone(true);
        onComplete();
      },
    });
  };

  if (done) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} role="presentation">
      <div ref={bgFadeRef} className={styles.bgFade} />
      <div ref={clipRef} className={styles.imageClip}>
        <Image
          ref={imageRef}
          src="/assets/portraits/sarah-iris.jpg"
          alt={iris.alt}
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <button ref={skipRef} type="button" className={styles.skip} onClick={skip}>
        Passer l&rsquo;introduction
      </button>
    </div>
  );
}
