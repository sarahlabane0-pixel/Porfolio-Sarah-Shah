"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query via useSyncExternalStore rather than an
 * effect + setState pair, since a media query is genuinely an external
 * store: this avoids the extra synchronous re-render on mount and stays
 * correct if the OS-level preference flips while the tab is open.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
