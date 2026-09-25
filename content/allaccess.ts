// Copy for the ALL ACCESS experience. Microcopy (codes, labels) is new and
// can be rewritten freely; nothing here states a fact about Sarah's career
// that isn't already in her CV or in content/experiences.ts.

export const identity = {
  firstName: "SARAH",
  lastName: "SHAH",
  fields: ["Communication", "Events", "Experiences"],
  city: "Paris / FR",
  edition: "Portfolio 2026",
  availability: "Available for opportunities",
  scrollCue: "Scroll to enter",
};

export const accessPass = {
  title: "ALL ACCESS",
  holder: "Sarah Shah",
  role: "Communication · Événementiel",
  level: "Access — All areas",
  gate: "Portfolio 2026",
  ribbon: "ALL ACCESS — SARAH SHAH — PARIS / FR — ",
};

export const revealCue = {
  eventState: { label: "Identity — Event", action: "Click to reveal" },
  realState: { label: "Identity — Sarah", action: "Click to restore" },
  buttonReveal: "Révéler le portrait",
  buttonRestore: "Afficher l'identité événementielle",
};

export const onTheList = {
  left: ["YOU'RE", "ON"],
  rightSans: "THE",
  rightSerif: "list",
  code: "Access — Granted",
  guest: "Guest — You",
  date: "Entry — 2026",
  welcome: "Bienvenue dans mon univers.",
  intro:
    "Je ne pense pas un événement comme un rendez-vous. Je le pense comme une expérience.",
  fields: "Communication événementielle · stratégie éditoriale · expériences de marque",
};

export const navChapters = [
  { index: "01", label: "Work", href: "#work" },
  { index: "02", label: "Skills", href: "#skills" },
  { index: "03", label: "Postcards", href: "#postcards" },
  { index: "04", label: "Spaces", href: "#spaces" },
  { index: "05", label: "Movement", href: "#movement" },
  { index: "06", label: "Contact", href: "#contact" },
] as const;

export const work = {
  kicker: "Work",
  count: "5 expériences — 2022 → aujourd'hui",
  titleA: "Cinq scènes,",
  titleB: "une même exigence.",
  lead: "Communication corporate, événementiel, contenu éditorial, relation visiteurs. Ce que j'ai fait, où, et comment.",
};

export const cv = {
  href: "/cv/Sarah-Shah-CV.pdf",
  label: "CV",
  longLabel: "Télécharger mon CV",
};

// Skills — Sarah's own list and wording. The MAKING / HUMAN split is hers.
export const skills = {
  kicker: "Skills / Human + Making",
  headline: ["Ce que je fais.", "Comment je le fais."],
  text: "Des compétences de production aux qualités humaines qui rendent un projet fluide, lisible et vivant.",
  making: [
    "Stratégie éditoriale",
    "Événementiel",
    "Storytelling",
    "Coordination",
    "Contenu",
    "Reporting",
    "Logistique",
    "Prise de parole",
  ],
  human: [
    "Créativité",
    "Rigueur",
    "Adaptabilité",
    "Intelligence émotionnelle",
    "Gestion du stress",
    "Esprit d'équipe",
    "Persévérance",
  ],
  modes: {
    all: "Tout",
    making: "Making — ce que je fais",
    human: "Human — comment je le fais",
  },
  hint: "Survolez un mot · faites glisser pour tourner",
  hintTouch: "Touchez un mot · glissez pour tourner",
};

// A breath between Skills and Postcards — Sarah's own lines (content/copy.ts
// recit.linesSecondary), kept verbatim.
export { recit } from "./copy";

// Postcards — travel as an interlude. Only places Sarah confirmed; lines are
// her own words (content/travels.ts). `media: null` = a photo she still has
// to provide: shown as an explicit placeholder, never replaced by a stand-in.
export const postcards = {
  kicker: "Postcards",
  titleA: "Ailleurs,",
  titleB: "ce qui nourrit le regard.",
  fragments: ["Lumière", "Textures", "Architecture", "Mouvement", "Cultures"],
  hint: "Attrapez une carte",
  next: "Suivant — Spaces",
};

// Spaces — Espace Niemeyer and the places Sarah observes. Paragraphs are
// hers (content/places.ts); captions only name what the photo shows.
export { niemeyer, curiosity } from "./places";
export const spaces = {
  kicker: "Spaces",
  title: "I collect spaces.",
  place: "Espace Niemeyer",
  note: "Interprétation abstraite des courbes d'Oscar Niemeyer — pas une reconstruction.",
  // The last step is where the drawing hands over to the real place.
  steps: ["Élévation", "Volume", "Lumière", "Observation"],
  photoLabel: "Espace Niemeyer — Paris",
  galleryKicker: "Espace Niemeyer — Paris",
  galleryTitle: ["Le lieu,", "en vrai."],
  missing: ["vue frontale", "le dôme", "l'intérieur"],
  sheetLabel: "Élévation — Espace Niemeyer — Paris",
  architect: "Architecture — Oscar Niemeyer",
  // Cartel notes, keyed by photo slug — Sarah's own words (content/places.ts).
  notes: {
    foyer: "Le contraste entre le béton, le mobilier, les volumes et les couleurs.",
  } as Record<string, string>,
  // The photo the 3D dome opens onto; every other photo goes to the exhibition.
  arrivalSlug: "coupole",
  gallery: [
    { key: "aura", title: "AURA Invalides", noteIndex: 0 },
    { key: "bourse", title: "Bourse de Commerce", noteIndex: 1 },
    { key: "dome", title: "Expérience immersive" },
    { key: "exhibition", title: "Exposition" },
    { key: "popup", title: "Pop-up store" },
  ],
} as const;

// Movement — Sarah's récit (copy.ts, verbatim) staged as choreography, then
// her dance paragraphs. `accent` marks the word each line lands on.
export { danse } from "./copy";
export const movement = {
  kicker: "Movement",
  meter: "4 / 4",
  accents: ["", "danse.", "parler,", "espace,", "rythme,", "exigence", "l'événementiel,", "public,", "expérience,", "moment", "mémoire."],
};

// Contact — the final scene.
export { contact } from "./copy";
export const finale = {
  kicker: "Contact",
  lines: ["Parlons de", "votre prochain", "événement"],
  copy: "Copier",
  copied: "Copié",
  back: "Retour à l'entrée",
  archive: "Archive v1",
  pass: { title: "ALL ACCESS", role: "Communication · Événementiel", zone: "Contact" },
};

// Programme — Sarah's "Mes mondes", used as the evening's running order.
export { mondes } from "./copy";
export const programme = {
  kicker: "Programme",
  title: "Ce soir, au programme",
  targets: { projets: "#work", voyages: "#postcards", lieux: "#spaces", mouvement: "#movement" } as Record<string, string>,
};

// Observation room ("Le lieu, en vrai.") — how Sarah looks at a space.
// Themes and quotes are her own words (content/places.ts, Niemeyer
// paragraphs). Materials and markers only name what is visible in each photo.
// Marker x/y are % of the photo; `side` is where the label sits.
export type ObservationMarker = { x: number; y: number; label: string; side: "left" | "right" };
export type ObservationPiece = {
  theme: string;
  quote: string;
  materials: string;
  markers: ObservationMarker[];
};
export const observation = {
  lead: "Observer comment un espace est conçu.",
  pieces: {
    foyer: {
      theme: "Circulation",
      quote: "comment on y circule",
      materials: "Moquette verte · béton banché · miroirs",
      markers: [
        { x: 11, y: 31, label: "Béton banché, en courbe", side: "right" },
        { x: 82, y: 22, label: "Miroirs", side: "left" },
        { x: 46, y: 70, label: "Moquette verte", side: "right" },
      ],
    },
    fauteuil: {
      theme: "Matière",
      quote: "le contraste entre le béton, le mobilier, les volumes et les couleurs",
      materials: "Cuir · acier cintré · marbre · béton",
      markers: [
        { x: 47, y: 61, label: "Cuir", side: "left" },
        { x: 89, y: 77, label: "Acier cintré", side: "left" },
        { x: 20, y: 55, label: "Marbre", side: "right" },
        { x: 42, y: 29, label: "Béton banché", side: "right" },
      ],
    },
    salon: {
      theme: "Lumière",
      quote: "comment la lumière y est utilisée",
      materials: "Lumière indirecte · miroirs · béton brut",
      markers: [
        { x: 44, y: 13, label: "Lumière indirecte", side: "right" },
        { x: 30, y: 42, label: "Ligne lumineuse au sol", side: "right" },
        { x: 88, y: 31, label: "Béton brut", side: "left" },
      ],
    },
  } as Record<string, ObservationPiece>,
};
