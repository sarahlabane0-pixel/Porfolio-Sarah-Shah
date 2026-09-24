# Image TODO

Tracks every image source, quality caveat and gap, so nothing gets silently
stretched, mis-attributed or replaced with generated imagery. The site's
photo registry is `content/media.ts` (real pixel sizes live there).

## How images are served

- `next/image` with AVIF → WebP negotiation, quality 90 for photography
  (`next.config.ts`). Originals stay untouched in `public/assets/`.
- Every photo carries its real width; layouts cap display width at
  `width / 1.4` CSS px (`components/allaccess/Photo.tsx`), so nothing is
  ever enlarged beyond what the file holds. This is why most photos appear
  as floating frames or cards rather than full-screen: **the sources are
  small** (see "Higher-resolution files needed" below).

## Hero / identity portrait

- `public/assets/hero/sarah-portrait.webp` — the **final portrait** Sarah
  supplied (1122×1402), stored byte-for-byte. Replaces the earlier retouch.
  Used for STATE A of the hero and on the ALL ACCESS pass in Contact.
- `sarah-cutout.webp` / `sarah-cutout-sm.webp` — silhouette extracted from
  the final portrait with BiRefNet (portrait model), soft alpha on the curls.
- `sarah-depth.png` — depth estimated from the final portrait with Depth
  Anything v2, masked by the silhouette. Drives the hero's depth shader.
- STATE B / C are built in code around the real photo; the face is never
  generated or altered.

## Where each photo comes from

Extracted from Sarah's own PDFs (original embedded bytes, no upscaling):

| File | Size | Source | Used in |
|---|---|---|---|
| `adecco/office-01.jpg` | 720×480 | SEP dossier p.22 | Work — Adecco |
| `adecco/kickoff-01.jpg` | 615×346 | SEP dossier p.21 | Work — Adecco |
| `adecco/kickoff-02.jpg` | 410×231 | earlier extraction | Work — Adecco |
| `ketil/studio-interview-01.jpg` | 1286×1714 | About Me deck p.5 | Work — Ketil |
| `ketil/event-theatre-01.jpg` | 908×1210 | About Me deck p.5 | Work — Ketil, Programme |
| `ketil/studio-02.jpg` | 857×1143 | About Me deck p.5 | Work — Ketil |
| `ketil/event-accueil-01.jpg` | 480×640 | About Me deck p.5 | Work — Ketil |
| `ketil/team-01.jpg` | 640×480 | About Me deck p.5 | Work — Ketil |
| `ketil/event-outdoor-01.jpg` | 605×807 | About Me deck p.5 | not placed yet |
| `choiseul/networking-01.jpg` | 733×457 | About Me deck p.4 | Work — Choiseul |
| `choiseul/conference-2024-06-03.jpg` | 386×389 | earlier extraction | Work — Choiseul |
| `disney/castle-sunset-01.jpg` | 736×1308 | Portfolio 2025 p.9 | Work — Disney (replaces the 442px `pier-01.jpg`) |
| `disney/parade-01.jpg` | 600×401 | Portfolio 2025 p.9 | Work — Disney |
| `places/aura-invalides-01.jpg` | 706×749 | Portfolio 2025 p.8 | Spaces |
| `places/bourse-de-commerce-01.jpg` | 465×620 | Portfolio 2025 p.8 | Spaces |
| `places/immersive-dome-01.jpg` | 980×480 | Portfolio 2025 p.8 | Spaces |
| `places/exhibition-portraits-01.jpg` | 473×676 | Portfolio 2025 p.7 | Spaces |
| `places/popup-store-01.jpg` | 605×807 | Portfolio 2025 p.1 | Spaces |
| `danse/dance-bw-01.jpg` | 474×632 | Portfolio 2025 p.3 | Movement, Programme |
| `travel/*` | 248–452 px wide | Portfolio 2025 pp.5–6 | Postcards |

### Please confirm

- **Places photos**: AURA Invalides, Bourse de Commerce, the immersive dome,
  the portrait exhibition and the pop-up store come from your portfolio's
  "expositions / lieux" pages. Confirm they are your own photos. If any is a
  press image, tell me which one and I'll take it out. Also tell me the names
  of the immersive dome, the exhibition and the pop-up store if you want
  them captioned; they are labelled generically for now.
- **`danse/dance-bw-01.jpg`**: the black-and-white dancer on the hip-hop
  page. Captioned neutrally ("Danse"); confirm it is you.
- **Disney cast photo**: the two cast members in red waistcoats (Portfolio
  p.9) were **not** used, because I could not confirm it is you. Say so and it
  can go into the Disney scene.
- **`ketil/team-01.jpg`** is captioned "équipe Ketil Media" because it sits on
  the Ketil slide; confirm.

## Placeholders currently on the site (clearly marked, never stand-ins)

| Where | Placeholder | What I need |
|---|---|---|
| Postcards | "Image à fournir — Marrakech" card | A photo of Marrakech (Jemaa el-Fna, La Mamounia…). The blue-street photo is **Chefchaouen**, not Marrakech, and is not used |
| Postcards | "Image à fournir — New York" card | A personal New York photo (Brooklyn street art, Broadway…). `new-york-liberty-empire-state.jpg` looks like a composite/stock view and is **not used** |
| Spaces (3D + gallery) | "Photographie à fournir" frames | Your Espace Niemeyer photos — see the Niemeyer section below |

## Espace Niemeyer — photos not received

**None of the files available to me contains a photo of Espace Niemeyer.**
Checked: the CV (it only names the place in the interests line), the About
Me deck (7 pages), Portfolio 2025 (9 pages), the SEP dossier (25 pages), the
images attached in the conversation (three portrait files only), the repo, its
history and every branch.

The chapter is wired to pick your photos up automatically. Put them here:

    public/assets/places/niemeyer/

Any .jpg / .jpeg / .png / .webp / .avif in that folder is read at build time
(sorted by file name, real dimensions via sharp — `lib/niemeyerPhotos.ts`):

- the **first** file becomes the photograph the 3D lines extrude from, and
  stays visible behind the architecture. Ideally a frontal / elevation view,
  landscape, ≥ 2400 px wide.
- **every** file is shown, large, in the "Le lieu, en vrai." gallery right
  after the 3D moment.

Suggested: `niemeyer-01-facade.jpg` (frontal), `niemeyer-02-dome.jpg`,
`niemeyer-03-interior.jpg`, then any others. Until then the plane and the
gallery show clearly labelled "Photographie à fournir" frames. The pipeline
was tested end to end with temporary images, which were then removed.

## Higher-resolution files needed (for a truly premium result)

Every event/travel photo available today is 250–1300 px wide. For large
displays I'd like the **original files** (straight from the phone/camera,
ideally 2000–4000 px) of:

- Adecco: the office photo, the kick-off stage photos.
- Ketil: the studio interview, the theatre, the #studio sign, the reception.
- Institut Choiseul: the conference (3 June 2024), the networking photo.
- Disney: the castle at sunset, the parade.
- Travel: every postcard (Houston, Venice ×2, Palma ×2, Algeria ×2) + the two
  missing ones (Marrakech, New York).
- Places: AURA, Bourse de Commerce, the dome, the exhibition, the pop-up.
- Dance: the black-and-white photo.

Drop them in with the same names and the layouts will scale up automatically.
They are capped by resolution, so larger files simply get displayed larger.

## Not used, kept for reference

- `travel/morocco-chefchaouen-blue-street.jpg` — Chefchaouen, not Marrakech.
- `travel/new-york-liberty-empire-state.jpg` — looks composited.
- `travel/spain-flag-promenade.jpg` — location unconfirmed.
- `travel/unassigned-white-arches.jpg` — destination unknown.
- `disney/pier-01.jpg`, `ketil/studio-01.jpg`, `danse/mouvement-01.jpg`,
  `portraits/*` — used by the archived v1 site only.
- Guadeloupe beach (Portfolio p.5): not one of your listed destinations,
  not extracted.
