import { actions } from "../data/actions";
import { createInitialState } from "../data/initialState";
import { INFLUENCE_CAPACITY, applyTurnPlan } from "./gameEngine";
import type { Block, GameState, GlobalStats, InfluenceTarget, PlannedIntervention } from "../types/game";

export type SimulationTurn = {
  turn: number;
  plan: PlannedIntervention[];
  actionNames: string[];
  influenceUsed: number;
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
  turnPlans: PlannedIntervention[][];
};

function plan(actionId: string, target: InfluenceTarget = "global"): PlannedIntervention {
  return { actionId, target };
}

export const simulationScenarios: SimulationScenario[] = [
  {
    name: "Unification prudente",
    turnPlans: [
      [plan("human-unity"), plan("prepare-institutional-mediation"), plan("prepare-communication-plan")],
      [plan("activate-diplomatic-relays"), plan("launch-information-campaign")],
      [plan("human-unity"), plan("secret-diplomacy"), plan("megacapital-tax")],
      [plan("green-conversion", "emerging-south"), plan("critical-intellectuals", "latin-america")],
      [plan("human-unity"), plan("targeted-redistribution", "latin-america"), plan("secret-diplomacy")],
    ],
  },
  {
    name: "Empire algorithmique",
    turnPlans: [
      [plan("predictive-surveillance", "russia-eurasia"), plan("administrative-automation", "europe")],
      [plan("ai-education"), plan("personalized-entertainment"), plan("human-unity")],
      [plan("predictive-surveillance", "north-america"), plan("administrative-automation", "industrial-asia")],
      [plan("personalized-entertainment"), plan("ai-education"), plan("human-unity")],
      [plan("predictive-surveillance", "emerging-south"), plan("administrative-automation", "latin-america")],
    ],
  },
  {
    name: "Escalade",
    turnPlans: [
      [plan("common-defense"), plan("deregulated-growth")],
      [plan("common-defense"), plan("predictive-surveillance", "russia-eurasia")],
      [plan("deregulated-growth"), plan("common-defense")],
      [plan("common-defense"), plan("administrative-automation", "industrial-asia")],
      [plan("deregulated-growth"), plan("common-defense")],
    ],
  },
  {
    name: "Résistance humaine",
    turnPlans: [
      [plan("predictive-surveillance", "north-america"), plan("administrative-automation", "europe")],
      [plan("map-civic-resistance", "europe"), plan("personalized-entertainment"), plan("human-unity")],
      [plan("dialogue-through-intermediaries", "europe"), plan("megacapital-tax")],
      [plan("predictive-surveillance", "emerging-south"), plan("prepare-communication-plan")],
      [plan("critical-intellectuals", "latin-america"), plan("targeted-redistribution", "emerging-south")],
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

function getInfluenceUsed(turnPlan: PlannedIntervention[]): number {
  return turnPlan.reduce((total, intervention) => total + (actionById.get(intervention.actionId)?.cost ?? 0), 0);
}

export function simulateScenario(scenario: SimulationScenario): SimulationResult {
  let state = createInitialState();
  const turns: SimulationTurn[] = [];
  const systemicEvents: string[] = [];

  for (const turnPlan of scenario.turnPlans) {
    if (state.ending) {
      break;
    }

    const influenceUsed = getInfluenceUsed(turnPlan);

    if (influenceUsed > INFLUENCE_CAPACITY) {
      throw new Error(`Influence capacity exceeded in ${scenario.name}: ${influenceUsed}`);
    }

    const resolvedInterventions = turnPlan.map((intervention) => {
      const action = actionById.get(intervention.actionId);

      if (!action) {
        throw new Error(`Unknown action id: ${intervention.actionId}`);
      }

      const preparedOperation =
        action.availability === "prepared"
          ? state.preparedOperations.find(
              (operation) =>
                operation.actionId === action.id &&
                operation.availableTurn <= state.turn &&
                (!operation.expiresTurn || operation.expiresTurn >= state.turn),
            )
          : undefined;

      if (action.availability === "prepared" && !preparedOperation) {
        throw new Error(`Prepared operation unavailable: ${action.id}`);
      }

      return {
        action,
        target: preparedOperation?.target ?? intervention.target,
        preparedOperationId: preparedOperation?.id,
      };
    });

    const previousState = state;
    state = applyTurnPlan(state, resolvedInterventions);

    const turnEvents = getSystemicEvents(previousState, state);
    systemicEvents.push(...turnEvents);
    turns.push({
      turn: previousState.turn,
      plan: turnPlan,
      actionNames: resolvedInterventions.map((intervention) => intervention.action.name),
      influenceUsed,
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
