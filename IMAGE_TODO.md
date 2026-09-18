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

## Now in use — modest resolution, fine at current scale

These are real photos (not placeholders), used in `components/professional/`,
`components/mondes/` and `components/dance/`. All are displayed at
small/medium scale (case-study spread photos, not full-bleed hero), which
suits their resolution — flagged here only so nobody scales them up later
without checking.

- `public/assets/adecco/kickoff-01.jpg` (615×346), `kickoff-02.jpg`
  (410×231) — Adecco Group kickoff/auditorium, used in Professional and as
  the "Projets professionnels" cover in Mes Mondes.
- `public/assets/ketil/studio-01.jpg` (605×807), `studio-02.jpg` (857×1143)
  — Ketil Media workspace and "#KTAC Studio" sign.
- `public/assets/choiseul/venue-01.jpg` (908×1210), `accueil-01.jpg`
  (480×640) — Institut Choiseul theatre interior and guest check-in.
- `public/assets/disney/pier-01.jpg` (442×589), `parade-01.jpg` (600×401)
  — Disneyland Paris, both under 600px on the long edge, will look soft
  above small/medium display size.
- `public/assets/danse/mouvement-01.jpg` (548×731), `mouvement-02.jpg`
  (451×557) — used in the Danse section (mouvement-01) and Mes Mondes
  cover (mouvement-01); mouvement-02 extracted but not yet placed.

## Explicitly avoided

No stock or generic imagery has been used to stand in for any of the above.
Sections with missing personal photography will ship with a clearly marked
placeholder rather than a substitute photo, per Sarah's instruction.
