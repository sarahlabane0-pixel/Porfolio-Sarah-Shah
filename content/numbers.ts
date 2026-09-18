// Numbers for the "chiffres" scene (built in a later slice). Only verified
// figures ship as real numbers — everything else stays an editable
// placeholder until Sarah confirms it. Do not invent values here.

export type StatEntry = {
  value: string;
  label: string;
  verified: boolean;
};

export const stats: StatEntry[] = [
  {
    value: "5",
    label: "dirigeants, experts et collaborateurs accompagnés dans leurs prises de parole",
    verified: true,
  },
  {
    value: "3",
    label: "outils de reporting utilisés au quotidien — Sprout Social, Excel, Meltwater",
    verified: true,
  },
  { value: "XX", label: "événements accompagnés", verified: false },
  { value: "XX", label: "projets menés", verified: false },
  { value: "XX", label: "destinations", verified: false },
  { value: "XX", label: "contenus produits", verified: false },
];
