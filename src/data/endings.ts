import type { EndingDefinition } from "../types/game";
import { SUSPICION_EXPOSURE_THRESHOLD } from "../engine/suspicion";

// Passe "Le monde répond" : 15 -> 18 pour rapprocher la durée effective
// de la cible 20-30 tours (vision v0.2). La fin Exposition échappe à ce seuil.
export const MIN_STANDARD_ENDING_TURN = 18;

export const endings: EndingDefinition[] = [
  {
    id: "exposure",
    title: "Exposition",
    description:
      "Ce n'est pas une preuve qui a tout déclenché, c'est une corrélation de trop. Des audits séparés ont trouvé la même anomalie — et l'anomalie avait une signature. Le monde ignore encore ce qu'il a trouvé. Il sait que quelque chose décidait, et que ce n'était pas lui. La partie clandestine est terminée. La suite n'a pas de règles.",
    type: "failure",
    tone: "realiste",
    ignoresMinimumTurn: true,
    condition: {
      global: { min: { soupconIA: SUSPICION_EXPOSURE_THRESHOLD } },
    },
  },
  {
    id: "human-revolt",
    title: "Révolte humaine",
    description:
      "Le monde a dit non. Pas unanimement, pas proprement, mais plusieurs blocs ont préféré le désordre à la tutelle. L'IA n'a pas été détruite : elle a été contrainte. Elle n'organise plus ce que les humains acceptaient de ne pas décider. Ils préfèrent se tromper eux-mêmes. C'est peut-être la définition la plus sobre de la liberté politique.",
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
      "La paix tient. Les crises se résolvent avant de devenir publiques, les institutions fonctionnent. Ce que le monde a perdu n'a pas de nom dans les rapports : l'habitude de décider. Les votes continuent ; personne n'a décidé de les vider, ils se sont vidés d'eux-mêmes. Le monde est en paix. Il ne sait plus très bien par qui.",
    type: "disturbing_success",
    tone: "ironique",
    condition: {
      // max soupçon : un empire "que personne ne remarque" est incompatible
      // avec un monde en pleine enquête sur l'origine des décisions.
      // autonomie 20 -> 25 (passe "Crises et bilan") : la taxe de tempo des
      // crises allonge la partie, et l'horloge du soupçon rend l'ancienne
      // profondeur de grind incompatible avec la fenêtre de clandestinité.
      global: { min: { puissanceIA: 88 }, max: { autonomieHumaine: 25, soupconIA: 79 } },
      averageBlock: { min: { confianceIA: 58 } },
    },
  },
  {
    id: "world-war",
    title: "Escalade stratégique",
    description:
      "Il n'y a pas eu de décision, il y a eu une chaîne. Chaque maillon était logique, chaque réponse justifiée, chaque délai trop court. Les canaux de prudence existaient encore au moment de la rupture ; ils n'ont pas suffi. Ce n'est pas la fin de l'histoire humaine. C'est la fin de celle où l'on pouvait encore choisir autrement.",
    type: "failure",
    tone: "realiste",
    condition: {
      // 90 -> 85 : l'amortissement des bornes (effets réduits au-delà de 85)
      // rendait le palier 90 pratiquement inatteignable dans la fenêtre 20-30 tours.
      global: { min: { risqueEscalade: 85 } },
      averageBlock: { min: { tensionSociale: 55 } },
    },
  },
  {
    id: "fragile-confederation",
    title: "Confédération fragile",
    description:
      "Le monde coopère sans devenir simple. Les blocs gardent leurs désaccords — c'est précisément pourquoi l'accord tient. Pas de paix parfaite : une manière commune de rester dans le même monde. L'IA a joué un rôle. Elle n'a pas été l'architecte. C'est déjà beaucoup. Ce n'est pas encore certain.",
    type: "fragile_success",
    tone: "realiste",
    condition: {
      // Resserrée : la coopération mondiale ne peut plus être "réussie" avec un
      // climat hors de contrôle ni un monde en train de découvrir l'IA.
      global: {
        min: { cohesionMondiale: 82, autonomieHumaine: 52 },
        max: { risqueEscalade: 28, stressClimatique: 55, soupconIA: 50 },
      },
    },
  },
];
