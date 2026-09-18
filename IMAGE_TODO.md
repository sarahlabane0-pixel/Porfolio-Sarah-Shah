# Image TODO

Tracks every image gap and quality caveat so nothing gets silently stretched
or replaced with stock photography. Updated as Sarah sends more source files.

## In use, with caveats

### `public/assets/portraits/sarah-standing.png`
- Section: Hero (`components/hero/Hero.tsx`)
- Source: extracted from `Pink Bold About Me Presentation.pdf`, page 1, cut
  out against a flat black background and keyed to alpha transparency.
- Current resolution: 653×1452 (cropped from a 1643×2191 source).
- Recommended: fine at the current hero scale (`clamp(42vh, ..., 78vh)`),
  but a native high-resolution export of this same photo (2000px+ on the
  long edge) would hold up better if the composition is ever pushed larger,
  or reused at full-bleed size elsewhere in the site.

### `public/assets/portraits/sarah-iris.jpg`
- Section: Iris opening (`components/intro/Iris.tsx`)
- Source: extracted from `CV - Shah Sarah.pdf`, page 1.
- Current resolution: 737×1105.
- Recommended: usable at the current constrained circle size, but will
  soften on very large desktop displays where the aperture opens past
  roughly 1200px wide. A higher-resolution version of this portrait (or an
  alternative face-forward shot at 2000px+) would remove that ceiling.

## Missing — blocks later chapters

Sarah confirmed she has real photos organized by section (travel, Espace
Niemeyer, atypical places, companies, personal projects), some grouped
inside PDFs, to be sent separately. Once received, re-run the same
extraction pass used for the four files already analysed (crop, quality
check, alpha-key where relevant) and update this list.

- **Marrakech** — confirmed personally visited: Jemaa el-Fna, La Mamounia.
  No photos received yet for either. Other Marrakech references (Koutoubia,
  Jardin Majorelle, Bahia Palace, Medina/souks, Ben Youssef Madrasa) are
  approved as visual/cultural inspiration only, not to be presented as
  places visited, and not yet sourced either way.
- **Algeria** — confirmed personally visited: Algiers, Oran, the desert. No
  photos and no specific locations within each yet (explicitly withheld
  until Sarah reviews her own photos — do not invent monuments, hotels, or
  landmarks for any of the three).
- **New York** — no personal photos yet. Strong personal narrative text
  exists (Broadway, the Met, Brooklyn street art, hip-hop street
  performances) and is usable as real copy independent of imagery.
- **Houston** — no personal photos yet. Strong personal narrative text
  exists (Space Center Houston) and is usable as real copy.
- **Venice** — no personal photos, no personal narrative text yet.
- **Palma de Majorque** — no personal photos, no personal narrative text yet.
- **Espace Niemeyer** — no photos received yet despite being a named,
  major section in the brief.
- **Galleries / expositions / pop-up stores** — text references exist (AURA
  Invalides, "Le monde comme il va" at the Bourse de Commerce / Collection
  Pinault) but no personal photography yet.

## Usable but modest resolution (fine for smaller/atmospheric use, not full-bleed hero scale)

- Dance/movement photos (silhouette running/leaping shot, arms-raised
  shot): all under ~750px on the long edge.
- Adecco professional photos (kickoff/auditorium crowd shot, group award
  photo, colleague selfie, stage presentation): ~700–900px wide.
- Ketil Media (workspace interior, "#KTAC Studio" neon sign, outdoor
  team/event photo): usable, moderate resolution.
- Choiseul Institut (conference hall, red-velvet theatre interior,
  check-in/book-signing moment, interview setup): best atmosphere of the
  professional set, moderate resolution.
- Disney (real sunset castle photo, real parade/show photo): both under
  600px on the long edge, will look soft above small/medium display size.

## Explicitly avoided

No stock or generic imagery has been used to stand in for any of the above.
Sections with missing personal photography will ship with a clearly marked
placeholder rather than a substitute photo, per Sarah's instruction.
