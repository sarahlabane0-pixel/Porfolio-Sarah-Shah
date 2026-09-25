// Professional case studies, in the order Sarah set: 01 Adecco, 02 Ketil,
// 03 Choiseul, 04 Digital Content Expert, 05 Disneyland Paris. Copy comes from
// her CV, SEP dossier and the Digital Content Expert details she supplied —
// real missions and tools, no invented results. Disney has only the confirmed
// title and dates, so its copy stays restrained rather than filling gaps.

import { media, type Media } from "./media";

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  standfirst: string;
  missions: string[];
  tools?: string[];
  keywords?: string[];
  photos: { src: string | null; alt: string; placeholderLabel?: string }[];
  /** ALL ACCESS site: what the scene is about, in three words or so. Summarises the missions below, adds nothing. */
  tags: string[];
  /** ALL ACCESS site: photos with real dimensions, in display order. */
  media: Media[];
  /** A verified figure from Sarah's CV, if the scene has one. */
  stat?: { value: string; label: string };
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
    tags: ["Communication corporate", "LinkedIn Groupe", "Prises de parole"],
    media: [media.adeccoOffice, media.adeccoKickoff, media.adeccoGroup],
    stat: { value: "5", label: "dirigeants, experts et collaborateurs accompagnés dans leurs prises de parole" },
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
    tags: ["Communication multicanale", "Événementiel", "Contenus"],
    media: [media.ketilInterview, media.ketilTheatre, media.ketilStudio, media.ketilAccueil, media.ketilTeam],
    photos: [
      { src: "/assets/ketil/event-theatre-01.jpg", alt: "Salle de spectacle, événement Ketil Media" },
      { src: "/assets/ketil/studio-02.jpg", alt: "Studio #KTAC, Ketil Media" },
      { src: "/assets/ketil/event-accueil-01.jpg", alt: "Accueil des invités, événement Ketil Media" },
      { src: "/assets/ketil/studio-01.jpg", alt: "Espace de travail Ketil Media" },
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
    tags: ["Événementiel institutionnel", "Logistique", "Jour J"],
    media: [media.choiseulNetworking, media.choiseulConference],
    photos: [
      { src: "/assets/choiseul/conference-2024-06-03.jpg", alt: "Conférence Institut Choiseul, 3 juin 2024" },
      { src: "/assets/choiseul/networking-01.jpg", alt: "Temps d'échange entre invités, Institut Choiseul" },
    ],
  },
  {
    id: "dce",
    company: "Digital Content Expert",
    role: "Content Manager — alternance",
    period: "Mai — décembre 2023",
    standfirst:
      "Produire, intégrer et fiabiliser des contenus éditoriaux pour différents clients.",
    missions: [
      "Relecture et validation des contenus éditoriaux.",
      "Traductions.",
      "Validation de contenus graphiques.",
      "Participation à la gestion des comptes clients.",
      "Interviews clients et partenaires pour calibrer les productions éditoriales.",
      "Implémentation CMS sur WordPress et Drupal.",
      "Recherche iconographique via des banques d'images comme Shutterstock.",
    ],
    keywords: ["Content Manager", "WordPress / Drupal", "Interviews", "Iconographie"],
    tags: ["Contenu éditorial", "CMS", "Clients"],
    media: [],
    photos: [],
  },
  {
    id: "disney",
    company: "Disneyland Paris",
    role: "Opérateur / animateur — attractions",
    period: "Mai — août 2022",
    standfirst:
      "Une première immersion, pas encore dans la communication, mais déjà dans la gestion de flux, la relation aux visiteurs et un univers entièrement pensé comme une expérience. Ce qui s'y apprend sur le rythme d'une foule reste, depuis, une référence silencieuse.",
    missions: [],
    tags: ["Relation visiteurs", "Gestion de flux", "Expérience"],
    media: [media.disneyCastle, media.disneyParade, media.disneyTheater],
    photos: [
      { src: "/assets/disney/pier-01.jpg", alt: "Disneyland Paris au crépuscule" },
      { src: "/assets/disney/parade-01.jpg", alt: "Spectacle Disneyland Paris" },
    ],
  },
];
