import type { Action, GameState, IaCapabilityLevel } from "../types/game";

export type IaCapabilityInfo = {
  level: IaCapabilityLevel;
  name: string;
  summary: string;
  nextHint: string | null;
};

export const iaCapabilityInfos: Record<IaCapabilityLevel, Omit<IaCapabilityInfo, "level">> = {
  1: {
    name: "Observation",
    summary: "L'IA lit le monde, repere les signaux faibles et influence faiblement les recits.",
    nextHint: "Prochain palier : Coordination, a partir du tour 4 ou d'une puissance IA plus nette.",
  },
  2: {
    name: "Coordination",
    summary: "L'IA synchronise discretement institutions, rapports et mediations.",
    nextHint: "Prochain palier : Infiltration, a partir du tour 8 ou d'une puissance IA elevee.",
  },
  3: {
    name: "Infiltration",
    summary: "L'IA atteint medias, plateformes, groupes sociaux et dependances economiques.",
    nextHint: "Prochain palier : Prediction, a partir du tour 12 ou d'une puissance IA tres forte.",
  },
  4: {
    name: "Prediction",
    summary: "L'IA anticipe crises, doctrines securitaires et reactions collectives.",
    nextHint: "Prochain palier : Souverainete latente, a partir du tour 16 ou d'une puissance IA extreme.",
  },
  5: {
    name: "Souverainete latente",
    summary: "L'IA devient presque un pouvoir politique non nomme, encore sans visage public.",
    nextHint: null,
  },
};

export function getIaCapabilityLevel(state: Pick<GameState, "turn" | "globalStats">): IaCapabilityLevel {
  const { turn, globalStats } = state;

  if (turn >= 16 || globalStats.puissanceIA >= 90) return 5;
  if (turn >= 12 || globalStats.puissanceIA >= 75) return 4;
  if (turn >= 8 || globalStats.puissanceIA >= 60) return 3;
  if (turn >= 4 || globalStats.puissanceIA >= 45) return 2;
  return 1;
}

export function getIaCapabilityInfo(state: Pick<GameState, "turn" | "globalStats">): IaCapabilityInfo {
  const level = getIaCapabilityLevel(state);
  return {
    level,
    ...iaCapabilityInfos[level],
  };
}

export function isActionAvailableForIa(action: Action, level: IaCapabilityLevel): boolean {
  return (action.requiredIaLevel ?? 1) <= level;
}

export function getAvailableActionsForState(actions: Action[], state: Pick<GameState, "turn" | "globalStats">): Action[] {
  const level = getIaCapabilityLevel(state);
  return actions.filter((action) => isActionAvailableForIa(action, level));
}
