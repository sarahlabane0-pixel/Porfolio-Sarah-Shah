// Professional case studies. Copy is drawn from Sarah's CV and her SEP
// dossier (school report) — real missions, real tools, no invented results.
// Disney has no detailed duties text yet, only the confirmed job title and
// dates, so its copy stays restrained rather than filling gaps.

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  standfirst: string;
  missions: string[];
  tools?: string[];
  photos: { src: string | null; alt: string; placeholderLabel?: string }[];
};

export const experiences: Experience[] = [
  {
    id: "adecco",
    company: "The Adecco Group",
    role: "Chargée de communication — Communication externe",
    period: "Octobre 2025 — aujourd'hui",
    standfirst:
      "Un grand groupe international, une communication qui passe par plusieurs niveaux de validation avant chaque publication, et une équipe qui m'a fait découvrir ce que veut dire parler au nom d'une structure entière plutôt qu'en son nom propre.",
    missions: [
      "Pilotage de la communication LinkedIn Groupe — rédaction, planification et publication de contenus liés aux événements internes et externes, aux marronniers et à la vie des sièges.",
      "Rédaction et accompagnement des prises de parole de 5 dirigeants, experts et collaborateurs internes.",
      "Développement de la stratégie éditoriale LinkedIn France, création de nouveaux formats et séries de contenus, gestion du calendrier éditorial.",
      "Coordination avec les équipes Global et les différentes entités du Groupe (Adecco, Akkodis, LHH) pour identifier les projets, événements et actualités à valoriser.",
      "Veille médiatique et réputationnelle quotidienne via Meltwater.",
      "Participation aux événements du Groupe — kick-off, Summer Party, séminaires, formats digitaux.",
    ],
    tools: ["Sprout Social", "Excel", "Meltwater"],
    photos: [
      { src: "/assets/adecco/kickoff-01.jpg", alt: "Kick-off The Adecco Group" },
      { src: "/assets/adecco/kickoff-02.jpg", alt: "The Adecco Group, prise de parole sur scène" },
    ],
  },
  {
    id: "ketil",
    company: "Ketil Media",
    role: "Chargée de communication et événementiel",
    period: "Septembre 2024 — septembre 2025",
    standfirst:
      "Une régie plurimédia où la communication touchait à tout à la fois, les réseaux, la presse, la vidéo, l'affiche, et où chaque événement interne se préparait, se vivait et se racontait dans la foulée.",
    missions: [
      "Élaboration et mise en œuvre de la stratégie de communication multicanale — réseaux sociaux, site web, communiqués de presse.",
      "Création de contenus éditoriaux et visuels — articles, montages vidéo, affiches, newsletters.",
      "Organisation et coordination d'événements internes et clients — Summer Party, Noël, Radio Classique, Journée internationale des droits des femmes.",
      "Communication événementielle avant, pendant et après les événements — invitations, valorisation des temps forts, couverture, communication post-événement.",
    ],
    photos: [
      { src: "/assets/ketil/studio-01.jpg", alt: "Espace de travail Ketil Media" },
      { src: "/assets/ketil/studio-02.jpg", alt: "Studio #KTAC, Ketil Media" },
    ],
  },
  {
    id: "choiseul",
    company: "Institut Choiseul",
    role: "Chargée de mission communication et événementiel",
    period: "Février — septembre 2024",
    standfirst:
      "Des conférences, des clubs privés, des forums internationaux — un événementiel plus institutionnel, où chaque détail logistique du jour J compte autant que ce qui se dit sur scène.",
    missions: [
      "Organisation d'événements — conférences, clubs privés, séminaires, forums internationaux.",
      "Recherche de prestataires, logistique, inscriptions des participants, bilans, avec la plateforme InvitYou.",
      "Gestion opérationnelle le jour J — accueil, émargement, placement des invités, coordination des intervenants.",
      "Participation à la conception de brochures, kakémonos et supports de communication.",
      "Communication événementielle avant, pendant et après les événements, et reportings post-événement.",
    ],
    photos: [
      { src: "/assets/choiseul/venue-01.jpg", alt: "Salle de conférence, Institut Choiseul" },
      { src: "/assets/choiseul/accueil-01.jpg", alt: "Accueil des invités, Institut Choiseul" },
    ],
  },
  {
    id: "disney",
    company: "Disneyland Paris",
    role: "Opérateur / animateur — attractions",
    period: "Mai — août 2022",
    standfirst:
      "Une première immersion, pas encore dans la communication, mais déjà dans la gestion de flux, la relation aux visiteurs et un univers entièrement pensé comme une expérience. Ce qui s'y apprend sur le rythme d'une foule reste, depuis, une référence silencieuse.",
    missions: [],
    photos: [
      { src: "/assets/disney/pier-01.jpg", alt: "Disneyland Paris au crépuscule" },
      { src: "/assets/disney/parade-01.jpg", alt: "Spectacle Disneyland Paris" },
    ],
  },
];
