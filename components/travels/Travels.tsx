"use client";

import type { CSSProperties } from "react";
import { travelChapters, type TravelChapter } from "@/content/travels";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { useReveal } from "@/lib/useReveal";
import {
  ZelligeOrnament,
  NewYorkOrnament,
  HoustonOrnament,
  VeniceOrnament,
  PalmaOrnament,
  AlgiersOrnament,
  DesertOrnament,
} from "./Ornaments";
import styles from "./Travels.module.css";
import ornamentStyles from "./Ornaments.module.css";

type Theme = { a: string; b: string; accent: string; fg?: string };

const THEMES: Record<TravelChapter["theme"], Theme> = {
  marrakech: { a: "#5a2a14", b: "#2b1209", accent: "#d98b3f" },
  "new-york": { a: "#14161c", b: "#0c0a0b", accent: "#9fb4c7" },
  houston: { a: "#10162e", b: "#0c0a0b", accent: "#7dd3e0" },
  venice: { a: "#1c2f30", b: "#0c0a0b", accent: "#8fbfc2" },
  palma: { a: "#f5efe4", b: "#e9dcc3", accent: "#4a0e1f", fg: "#2b0710" },
  algeria: { a: "#1c2430", b: "#0c0a0b", accent: "#cbd3da" },
};

function themeVars(theme: Theme): CSSProperties {
  return {
    "--chapter-bg-a": theme.a,
    "--chapter-bg-b": theme.b,
    "--chapter-accent": theme.accent,
    ...(theme.fg ? { "--chapter-fg": theme.fg } : {}),
  } as CSSProperties;
}

function Ornament({ theme }: { theme: TravelChapter["theme"] }) {
  switch (theme) {
    case "marrakech":
      return <ZelligeOrnament />;
    case "new-york":
      return <NewYorkOrnament />;
    case "houston":
      return <HoustonOrnament />;
    case "venice":
      return <VeniceOrnament label="Venise" />;
    case "palma":
      return <PalmaOrnament />;
    default:
      return null;
  }
}

function Chapter({ chapter, index }: { chapter: TravelChapter; index: number }) {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1 });
  const theme = THEMES[chapter.theme];

  return (
    <section
      className={styles.chapter}
      style={themeVars(theme)}
      data-align={index % 2 === 1 ? "text-right" : undefined}
    >
      <div ref={ref} className={styles.chapterInner} data-reveal-group>
        <div>
          <p className={styles.destKicker}>{chapter.kicker}</p>
          <h3 className={styles.destName}>{chapter.name}</h3>
          <div className={styles.narrative}>
            {chapter.narrative.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {chapter.visitedPlaces && (
            <>
              <span className={styles.chipsLabel}>Vécu</span>
              <div className={styles.chips}>
                {chapter.visitedPlaces.map((place) => (
                  <span key={place} className={styles.chip}>
                    {place}
                  </span>
                ))}
              </div>
            </>
          )}

          {chapter.referenceOnly && (
            <>
              <span className={styles.chipsLabel}>Références visuelles</span>
              <div className={styles.chips}>
                {chapter.referenceOnly.map((place) => (
                  <span key={place} className={styles.chip} data-kind="reference">
                    {place}
                  </span>
                ))}
              </div>
            </>
          )}

          {chapter.placeholderNote && <p className={styles.placeholderNote}>{chapter.placeholderNote}</p>}
        </div>

        <div className={styles.media}>
          <div className={styles.ornament}>
            <Ornament theme={chapter.theme} />
          </div>
          <PlaceholderImage label={`Photo à venir — ${chapter.name}`} />
        </div>
      </div>
    </section>
  );
}

function AlgeriaBeat({
  kicker,
  title,
  text,
  theme,
  ornament,
  sparse,
}: {
  kicker: string;
  title: string;
  text: string;
  theme: Theme;
  ornament: React.ReactNode;
  sparse?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className={styles.chapter} style={themeVars(theme)}>
      <div className={styles.ornament} style={{ opacity: sparse ? 0.35 : 0.5 }}>
        {ornament}
      </div>
      <div
        ref={ref}
        style={{
          position: "relative",
          zIndex: 2,
          margin: "0 auto",
          maxWidth: sparse ? "34ch" : "56ch",
          textAlign: "center",
          letterSpacing: sparse ? "0.08em" : undefined,
        }}
      >
        <p className={styles.destKicker}>{kicker}</p>
        <h3 className={styles.destName} style={{ fontSize: sparse ? "clamp(2.4rem, 6vw, 4.5rem)" : undefined }}>
          {title}
        </h3>
        <p style={{ opacity: 0.86, fontSize: "var(--size-body)" }}>{text}</p>
      </div>
    </section>
  );
}

export function Travels() {
  const introRef = useReveal<HTMLDivElement>();
  const nonAlgeria = travelChapters.filter((c) => c.theme !== "algeria");
  const algeria = travelChapters.find((c) => c.theme === "algeria")!;

  return (
    <section id="voyages" className={styles.section}>
      <div className={styles.intro}>
        <div ref={introRef}>
          <p className={styles.kicker}>03 bis — Voyages</p>
          <h2 className={styles.introTitle}>Changer de décor</h2>
          <p className={styles.introText}>
            Voyager est une source d&rsquo;inspiration, une aventure qui nourrit ma créativité. Chaque
            destination garde son monde propre, ses couleurs, son rythme.
          </p>
        </div>
      </div>

      {nonAlgeria.slice(0, 1).map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} index={i} />
      ))}

      {/* Algeria — three atmospheres inside one chapter, not one generic destination */}
      <AlgeriaBeat
        kicker="Algérie — Alger"
        title="Alger"
        text={algeria.narrative[0]}
        theme={THEMES.algeria}
        ornament={<AlgiersOrnament />}
      />
      <AlgeriaBeat
        kicker="Algérie — Oran"
        title="Oran"
        text={algeria.narrative[1]}
        theme={{ a: "#143244", b: "#0c0a0b", accent: "#e3b566" }}
        ornament={<div className={ornamentStyles.glare} aria-hidden="true" />}
      />
      <AlgeriaBeat
        kicker="Algérie — Le désert"
        title="Le désert"
        text={algeria.narrative[2]}
        theme={{ a: "#4a3423", b: "#2b1a10", accent: "#e8c9a0" }}
        ornament={<DesertOrnament />}
        sparse
      />
      {algeria.placeholderNote && (
        <p
          className={styles.placeholderNote}
          style={{ textAlign: "center", padding: "0 var(--gutter) 3rem", background: "var(--color-black)" }}
        >
          {algeria.placeholderNote}
        </p>
      )}

      {nonAlgeria.slice(1).map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} index={i + 1} />
      ))}
    </section>
  );
}
