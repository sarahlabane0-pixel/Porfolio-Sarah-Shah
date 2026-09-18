// Each destination gets its own visual world (see components/travels).
// narrative: real text — Sarah's own words, or drawn directly from her
// brief's own description of a place's mood, never invented.
// visitedPlaces: only what she has explicitly confirmed visiting.
// referenceOnly: places she named as visual/cultural inspiration, NOT to be
// presented as personally visited.
// placeholderNote: set when neither a personal photo nor a personal
// narrative exists yet — the chapter still ships, honestly marked.

export type TravelChapter = {
  id: string;
  name: string;
  theme: "marrakech" | "algeria" | "new-york" | "houston" | "venice" | "palma";
  kicker: string;
  narrative: string[];
  visitedPlaces?: string[];
  referenceOnly?: string[];
  placeholderNote?: string;
};

export const travelChapters: TravelChapter[] = [
  {
    id: "marrakech",
    name: "Marrakech",
    theme: "marrakech",
    kicker: "Maroc",
    narrative: [
      "Jemaa el-Fna, c'est le mouvement avant tout. Une foule qui ne se fixe jamais, un bruit qui change de forme selon l'heure, une énergie collective qui se transforme sans jamais s'arrêter. On y ressent la même chose que sur un dancefloor plein, une place qui vit parce que tout le monde y participe en même temps.",
      "La Mamounia impose un autre rythme. L'architecture, les jardins, la symétrie, la matière et la lumière y sont pensés au détail près. Le contraste entre les deux lieux dit quelque chose que j'essaie de retrouver dans chaque événement que je construis, la capacité à faire cohabiter l'énergie collective et la précision du détail.",
    ],
    visitedPlaces: ["Jemaa el-Fna", "La Mamounia"],
    referenceOnly: [
      "Mosquée Koutoubia",
      "Jardin Majorelle",
      "Palais Bahia",
      "La Médina et ses souks",
      "Medersa Ben Youssef",
    ],
  },
  {
    id: "algerie",
    name: "Algérie",
    theme: "algeria",
    kicker: "Algérie",
    narrative: [
      "Alger se raconte par son architecture blanche, sa densité urbaine et une lumière méditerranéenne qui change la perspective d'une rue à l'autre.",
      "Oran est plus lumineuse, plus ouverte, portée par la côte et une vie urbaine plus chaude.",
      "Le désert change complètement de rythme. L'espace se vide, le silence prend toute la place, les tons minéraux dominent, et le temps lui-même semble ralentir.",
    ],
    visitedPlaces: ["Alger", "Oran", "Le désert algérien"],
    placeholderNote:
      "Lieux précis à Alger, Oran et dans le désert non encore confirmés par Sarah — structure prête, à compléter.",
  },
  {
    id: "new-york",
    name: "New York",
    theme: "new-york",
    kicker: "États-Unis",
    narrative: [
      "Dans le tumulte de Manhattan, j'ai été captivée par la diversité et l'énergie de la ville. J'ai assisté à des spectacles de rue où la danse hip-hop prend vie.",
      "J'ai exploré des icônes telles que Broadway, le Metropolitan Museum of Art. J'ai été particulièrement fascinée par le street art de Brooklyn, un véritable musée à ciel ouvert.",
    ],
    visitedPlaces: ["Manhattan", "Broadway", "Metropolitan Museum of Art", "Brooklyn"],
  },
  {
    id: "houston",
    name: "Houston",
    theme: "houston",
    kicker: "États-Unis",
    narrative: [
      "Lors de ma visite à Houston, j'ai été impressionnée par le Space Center Houston. Cette plongée dans l'univers de l'astronautique m'a offert un aperçu captivant de l'espace, un domaine où imagination et réalité se côtoient.",
      "Cela m'a inspiré à explorer des thèmes de découverte et d'innovation, reflétant la grandeur et l'audace humaines. Houston m'a aussi séduite par sa scène artistique vivante.",
    ],
    visitedPlaces: ["Space Center Houston"],
  },
  {
    id: "venise",
    name: "Venise",
    theme: "venice",
    kicker: "Italie",
    narrative: [],
    placeholderNote:
      "Récit personnel et photos à venir — le chapitre est construit autour de l'eau, des reflets et des façades en attendant le texte de Sarah.",
  },
  {
    id: "palma",
    name: "Palma de Majorque",
    theme: "palma",
    kicker: "Espagne",
    narrative: [],
    placeholderNote:
      "Récit personnel et photos à venir — le chapitre est construit autour de la lumière et des textures minérales en attendant le texte de Sarah.",
  },
];
