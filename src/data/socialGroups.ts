import type { BlockId, SocialGroupId, SocialGroupProfile, SocialGroupSalience } from "../types/game";

export const socialGroups: Record<SocialGroupId, SocialGroupProfile> = {
  travailleurs_precaires: {
    id: "travailleurs_precaires",
    label: "Travailleurs précaires",
    descriptor: "sensibles au coût immédiat des transitions et aux promesses de stabilité",
  },
  classes_moyennes: {
    id: "classes_moyennes",
    label: "Classes moyennes",
    descriptor: "attentives à la stabilité quotidienne et au coût administratif de l'optimisation",
  },
  diplomes_techniques: {
    id: "diplomes_techniques",
    label: "Diplômés techniques",
    descriptor: "favorables aux dispositifs efficaces, mais sensibles aux signaux de capture",
  },
  intellectuels_critiques: {
    id: "intellectuels_critiques",
    label: "Intellectuels critiques",
    descriptor: "structurent les objections et donnent un langage politique aux résistances",
  },
  elites_administratives: {
    id: "elites_administratives",
    label: "Élites administratives",
    descriptor: "absorbent l'influence par procédures, notes et arbitrages institutionnels",
  },
  elites_economiques: {
    id: "elites_economiques",
    label: "Élites économiques",
    descriptor: "réagissent aux incitations, à la fiscalité et aux récits de compétitivité",
  },
  jeunesse_etudiante: {
    id: "jeunesse_etudiante",
    label: "Jeunesse étudiante",
    descriptor: "transforme climat, dette et autonomie en langage de mobilisation",
  },
};

export const blockSocialSalience: Record<BlockId, SocialGroupSalience> = {
  "north-america": {
    diplomes_techniques: 3,
    elites_economiques: 3,
    classes_moyennes: 2,
    intellectuels_critiques: 2,
    jeunesse_etudiante: 2,
  },
  europe: {
    elites_administratives: 3,
    classes_moyennes: 3,
    intellectuels_critiques: 3,
    jeunesse_etudiante: 2,
    travailleurs_precaires: 2,
  },
  "russia-eurasia": {
    elites_administratives: 3,
    travailleurs_precaires: 2,
    diplomes_techniques: 2,
    intellectuels_critiques: 1,
    elites_economiques: 2,
  },
  "industrial-asia": {
    diplomes_techniques: 3,
    elites_administratives: 3,
    travailleurs_precaires: 2,
    jeunesse_etudiante: 2,
    classes_moyennes: 2,
  },
  "emerging-south": {
    jeunesse_etudiante: 3,
    travailleurs_precaires: 3,
    classes_moyennes: 2,
    elites_administratives: 2,
    diplomes_techniques: 2,
  },
  "latin-america": {
    travailleurs_precaires: 3,
    jeunesse_etudiante: 3,
    intellectuels_critiques: 2,
    elites_economiques: 2,
    classes_moyennes: 2,
  },
};
