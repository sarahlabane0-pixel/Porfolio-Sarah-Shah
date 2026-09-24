import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Media } from "@/content/media";

const DIR = path.join(process.cwd(), "public/assets/places/niemeyer");
const EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Sarah's Espace Niemeyer photographs, read from the folder at build time
 * with their real pixel sizes. Empty until she adds them — the Spaces
 * chapter then shows explicit "à fournir" frames, never a stand-in.
 */
export async function loadNiemeyerPhotos(): Promise<Media[]> {
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => EXT.test(f)).sort();
  } catch {
    return [];
  }
  const out: Media[] = [];
  for (const [i, f] of files.entries()) {
    try {
      const meta = await sharp(path.join(DIR, f)).metadata();
      if (!meta.width || !meta.height) continue;
      // EXIF-rotated phone photos report swapped dimensions.
      const rotated = (meta.orientation ?? 1) >= 5;
      out.push({
        src: `/assets/places/niemeyer/${encodeURIComponent(f)}`,
        w: rotated ? meta.height : meta.width,
        h: rotated ? meta.width : meta.height,
        alt: `Espace Niemeyer, Paris — photographie ${i + 1}`,
      });
    } catch {
      // Unreadable file: skip it rather than break the build.
    }
  }
  return out;
}
