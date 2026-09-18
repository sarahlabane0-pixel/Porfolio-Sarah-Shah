"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
  cursor?: string;
  cursorLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Wraps a link so it drifts toward the pointer within its own bounds on
 * desktop, then eases back on leave. No-ops on touch and when disabled —
 * the disabled state is used for nav items pointing at chapters that don't
 * exist yet in this slice.
 */
export function MagneticLink({
  href,
  children,
  className,
  strength = 0.35,
  disabled = false,
  cursor = "link",
  cursorLabel,
  onClick,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (disabled || event.pointerType !== "mouse" || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const relX = event.clientX - (bounds.left + bounds.width / 2);
    const relY = event.clientY - (bounds.top + bounds.height / 2);
    gsap.to(ref.current, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={className}
      aria-disabled={disabled}
      data-cursor={disabled ? undefined : cursor}
      data-cursor-label={cursorLabel}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
