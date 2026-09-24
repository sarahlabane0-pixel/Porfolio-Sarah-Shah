"use client";

export type HeroAssets = {
  cutout: HTMLImageElement;
  depth: HTMLImageElement | null;
};

export const HERO_SRC = {
  cutout: "/assets/hero/sarah-cutout.webp",
  cutoutSmall: "/assets/hero/sarah-cutout-sm.webp",
  depth: "/assets/hero/sarah-depth.png",
};

let pending: Promise<HeroAssets> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      img.decode().then(() => resolve(img), () => resolve(img));
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/**
 * Loads only what the first screen needs (the portrait cutout, its depth
 * map on desktop, and the display fonts). Shared between the loader — whose
 * counter reflects these real loads — and the WebGL portrait, so nothing is
 * fetched twice. Memoised: StrictMode's double effect run reuses the promise.
 */
export function loadHeroAssets(
  withDepth: boolean,
  onProgress?: (ratio: number) => void,
): Promise<HeroAssets> {
  if (pending) {
    pending.then(() => onProgress?.(1));
    return pending;
  }

  const jobs: Promise<unknown>[] = [];
  let done = 0;
  const tick = () => {
    done += 1;
    onProgress?.(done / jobs.length);
  };
  const track = <T,>(p: Promise<T>) => {
    const wrapped = p.finally(tick);
    jobs.push(wrapped);
    return wrapped;
  };

  const cutout = track(loadImage(withDepth ? HERO_SRC.cutout : HERO_SRC.cutoutSmall));
  const depth = withDepth
    ? track(loadImage(HERO_SRC.depth).catch(() => null))
    : Promise.resolve(null);
  track(document.fonts?.ready ?? Promise.resolve());

  pending = Promise.all([cutout, depth]).then(([c, d]) => ({ cutout: c, depth: d }));
  return pending;
}
