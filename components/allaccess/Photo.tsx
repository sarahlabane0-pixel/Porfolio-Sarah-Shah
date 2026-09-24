import Image from "next/image";
import type { CSSProperties } from "react";
import type { Media } from "@/content/media";

type Props = {
  media: Media;
  /** `sizes` attribute — how wide the image is displayed, per breakpoint. */
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: CSSProperties;
};

/**
 * next/image with the portfolio defaults: quality 90, real intrinsic size,
 * AVIF/WebP negotiated by the optimizer. Exposes `--native` (the file's
 * pixel width) so layouts can cap display width with
 * `min(<wanted>, calc(var(--native) / 1.4))` and never upscale.
 */
export function Photo({ media, sizes, className, priority, style }: Props) {
  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.w}
      height={media.h}
      sizes={sizes}
      quality={90}
      priority={priority}
      className={className}
      style={{ ...style, ["--native" as string]: `${media.w}px` }}
      draggable={false}
    />
  );
}

/** Pixel width a photo can be shown at while staying sharp on a 1.4x screen. */
export const sharpWidth = (m: Media) => Math.round(m.w / 1.4);
