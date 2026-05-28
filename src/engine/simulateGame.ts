import { actions } from "../data/actions";
import { createInitialState } from "../data/initialState";
import { applyAction } from "./gameEngine";
import type { Block, GameState, GlobalStats } from "../types/game";

export type SimulationTurn = {
  turn: number;
  actionId: string;
  actionName: string;
  systemicEvents: string[];
  ending: string | null;
  globalStats: GlobalStats;
};

export type SimulationResult = {
  name: string;
  turnsPlayed: number;
  ending: string | null;
  finalGlobalStats: GlobalStats;
  mostUnstableBlocks: Array<Pick<Block, "id" | "name" | "stats">>;
  systemicEvents: string[];
  turns: SimulationTurn[];
};

export type SimulationScenario = {
  name: string;
  actionIds: string[];
};

export const simulationScenarios: SimulationScenario[] = [
  {
    name: "Unification prudente",
    actionIds: [
      "human-unity",
      "secret-diplomacy",
      "green-conversion",
      "critical-intellectuals",
      "targeted-redistribution",
      "human-unity",
      "secret-diplomacy",
      "green-conversion",
      "critical-intellectuals",
      "megacapital-tax",
      "human-unity",
      "secret-diplomacy",
      "green-conversion",
      "targeted-redistribution",
      "critical-intellectuals",
    ],
  },
  {
    name: "Empire algorithmique",
    actionIds: [
      "predictive-surveillance",
      "administrative-automation",
      "ai-education",
      "personalized-entertainment",
      "predictive-surveillance",
      "administrative-automation",
      "personalized-entertainment",
      "ai-education",
      "predictive-surveillance",
      "administrative-automation",
      "personalized-entertainment",
      "ai-education",
      "predictive-surveillance",
      "administrative-automation",
      "personalized-entertainment",
    ],
  },
  {
    name: "Escalade",
    actionIds: [
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
      "deregulated-growth",
      "common-defense",
    ],
  },
  {
    name: "Résistance humaine",
    actionIds: [
      "predictive-surveillance",
      "administrative-automation",
      "personalized-entertainment",
      "critical-intellectuals",
      "predictive-surveillance",
      "ai-education",
      "critical-intellectuals",
      "administrative-automation",
      "personalized-entertainment",
      "critical-intellectuals",
      "predictive-surveillance",
      "critical-intellectuals",
      "administrative-automation",
      "critical-intellectuals",
      "personalized-entertainment",
    ],
  },
];

const actionById = new Map(actions.map((action) => [action.id, action]));

function getSystemicEvents(previousState: GameState, nextState: GameState): string[] {
  return nextState.journal
    .filter((event) => event.turn === previousState.turn && event.sourceId && !actionById.has(event.sourceId))
    .map((event) => event.title);
}

function getMostUnstableBlocks(state: GameState): Array<Pick<Block, "id" | "name" | "stats">> {
  return [...state.blocks]
    .sort((left, right) => {
      const rightRisk = right.stats.tensionSociale + (100 - right.stats.stabilite);
      const leftRisk = left.stats.tensionSociale + (100 - left.stats.stabilite);
      return rightRisk - leftRisk;
    })
    .slice(0, 2)
    .map((block) => ({ id: block.id, name: block.name, stats: block.stats }));
}

export function simulateScenario(scenario: SimulationScenario): SimulationResult {
  let state = createInitialState();
  const turns: SimulationTurn[] = [];
  const systemicEvents: string[] = [];

  for (const actionId of scenario.actionIds) {
    if (state.ending) {
      break;
    }

    const action = actionById.get(actionId);

    if (!action) {
      throw new Error(`Unknown action id: ${actionId}`);
    }

    const previousState = state;
    state = applyAction(state, action);

    const turnEvents = getSystemicEvents(previousState, state);
    systemicEvents.push(...turnEvents);
    turns.push({
      turn: previousState.turn,
      actionId: action.id,
      actionName: action.name,
      systemicEvents: turnEvents,
      ending: state.ending?.title ?? null,
      globalStats: state.globalStats,
    });
  }

  return {
    name: scenario.name,
    turnsPlayed: turns.length,
    ending: state.ending?.title ?? null,
    finalGlobalStats: state.globalStats,
    mostUnstableBlocks: getMostUnstableBlocks(state),
    systemicEvents,
    turns,
  };
}

export function simulateDefaultScenarios(): SimulationResult[] {
  return simulationScenarios.map(simulateScenario);
}
