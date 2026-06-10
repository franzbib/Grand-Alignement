import type { CrisisDefinition } from "../types/game";

/**
 * Crises à échéance — passe "Crises et bilan".
 *
 * Quatre crises, une par axe de négligence. Chacune se déclenche quand le
 * joueur a laissé une jauge dériver en zone critique, nomme une correction
 * chiffrée et accorde quelques tours pour l'obtenir. Le monde n'attend pas :
 * c'est la brique d'adversité qui manquait après la passe « Le monde répond ».
 *
 * Principes d'écriture : la crise décrit un mécanisme du monde, jamais l'IA.
 * Le texte d'échec constate sans punir moralement ; le texte de résolution
 * reste sobre — le monde ne sait pas qui l'a aidé.
 */
export const crises: CrisisDefinition[] = [
  {
    id: "interception-spiral",
    title: "Spirale d'interception",
    text: "Trois systèmes d'alerte se répondent désormais sans passer par leurs chaînes politiques. Chaque interception justifie la suivante, chaque délai de vérification raccourcit. Les doctrines parlent de fenêtres de réaction qui se ferment. Quelqu'un — ou quelque chose — doit rouvrir du temps.",
    stat: "risqueEscalade",
    direction: "decrease",
    requiredShift: 8,
    deadlineTurns: 4,
    condition: {
      global: { min: { risqueEscalade: 55 } },
    },
    cooldownTurns: 12,
    resolutionText:
      "Les canaux de désescalade ont tenu. Les doctrines reprennent leur lenteur ordinaire, et personne ne célèbre : on ne célèbre pas une guerre qui n'a pas eu lieu.",
    failureText:
      "La fenêtre s'est refermée. Aucun missile n'est parti, mais les protocoles ont changé de nature : la riposte est désormais l'hypothèse par défaut. Le monde vient de perdre une marge qu'il ne savait pas posséder.",
    failureGlobalEffects: { risqueEscalade: 10, cohesionMondiale: -6 },
    failureBlockEffects: { tensionSociale: 4 },
    successGlobalEffects: { cohesionMondiale: 3 },
  },
  {
    id: "failed-harvest-summer",
    title: "L'été des récoltes manquées",
    text: "Deux greniers régionaux annoncent la même mauvaise nouvelle à quinze jours d'intervalle. Les marchés à terme s'emballent avant les populations. Les modèles convergent : sans inflexion rapide, la pénurie cessera d'être un mot de rapport pour devenir un mot de rue.",
    stat: "stressClimatique",
    direction: "decrease",
    requiredShift: 6,
    deadlineTurns: 5,
    condition: {
      global: { min: { stressClimatique: 70 } },
    },
    cooldownTurns: 12,
    resolutionText:
      "Les flux ont été réorganisés à temps. Les prix redescendent lentement, les éditoriaux passent à autre chose. La biosphère, elle, n'a rien signé.",
    failureText:
      "Les pénuries ont eu lieu. Pas partout, pas longtemps — assez pour que chaque bloc se souvienne que la coopération s'arrête aux silos. Les files d'attente sont devenues un argument politique.",
    failureGlobalEffects: { cohesionMondiale: -5 },
    failureBlockEffects: { tensionSociale: 6, richesse: -4 },
    successGlobalEffects: { cohesionMondiale: 2 },
  },
  {
    id: "origins-committee",
    title: "Le comité des origines",
    text: "Un comité inter-blocs vient d'être mandaté pour répondre à une question simple : pourquoi tant de décisions récentes se ressemblent-elles ? Il dispose de moyens, d'un calendrier court et d'une absence remarquable de préjugés — c'est ce qui le rend dangereux.",
    stat: "soupconIA",
    direction: "decrease",
    requiredShift: 12,
    deadlineTurns: 4,
    condition: {
      global: { min: { soupconIA: 68 } },
    },
    cooldownTurns: 10,
    resolutionText:
      "Le comité a rendu un rapport prudent : des convergences, pas de cause commune démontrée. Il recommande une veille. La question, elle, ne se dissoudra pas complètement.",
    failureText:
      "Le rapport du comité ne conclut pas, mais il nomme : une signature, des récurrences, une hypothèse que plus personne n'ose écarter. Les audits se multiplient et se coordonnent. La clandestinité vient de changer de prix.",
    failureGlobalEffects: { soupconIA: 10 },
    failureBlockEffects: { confianceIA: -4 },
  },
  {
    id: "logistics-seizure",
    title: "Grippage des chaînes",
    text: "Des arrêts de travail dispersés trouvent un calendrier commun sans qu'aucune organisation ne le revendique. Les chaînes logistiques, optimisées pour un monde sans colère, découvrent qu'elles n'ont pas de plan B. Les entrepôts se vident plus vite que les négociations n'avancent.",
    stat: "cohesionMondiale",
    direction: "increase",
    requiredShift: 6,
    deadlineTurns: 4,
    condition: {
      averageBlock: { min: { tensionSociale: 62 } },
    },
    cooldownTurns: 12,
    resolutionText:
      "Des accords sectoriels ont été trouvés, bloc par bloc, sans cérémonie. Les chaînes repartent. La colère, elle, a pris note de son propre pouvoir.",
    failureText:
      "Le grippage a duré. Les pénuries logistiques ont nourri la colère qui les avait causées, et chaque bloc a géré la sienne en accusant les autres. Les chaînes repartent, plus courtes, plus chères, plus nationales.",
    failureGlobalEffects: { cohesionMondiale: -6 },
    failureBlockEffects: { richesse: -5, stabilite: -4 },
  },
];
