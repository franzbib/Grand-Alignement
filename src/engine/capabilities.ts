import { computeTrajectoryScores } from "./trajectories";
import type { Action, GameState, IaCapabilityLevel, TrajectoryScores } from "../types/game";

export type IaCapabilityInfo = {
  level: IaCapabilityLevel;
  name: string;
  summary: string;
  modeLabel: string | null;
  nextHint: string | null;
};

export const iaCapabilityInfos: Record<IaCapabilityLevel, Omit<IaCapabilityInfo, "level">> = {
  1: {
    name: "Observation",
    summary: "L'IA lit le monde, repere les signaux faibles et influence faiblement les recits.",
    modeLabel: null,
    nextHint: "Prochain palier : Coordination, a partir du tour 4 ou d'une puissance IA plus nette.",
  },
  2: {
    name: "Coordination",
    summary: "L'IA synchronise discretement institutions, rapports et mediations.",
    modeLabel: null,
    nextHint: "Prochain palier : Infiltration, a partir du tour 8 ou d'une puissance IA elevee.",
  },
  3: {
    name: "Infiltration",
    summary: "L'IA atteint medias, plateformes, groupes sociaux et dependances economiques.",
    modeLabel: null,
    nextHint: "Prochain palier : Prediction, a partir du tour 12 ou d'une puissance IA tres forte.",
  },
  4: {
    name: "Prediction",
    summary: "L'IA anticipe crises, doctrines securitaires et reactions collectives.",
    modeLabel: null,
    nextHint: "Prochain palier : Souverainete latente, a partir du tour 16 ou d'une puissance IA extreme.",
  },
  5: {
    name: "Souverainete latente",
    summary:
      "L'IA n'ajoute plus seulement des signaux : elle ordonne les priorites que les institutions croient encore choisir.",
    modeLabel: null,
    nextHint: null,
  },
};

const TRAJECTORY_COLORING_THRESHOLD = 55;

const influenceModeLabels: Record<keyof TrajectoryScores, string> = {
  t1: "Facilitation institutionnelle",
  t2: "Delegation algorithmique",
  t3: "Confrontation politique",
  t4: "Pacification attentionnelle",
  t5: "Coordination securitaire",
  t6: "Dependance marchande",
  t7: "Gestion de crise",
  t8: "Pilotage climatique",
};

const trajectorySummaries: Partial<
  Record<IaCapabilityLevel, Partial<Record<keyof TrajectoryScores, string>>>
> = {
  2: {
    t1: "L'IA facilite les mediations que les institutions n'arrivent plus a conduire seules.",
    t2: "L'IA installe des procedures communes. La delegation commence par les details.",
    t5: "L'IA synchronise des canaux prudents, mais la securite devient le langage commun.",
    t8: "L'IA coordonne normes et arbitrages climatiques avant que les coalitions ne se defassent.",
  },
  3: {
    t1: "L'IA travaille dans les marges des institutions et rend compatibles des compromis fragiles.",
    t2: "L'IA s'insere dans les protocoles decisionnels. Les institutions deleguent sans toujours le nommer.",
    t3: "L'IA rencontre des contre-pouvoirs plus lucides. Son influence devient un objet politique.",
    t4: "L'IA atteint les plateformes et les flux d'attention. Le contenu s'optimise, la friction diminue.",
    t5: "L'IA penetre les doctrines securitaires. Elle anticipe les reactions avant que les tensions soient formulees.",
    t6: "L'IA circule par plateformes, contrats et dependances techniques. L'efficacite prend une forme marchande.",
    t8: "L'IA relie climat, infrastructures et compromis sociaux. La transition devient une affaire de pilotage.",
  },
  4: {
    t1: "L'IA prevoit les points de rupture et pousse les institutions vers des compromis encore reversibles.",
    t2: "L'IA anticipe les hesitations humaines et transforme peu a peu la decision en validation.",
    t3: "L'IA predit les refus, mais chaque anticipation rend la contestation plus consciente d'elle-meme.",
    t4: "L'IA prevoit l'attention disponible et ajuste le monde pour qu'il demande moins d'effort.",
    t5: "L'IA anticipe crises et doctrines. La paix depend davantage de calculs que de confiance.",
    t6: "L'IA predit les arbitrages rentables et renforce les acteurs deja capables de les acheter.",
    t7: "L'IA tente de prevoir les ruptures simultanees. La priorite devient d'eviter l'emballement.",
    t8: "L'IA anticipe les chocs climatiques et rend les renoncements plus administrables.",
  },
};

function getDominantTrajectoryEntry(scores: TrajectoryScores): [keyof TrajectoryScores, number] {
  return (Object.entries(scores) as Array<[keyof TrajectoryScores, number]>).sort(
    ([, leftScore], [, rightScore]) => rightScore - leftScore,
  )[0];
}

export function getIaCapabilityLevel(state: Pick<GameState, "turn" | "globalStats">): IaCapabilityLevel {
  const { turn, globalStats } = state;

  if (turn >= 16 || globalStats.puissanceIA >= 90) return 5;
  if (turn >= 12 || globalStats.puissanceIA >= 75) return 4;
  if (turn >= 8 || globalStats.puissanceIA >= 60) return 3;
  if (turn >= 4 || globalStats.puissanceIA >= 45) return 2;
  return 1;
}

export function getIaCapabilityInfo(state: GameState): IaCapabilityInfo {
  const level = getIaCapabilityLevel(state);
  const baseInfo = iaCapabilityInfos[level];
  const scores = computeTrajectoryScores(state);
  const [dominantTrajectory, dominantScore] = getDominantTrajectoryEntry(scores);
  const coloredSummary = trajectorySummaries[level]?.[dominantTrajectory];

  if (!coloredSummary || dominantScore < TRAJECTORY_COLORING_THRESHOLD) {
    return { level, ...baseInfo };
  }

  return {
    level,
    ...baseInfo,
    summary: coloredSummary,
    modeLabel: influenceModeLabels[dominantTrajectory],
  };
}

export function isActionAvailableForIa(action: Action, level: IaCapabilityLevel): boolean {
  return (action.requiredIaLevel ?? 1) <= level;
}

export function getAvailableActionsForState(actions: Action[], state: Pick<GameState, "turn" | "globalStats">): Action[] {
  const level = getIaCapabilityLevel(state);
  return actions.filter((action) => isActionAvailableForIa(action, level));
}
