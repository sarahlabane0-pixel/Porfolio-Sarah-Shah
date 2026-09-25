// Every photograph the site shows, with its real pixel size. Layouts read
// `w` to cap how large an image may be displayed (see components/allaccess/
// Photo.tsx) so nothing is ever blown up past what the file can hold.
// Sources are the original files Sarah supplied or the originals embedded in
// her PDFs (extracted without recompression where possible) — see
// IMAGE_TODO.md for provenance and for the higher-resolution files still
// needed.

export type Media = {
  src: string;
  w: number;
  h: number;
  alt: string;
};

const m = (src: string, w: number, h: number, alt: string): Media => ({ src, w, h, alt });

export const media = {
  // The Adecco Group
  adeccoOffice: m("/assets/adecco/office-01.jpg", 720, 480, "Locaux de The Adecco Group"),
  adeccoKickoff: m("/assets/adecco/kickoff-01.jpg", 615, 346, "Kick-off The Adecco Group"),
  adeccoStage: m("/assets/adecco/kickoff-02.jpg", 410, 231, "The Adecco Group, prise de parole sur scène"),
  adeccoGroup: m("/assets/adecco/kickoff-group-01.jpg", 615, 297, "Photo de groupe Akkodis, kick-off 2026 « The agility advantage »"),

  // Ketil Media
  ketilInterview: m("/assets/ketil/studio-interview-01.jpg", 1286, 1714, "Interview filmée dans le studio de Ketil Media"),
  ketilTheatre: m("/assets/ketil/event-theatre-01.jpg", 908, 1210, "Salle de spectacle, événement Ketil Media"),
  ketilStudio: m("/assets/ketil/studio-02.jpg", 857, 1143, "Studio #KTAC, Ketil Media"),
  ketilAccueil: m("/assets/ketil/event-accueil-01.jpg", 480, 640, "Accueil des invités, événement Ketil Media"),
  ketilTeam: m("/assets/ketil/team-01.jpg", 640, 480, "Photo de groupe, équipe Ketil Media"),
  ketilOutdoor: m("/assets/ketil/event-outdoor-01.jpg", 605, 807, "Événement en extérieur, Ketil Media"),
  ketilDesk: m("/assets/ketil/studio-01.jpg", 605, 807, "Espace de travail Ketil Media"),

  // Institut Choiseul
  choiseulConference: m("/assets/choiseul/conference-2024-06-03.jpg", 386, 389, "Conférence Institut Choiseul, 3 juin 2024"),
  choiseulNetworking: m("/assets/choiseul/networking-01.jpg", 733, 457, "Temps d'échange entre invités, Institut Choiseul"),

  // Disneyland Paris
  disneyCastle: m("/assets/disney/castle-sunset-01.jpg", 736, 1308, "Le château de Disneyland Paris au coucher du soleil"),
  disneyParade: m("/assets/disney/parade-01.jpg", 600, 401, "Spectacle, Disneyland Paris"),
  disneyTheater: m("/assets/disney/disney-theater-01.webp", 2000, 1334, "Disney Theater, façade illuminée"),

  // Identity — the final portrait Sarah supplied (STATE A of the hero).
  portrait: m("/assets/hero/sarah-portrait.webp", 1122, 1402, "Portrait de Sarah Shah"),

  // Places & curiosity
  aura: m("/assets/places/aura-invalides-01.jpg", 706, 749, "AURA Invalides, vidéo mapping dans le Dôme des Invalides"),
  bourse: m("/assets/places/bourse-de-commerce-01.jpg", 465, 620, "Rotonde de la Bourse de Commerce, Collection Pinault"),
  dome: m("/assets/places/immersive-dome-01.jpg", 980, 480, "Projection immersive sous un dôme"),
  exhibition: m("/assets/places/exhibition-portraits-01.jpg", 473, 676, "Mur de portraits photographiques dans une exposition"),
  popup: m("/assets/places/popup-store-01.jpg", 605, 807, "Intérieur d'un pop-up store"),

  // Movement
  danceBW: m("/assets/danse/dance-bw-01.jpg", 474, 632, "Danse, photographie noir et blanc"),

  // Travel — only places Sarah confirmed, only photos that match them.
  houston: m("/assets/travel/houston-road-skyline.jpg", 452, 602, "Houston, la skyline depuis la route"),
  veniceNight: m("/assets/travel/venice-canal-night.jpg", 295, 524, "Venise, un canal de nuit"),
  veniceRialto: m("/assets/travel/venice-rialto.jpg", 368, 460, "Venise, le pont du Rialto"),
  palmaCathedral: m("/assets/travel/palma-cathedral.jpg", 248, 544, "Palma, la cathédrale"),
  palmaCove: m("/assets/travel/palma-cove.jpg", 384, 480, "Palma, une crique"),
  algeriaBoat: m("/assets/travel/algeria-boat-flag.jpg", 295, 524, "Algérie, un bateau et le drapeau"),
  algeriaDesert: m("/assets/travel/algeria-desert.webp", 616, 812, "Le désert au coucher du soleil, une caravane de dromadaires"),
  marrakech: m("/assets/travel/marrakech-jemaa-el-fna.webp", 870, 580, "Marrakech, la place Jemaa el-Fna et la Koutoubia au coucher du soleil"),
  brooklyn: m("/assets/travel/new-york-brooklyn-bridge.png", 670, 504, "New York, le pont de Brooklyn et Manhattan"),
  algeriaCoast: m("/assets/travel/algeria-coast-tree.jpg", 295, 524, "Algérie, la côte"),
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
