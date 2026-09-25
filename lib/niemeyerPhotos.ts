import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Media } from "@/content/media";

const DIR = path.join(process.cwd(), "public/assets/places/niemeyer");

// Captions from the file name (niemeyer-02-coupole.webp → "Sous la coupole").
// Only names what the photo shows; unknown slugs get no caption.
const CAPTIONS: Record<string, string> = {
  foyer: "Le foyer",
  coupole: "Sous la coupole",
  fauteuil: "Au plus près",
  salon: "Sous la lumière",
};

export type NiemeyerPhoto = Media & { slug: string; caption?: string };
const EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Sarah's Espace Niemeyer photographs, read from the folder at build time
 * with their real pixel sizes. Empty until she adds them — the Spaces
 * chapter then shows explicit "à fournir" frames, never a stand-in.
 */
export async function loadNiemeyerPhotos(): Promise<NiemeyerPhoto[]> {
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => EXT.test(f)).sort();
  } catch {
    return [];
  }
  const out: NiemeyerPhoto[] = [];
  for (const [i, f] of files.entries()) {
    try {
      const meta = await sharp(path.join(DIR, f)).metadata();
      if (!meta.width || !meta.height) continue;
      // EXIF-rotated phone photos report swapped dimensions.
      const rotated = (meta.orientation ?? 1) >= 5;
      const slug = f.replace(EXT, "").replace(/^niemeyer-\d+-?/i, "").toLowerCase();
      const caption = CAPTIONS[slug];
      out.push({
        slug,
        caption,
        src: `/assets/places/niemeyer/${encodeURIComponent(f)}`,
        w: rotated ? meta.height : meta.width,
        h: rotated ? meta.width : meta.height,
        alt: caption ? `Espace Niemeyer, Paris — ${caption.toLowerCase()}` : `Espace Niemeyer, Paris — photographie ${i + 1}`,
      });
    } catch {
      // Unreadable file: skip it rather than break the build.
    }
  }
  return out;
}
