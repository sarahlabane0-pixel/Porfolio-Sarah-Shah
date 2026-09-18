"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/**
 * Returns a stable ref to the Lenis instance rather than the instance
 * itself: Lenis is created in an effect after first paint, so any consumer
 * that captured the instance value at render time (e.g. a click handler
 * closure) would be stuck with a stale null. Reading .current at call time
 * instead always sees the live instance once it exists.
 */
export function useLenisRef(): RefObject<Lenis | null> {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error("useLenisRef must be used within SmoothScrollProvider");
  }
  return ctx;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.remove("lenis");
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    lenisRef.current = instance;
    document.documentElement.classList.add("lenis");

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
