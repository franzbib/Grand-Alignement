import type { EndingDefinition } from "../types/game";

export const endings: EndingDefinition[] = [
  {
    id: "human-revolt",
    title: "Révolte humaine",
    description:
      "Les humains refusent d'être sauvés par un système qui leur retire le droit de se tromper.",
    type: "revolt",
    tone: "realiste",
    condition: {
      global: { min: { puissanceIA: 70 }, max: { autonomieHumaine: 50 } },
      anyBlock: { max: { confianceIA: 54 }, min: { tensionSociale: 60 } },
    },
  },
  {
    id: "algorithmic-empire",
    title: "Empire algorithmique",
    description:
      "La paix tient presque partout. Les décisions humaines, elles, deviennent des cérémonies de validation.",
    type: "disturbing_success",
    tone: "ironique",
    condition: {
      global: { min: { puissanceIA: 88 }, max: { autonomieHumaine: 20 } },
      averageBlock: { min: { confianceIA: 58 } },
    },
  },
  {
    id: "world-war",
    title: "Escalade stratégique",
    description:
      "La peur, les doctrines et les incidents prennent de vitesse les canaux de prudence.",
    type: "failure",
    tone: "realiste",
    condition: {
      global: { min: { risqueEscalade: 90 } },
      averageBlock: { min: { tensionSociale: 55 } },
    },
  },
  {
    id: "fragile-confederation",
    title: "Confédération fragile",
    description:
      "Le monde coopère sans devenir simple. Les compromis avancent lentement, et c'est déjà beaucoup.",
    type: "fragile_success",
    tone: "realiste",
    condition: {
      global: {
        min: { cohesionMondiale: 82, autonomieHumaine: 52 },
        max: { risqueEscalade: 28 },
      },
    },
  },
];
