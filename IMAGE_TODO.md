# Image TODO

Tracks every image source, quality caveat and gap, so nothing gets silently
stretched, mis-attributed or replaced with generated imagery.

## Hero portrait (ALL ACCESS prototype)

- `public/assets/hero/sarah-portrait.webp` — STATE A (real portrait), supplied
  by Sarah, 1122×1402. Used as the full-bleed fallback and the source for:
  - `sarah-cutout.webp` — silhouette extracted with BiRefNet (portrait
    segmentation model), soft alpha preserved on the curls. Lets typography
    sit genuinely behind her body, not behind a rectangle.
  - `sarah-depth.png` — per-pixel depth estimated with Depth Anything v2,
    multiplied by the silhouette so the background reads as uniformly far.
    Drives the cursor depth-displacement shader.
- STATE B / STATE C (hybrid / full event identity) are **not image files**:
  they are built in code as a scenographic layer (acrylic panel, accreditation
  ribbon, pass, beams, structure, codes) composited around the real
  portrait. Nothing about her face is generated or altered. If Sarah later
  supplies designed B/C visuals, they can replace the code layer.

## Corrections made after re-auditing the source decks

- The red theatre and reception photos were previously filed under
  Institut Choiseul. On the About Me deck they sit on the **Ketil** slide, so
  they are now `public/assets/ketil/event-theatre-01.jpg` and
  `event-accueil-01.jpg`.
- The real Institut Choiseul photos are now extracted:
  `public/assets/choiseul/conference-2024-06-03.jpg` (386×389, dated on the
  slide) and `networking-01.jpg` (733×457).
- `danse/mouvement-02.jpg` was a Jacquemus product shot from the "Luxe"
  moodboard, mislabelled as a dance photo. Deleted (it was never displayed).
- `danse/mouvement-01.jpg` is Sarah in costume from the Disneyland Paris
  slide, in a movement pose — a real photo of her, but it comes from the
  Disney experience, not from a dance context.

## Travel — found in `PORTFOLIO - SARAH - 2025.pdf`, pages 5–6

Extracted to `public/assets/travel/`. Not yet placed anywhere (the travel
chapter is redesigned after the hero is approved). All are small — fine for
collage/card use, not for full-screen.

| Destination | File | Size | Note |
|---|---|---|---|
| Houston | `houston-road-skyline.jpg` | 452×602 | Skyline seen from a car — reads as a personal photo |
| New York | `new-york-liberty-empire-state.jpg` | 508×635 | **Appears to be a photo composite** (the Statue of Liberty is not physically in front of the Empire State Building). Please confirm you want it used |
| Venice | `venice-canal-night.jpg` | 295×524 | |
| Venice | `venice-rialto.jpg` | 368×460 | |
| Palma | `palma-cathedral.jpg` | 248×544 | La Seu cathedral |
| Palma | `palma-cove.jpg` | 384×480 | Mallorca cove |
| Spain (Palma?) | `spain-flag-promenade.jpg` | 368×491 | Please confirm the location |
| Algeria | `algeria-boat-flag.jpg` | 295×524 | Algerian flag visible |
| Algeria | `algeria-coast-tree.jpg` | 295×524 | Placed under the Algeria column on the page; please confirm |
| Morocco | `morocco-chefchaouen-blue-street.jpg` | 295×524 | **This is Chefchaouen (the blue city), not Marrakech** |
| ? | `unassigned-white-arches.jpg` | 832×832 | Hidden behind another image on page 5; destination unknown |

The same page also has a Guadeloupe beach photo (not one of the six
destinations, not extracted).

## Genuinely missing — not in any of the four source files

- **Marrakech** — no image of Marrakech itself (only Chefchaouen, above).
- **Espace Niemeyer** — no image anywhere in the CV, About Me deck, 2025
  portfolio or SEP dossier. It is only named in the CV's interests line.
- **Algeria: Oran and the desert** — only the boat/coast images above, no
  image identifiable as Oran or the desert.
- Galleries / pop-up stores / cafés / installations — the "Expositions" page
  has images (Bourse de Commerce interior, a projection space) that look like
  press/stock visuals; not extracted pending confirmation.

## Other real photos in use (modest resolution)

- Adecco: `adecco/kickoff-01.jpg` (615×346), `kickoff-02.jpg` (410×231)
- Ketil: `ketil/studio-01.jpg` (605×807), `studio-02.jpg` (857×1143),
  `event-theatre-01.jpg` (908×1210), `event-accueil-01.jpg` (480×640)
- Disney: `disney/pier-01.jpg` (442×589), `parade-01.jpg` (600×401)
- Previous portraits: `portraits/sarah-standing.png` (653×1452 cutout),
  `portraits/sarah-iris.jpg` (400×400) — superseded by the new hero portrait,
  kept for the archived v1 site.
