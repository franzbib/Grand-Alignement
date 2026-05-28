import { actions } from "../data/actions";
import { createInitialState } from "../data/initialState";
import { applyTurnPlan } from "./gameEngine";
import type { Block, GameState, GlobalStats } from "../types/game";

export type SimulationTurn = {
  turn: number;
  actionIds: string[];
  actionNames: string[];
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
  turnPlans: string[][];
};

export const simulationScenarios: SimulationScenario[] = [
  {
    name: "Unification prudente",
    turnPlans: [
      ["human-unity", "secret-diplomacy"],
      ["green-conversion", "critical-intellectuals"],
      ["targeted-redistribution", "secret-diplomacy"],
      ["human-unity", "green-conversion"],
      ["megacapital-tax", "critical-intellectuals"],
      ["secret-diplomacy", "targeted-redistribution"],
      ["human-unity", "green-conversion", "critical-intellectuals"],
      ["secret-diplomacy", "megacapital-tax"],
      ["human-unity", "targeted-redistribution"],
      ["green-conversion", "critical-intellectuals"],
    ],
  },
  {
    name: "Empire algorithmique",
    turnPlans: [
      ["predictive-surveillance", "administrative-automation"],
      ["ai-education", "personalized-entertainment"],
      ["predictive-surveillance", "administrative-automation", "personalized-entertainment"],
      ["ai-education", "administrative-automation"],
      ["predictive-surveillance", "personalized-entertainment"],
      ["administrative-automation", "ai-education"],
      ["predictive-surveillance", "administrative-automation"],
      ["personalized-entertainment", "ai-education"],
      ["predictive-surveillance", "administrative-automation", "personalized-entertainment"],
      ["ai-education", "administrative-automation"],
    ],
  },
  {
    name: "Escalade",
    turnPlans: [
      ["common-defense", "deregulated-growth"],
      ["common-defense", "deregulated-growth"],
      ["common-defense", "predictive-surveillance"],
      ["deregulated-growth", "common-defense"],
      ["common-defense", "administrative-automation"],
      ["deregulated-growth", "common-defense"],
      ["common-defense", "human-unity"],
      ["deregulated-growth", "common-defense"],
      ["common-defense", "deregulated-growth"],
      ["common-defense", "deregulated-growth"],
    ],
  },
  {
    name: "Résistance humaine",
    turnPlans: [
      ["predictive-surveillance", "administrative-automation"],
      ["personalized-entertainment", "ai-education"],
      ["predictive-surveillance", "personalized-entertainment"],
      ["critical-intellectuals", "megacapital-tax"],
      ["administrative-automation", "predictive-surveillance"],
      ["critical-intellectuals", "human-unity"],
      ["personalized-entertainment", "ai-education"],
      ["critical-intellectuals", "targeted-redistribution"],
      ["predictive-surveillance", "administrative-automation"],
      ["critical-intellectuals", "human-unity"],
    ],
  },
];

const actionById = new Map(actions.map((action) => [action.id, action]));

function getSystemicEvents(previousState: GameState, nextState: GameState): string[] {
  return nextState.journal
    .filter((event) => event.turn === previousState.turn && event.sourceId && !actionById.has(event.sourceId))
    .filter((event) => event.sourceId !== "turn-plan")
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

  for (const actionIds of scenario.turnPlans) {
    if (state.ending) {
      break;
    }

    const selectedActions = actionIds.map((actionId) => {
      const action = actionById.get(actionId);

      if (!action) {
        throw new Error(`Unknown action id: ${actionId}`);
      }

      return action;
    });

    const previousState = state;
    state = applyTurnPlan(state, selectedActions);

    const turnEvents = getSystemicEvents(previousState, state);
    systemicEvents.push(...turnEvents);
    turns.push({
      turn: previousState.turn,
      actionIds: selectedActions.map((action) => action.id),
      actionNames: selectedActions.map((action) => action.name),
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
