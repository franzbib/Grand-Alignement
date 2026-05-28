import { initialBlocks } from "./blocks";
import type { GameState, GlobalStats } from "../types/game";

export const initialGlobalStats: GlobalStats = {
  cohesionMondiale: 52,
  risqueEscalade: 35,
  autonomieHumaine: 68,
  stressClimatique: 56,
  puissanceIA: 34,
};

export function createInitialState(): GameState {
  return {
    turn: 1,
    globalStats: { ...initialGlobalStats },
    blocks: structuredClone(initialBlocks),
    journal: [
      {
        id: "opening",
        turn: 0,
        title: "Activation",
        text: "Vous êtes branchée au monde. Six blocs observent vos premiers calculs avec une confiance très variable.",
      },
    ],
    ending: null,
  };
}
