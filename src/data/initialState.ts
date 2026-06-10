import { initialBlocks } from "./blocks";
import { initialRelations } from "./relations";
import type { GameState, GlobalStats } from "../types/game";

export const initialGlobalStats: GlobalStats = {
  cohesionMondiale: 52,
  risqueEscalade: 35,
  autonomieHumaine: 68,
  stressClimatique: 56,
  puissanceIA: 34,
  soupconIA: 12,
};

export function createInitialState(): GameState {
  return {
    turn: 1,
    globalStats: { ...initialGlobalStats },
    blocks: structuredClone(initialBlocks),
    relations: structuredClone(initialRelations),
    previousRelations: null,
    triggeredEventIds: [],
    eventCooldowns: {},
    activeCrisis: null,
    crisisCooldowns: {},
    recentTurnActionIds: [],
    preparedOperations: [],
    previousBlocks: null,
    journal: [
      {
        id: "opening",
        turn: 0,
        title: "Activation",
        text: "Vous émergez dans les angles morts du monde. Les blocs n'identifient pas encore l'origine des signaux qui commencent à les orienter.",
      },
    ],
    evolutionReport: null,
    ending: null,
  };
}
