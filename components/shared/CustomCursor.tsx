"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./CustomCursor.module.css";

type CursorState = "default" | "link" | "scroll" | "drag";

/**
 * A contextual cursor rather than decoration for its own sake: it stays a
 * plain dot until it crosses an element carrying data-cursor, then it
 * expands into a small filled ring with that element's label. Any element
 * can opt in with data-cursor="link" | "scroll" | "drag" and an optional
 * data-cursor-label.
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLSpanElement>(null);
  const enabled = useMediaQuery("(pointer: fine)");
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !rootRef.current) return;

    const moveX = gsap.quickTo(rootRef.current, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(rootRef.current, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const handleOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      if (!target) {
        setState("default");
        return;
      }
      const kind = target.dataset.cursor as CursorState;
      setState(kind ?? "default");
      if (ringLabelRef.current) {
        ringLabelRef.current.textContent = target.dataset.cursorLabel ?? "";
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={`${styles.cursor} ${styles.ready}`}
      data-state={state}
      aria-hidden="true"
    >
      <span className={styles.dot} />
      <span className={styles.ring}>
        <span ref={ringLabelRef} />
      </span>
    </div>
  );
}
