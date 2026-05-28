import type { Block } from "../types/game";

export const initialBlocks: Block[] = [
  {
    id: "north-america",
    name: "Amérique du Nord",
    description: "Complexe technologique, finance nerveuse et institutions encore puissantes.",
    stats: {
      stabilite: 62,
      richesse: 82,
      education: 72,
      liberte: 64,
      confianceIA: 48,
      tensionSociale: 52,
    },
  },
  {
    id: "europe",
    name: "Europe",
    description: "Régulation ambitieuse, fatigue démocratique et mémoire historique encombrante.",
    stats: {
      stabilite: 68,
      richesse: 70,
      education: 76,
      liberte: 72,
      confianceIA: 42,
      tensionSociale: 45,
    },
  },
  {
    id: "russia-eurasia",
    name: "Russie / Eurasie autoritaire",
    description: "Pouvoir vertical, ressources stratégiques et diplomatie de pression.",
    stats: {
      stabilite: 54,
      richesse: 48,
      education: 58,
      liberte: 28,
      confianceIA: 55,
      tensionSociale: 58,
    },
  },
  {
    id: "industrial-asia",
    name: "Asie industrielle",
    description: "Capacité productive massive, discipline sociale et course à l'efficacité.",
    stats: {
      stabilite: 66,
      richesse: 76,
      education: 70,
      liberte: 40,
      confianceIA: 60,
      tensionSociale: 43,
    },
  },
  {
    id: "emerging-south",
    name: "Sud global émergent",
    description: "Jeunesse nombreuse, infrastructures fragiles et souverainetés en négociation.",
    stats: {
      stabilite: 46,
      richesse: 38,
      education: 44,
      liberte: 50,
      confianceIA: 50,
      tensionSociale: 62,
    },
  },
  {
    id: "latin-america",
    name: "Amérique latine",
    description: "Démocraties oscillantes, ressources critiques et imagination politique féconde.",
    stats: {
      stabilite: 50,
      richesse: 44,
      education: 56,
      liberte: 58,
      confianceIA: 46,
      tensionSociale: 57,
    },
  },
];
