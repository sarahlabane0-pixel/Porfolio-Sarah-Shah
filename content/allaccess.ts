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
  level: "Access level — All",
  gate: "Gate A — 2026",
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
  code: "Access 001 — Granted",
  guest: "Guest — You",
  date: "Entry — 2026",
  welcome: "Bienvenue dans mon univers.",
  intro:
    "Je ne pense pas un événement comme un rendez-vous. Je le pense comme une expérience.",
  fields: "Communication événementielle · stratégie éditoriale · expériences de marque",
};

export const navChapters = [
  { index: "01", label: "Work" },
  { index: "02", label: "Worlds" },
  { index: "03", label: "Travel" },
  { index: "04", label: "Places" },
  { index: "05", label: "Contact" },
] as const;

export const cv = {
  href: "/cv/Sarah-Shah-CV.pdf",
  label: "CV",
  longLabel: "Télécharger mon CV",
};
