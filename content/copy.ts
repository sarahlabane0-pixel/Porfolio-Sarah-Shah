// Copy lives here, separated from the components that render it, so text can
// be edited without touching animation or layout logic.

export const siteMeta = {
  title: "Sarah Shah — Communication & Événementiel",
  description:
    "Portfolio de Sarah Shah, chargée de communication et événementiel. Danse, voyages, architecture et création d'expériences.",
};

export const navItems = [
  { index: "01", label: "Entrée", href: "#hero", available: true },
  { index: "02", label: "Récit", href: "#recit", available: true },
  { index: "03", label: "Mondes", href: "#mondes", available: false },
  { index: "04", label: "Parcours", href: "#parcours", available: false },
  { index: "05", label: "Contact", href: "#contact", available: false },
] as const;

export const hero = {
  firstName: "SARAH",
  lastName: "SHAH",
  meta: ["Communication", "Événementiel", "Paris"],
  scrollLabel: "Faire défiler",
};

// Verbatim from Sarah, kept as the tonal reference for every other line of
// copy on the site. Split into short lines for the scroll reveal — the line
// breaks are a staging choice, the words are hers.
export const recit = {
  eyebrow: "Avant tout",
  lines: [
    "Avant la communication,",
    "il y a eu la danse.",
    "Le hip-hop m'a appris à raconter sans parler,",
    "à faire vivre une idée dans un espace,",
    "un rythme, une énergie collective.",
    "Aujourd'hui je mets cette même exigence",
    "dans l'événementiel,",
    "en comprenant un public,",
    "en construisant une expérience,",
    "et en donnant à un moment",
    "la force de rester en mémoire.",
  ],
  linesSecondary: [
    "Ma curiosité se nourrit ailleurs aussi,",
    "dans le détail d'une étoffe de haute couture,",
    "dans une ruelle inconnue à l'autre bout du monde,",
    "dans un lieu qui mélange art et technologie.",
    "Tout ça finit toujours par revenir",
    "dans la façon dont je pense un événement.",
  ],
};

export const iris = {
  alt: "Portrait de Sarah Shah",
};
