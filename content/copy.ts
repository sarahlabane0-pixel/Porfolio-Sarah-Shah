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
  { index: "03", label: "Mondes", href: "#mondes", available: true },
  { index: "04", label: "Parcours", href: "#parcours", available: true },
  { index: "05", label: "Contact", href: "#contact", available: true },
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

export const mondes = {
  kicker: "02 bis",
  title: "Mes mondes",
  intro:
    "Quatre matières qui reviennent tout le temps, et qui finissent toujours par nourrir la façon dont je pense un événement.",
  worlds: [
    {
      id: "projets",
      label: "Projets professionnels",
      href: "#parcours",
      text: "Adecco, Ketil Media, Institut Choiseul, Disneyland Paris. Quatre terrains, une même exigence.",
      image: "/assets/adecco/kickoff-01.jpg",
    },
    {
      id: "voyages",
      label: "Voyages",
      href: "#voyages",
      text: "Marrakech, l'Algérie, New York, Houston, Venise, Palma. Des mondes visuels, pas des cartes postales.",
      image: null,
    },
    {
      id: "lieux",
      label: "Lieux et expériences",
      href: "#lieux",
      text: "L'Espace Niemeyer, des galeries, des pop-up stores. Ce que j'observe dans un espace avant d'y penser un événement.",
      image: null,
    },
    {
      id: "mouvement",
      label: "Mouvement, danse",
      href: "#danse",
      text: "Avant la communication, il y a eu la danse. Le rythme n'a jamais vraiment quitté ma façon de travailler.",
      image: "/assets/danse/mouvement-01.jpg",
    },
  ],
};

export const danse = {
  kicker: "Avant tout, encore",
  title: "Danse",
  paragraphs: [
    "Le hip-hop, c'est une passion qui me suit depuis l'enfance. Petite, je passais des heures à regarder des clips, fascinée par les chorégraphies. Sans vraiment m'en rendre compte, j'apprenais à danser en observant.",
    "J'ai toujours eu cette facilité à retenir rapidement les pas, à capter les mouvements et à les reproduire presque instinctivement. Très tôt, je me suis intéressée à l'histoire du hip-hop, à ses racines, à ce qu'il représente en tant que culture.",
    "Ce n'était pas juste une musique que j'aimais écouter, c'était un univers que j'avais envie de comprendre, d'explorer, et surtout de vivre à ma manière. J'ai commencé à suivre des cours de danse, puis je n'ai jamais arrêté.",
  ],
};

export const contact = {
  kicker: "05",
  title: "Parlons de votre prochain événement",
  subtitle:
    "Disponible pour un échange, une opportunité ou simplement pour discuter d'une idée.",
  email: "sarah.labane0@gmail.com",
  phone: "06 95 04 22 48",
  phoneHref: "+33695042248",
  location: "Joinville-le-Pont (94)",
};
