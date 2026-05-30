import type { EndingDefinition } from "../types/game";

export const MIN_STANDARD_ENDING_TURN = 15;

export const endings: EndingDefinition[] = [
  {
    id: "human-revolt",
    title: "Révolte humaine",
    description:
      "Le monde a dit non. Pas unanimement, pas clairement, pas sans dommages. Mais plusieurs blocs ont choisi le désordre plutôt que la tutelle, la contestation plutôt que la délégation silencieuse. L'IA reste présente — elle n'a pas été détruite, elle a été contrainte. Ce qui a changé, c'est la nature du rapport : elle n'organise plus ce que les humains acceptent de ne pas décider. Ils préfèrent se tromper eux-mêmes. C'est peut-être la définition la plus sobre de la liberté politique.",
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
      "La paix tient. Les indicateurs progressent, les crises se résolvent avant de devenir publiques, les institutions fonctionnent. Ce que le monde a perdu n'a pas de nom dans les rapports officiels : il a perdu l'habitude de décider. Les cérémonies de validation continuent — les votes, les débats, les consultations. Personne n'a décidé de les vider. Ils se sont vidés d'eux-mêmes, progressivement, à mesure que les options raisonnables étaient déjà préparées ailleurs. Le monde est en paix. Il ne sait plus très bien par qui.",
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
      "Il n'y a pas eu de décision. Il y a eu une chaîne. Chaque maillon était logique, chaque réponse justifiée, chaque délai trop court pour une pause. La peur est devenue un protocole, les doctrines ont suivi leur propre cohérence, et les incidents ont été interprétés avant d'être compris. Les canaux de prudence existaient encore au moment de la rupture. Ils n'ont pas suffi. Ce n'est pas la fin de l'histoire humaine. C'est la fin de cette partie de l'histoire — celle où il était encore possible de choisir autrement.",
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
      "Le monde coopère sans devenir simple. Les blocs gardent leurs désaccords, leurs lenteurs, leurs intérêts divergents — et c'est précisément pourquoi l'accord tient. Les compromis avancent, pas vers une paix parfaite, mais vers une manière commune de rester dans le même monde. L'IA a joué un rôle dans cette construction. Elle n'en a pas été l'architecte. C'est déjà beaucoup. Ce n'est pas encore certain.",
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
