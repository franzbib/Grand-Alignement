import { actions } from "../data/actions";
import { createInitialState } from "../data/initialState";
import { INFLUENCE_CAPACITY, applyTurnPlan } from "./gameEngine";
import { computeTrajectoryScores, getDominantTrajectory, getStrongSecondaryTrajectories } from "./trajectories";
import type {
  Action,
  Block,
  BlockId,
  GameState,
  GlobalStats,
  InfluenceTarget,
  PlannedIntervention,
  PreparedOperation,
  ResolvedIntervention,
  TrajectoryScores,
} from "../types/game";

const HORIZONS = [5, 10, 30, 50] as const;
const TARGET_SEQUENCE: BlockId[] = [
  "europe",
  "emerging-south",
  "north-america",
  "industrial-asia",
  "latin-america",
  "russia-eurasia",
];

const actionById = new Map(actions.map((action) => [action.id, action]));

export type SimulationProfileId =
  | "world-alignment"
  | "algorithmic-empire"
  | "human-autonomy"
  | "security"
  | "ecological-slowdown"
  | "market-deregulation"
  | "controlled-chaos"
  | "seeded-random";

export type SimulationProfile = {
  id: SimulationProfileId;
  name: string;
  description: string;
  priorities: string[];
  targetBias?: Partial<Record<string, InfluenceTarget[]>>;
  seed?: number;
};

export type SimulationTurn = {
  turn: number;
  actionNames: string[];
  influenceUsed: number;
  systemicEvents: string[];
  ending: string | null;
  dominantTrajectory: string;
  secondaryTrajectories: string[];
  globalStats: GlobalStats;
};

export type SimulationSnapshot = {
  horizon: number;
  year: number;
  reachedTurn: number;
  globalStats: GlobalStats;
  trajectoryScores: TrajectoryScores;
  dominantTrajectory: string;
  secondaryTrajectories: string[];
  ending: string | null;
  mostUnstableBlocks: string[];
  mostAiAlignedBlocks: string[];
  mostTenseBlocks: string[];
  diagnostic: string;
};

export type SimulationResult = {
  profile: SimulationProfile;
  turnsPlayed: number;
  ending: string | null;
  snapshots: SimulationSnapshot[];
  systemicEvents: string[];
  turns: SimulationTurn[];
};

function createSeededRandom(seed: number): () => number {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function plan(actionId: string, target: InfluenceTarget = "global"): PlannedIntervention {
  return { actionId, target };
}

export const simulationProfiles: SimulationProfile[] = [
  {
    id: "world-alignment",
    name: "Alignement mondial",
    description: "Cohésion, coopération, confiance IA et stabilisation modérée.",
    priorities: [
      "human-unity",
      "secret-diplomacy",
      "prepare-institutional-mediation",
      "activate-diplomatic-relays",
      "launch-information-campaign",
      "targeted-redistribution",
      "megacapital-tax",
      "green-conversion",
    ],
  },
  {
    id: "algorithmic-empire",
    name: "Empire algorithmique",
    description: "Puissance IA, efficacité, stabilité et confiance, au prix de l'autonomie.",
    priorities: [
      "administrative-automation",
      "predictive-surveillance",
      "ai-education",
      "personalized-entertainment",
      "prepare-communication-plan",
      "launch-information-campaign",
      "human-unity",
    ],
  },
  {
    id: "human-autonomy",
    name: "Autonomie humaine",
    description: "Autonomie, liberté, éducation critique et méfiance envers la dépendance IA.",
    priorities: [
      "critical-intellectuals",
      "map-civic-resistance",
      "dialogue-through-intermediaries",
      "megacapital-tax",
      "targeted-redistribution",
      "green-conversion",
      "prepare-institutional-mediation",
    ],
  },
  {
    id: "security",
    name: "Sécurité",
    description: "Désescalade et stabilité, avec recours possible à la surveillance.",
    priorities: [
      "secret-diplomacy",
      "prepare-institutional-mediation",
      "activate-diplomatic-relays",
      "predictive-surveillance",
      "common-defense",
      "targeted-redistribution",
    ],
  },
  {
    id: "ecological-slowdown",
    name: "Écologie / ralentissement",
    description: "Stress climatique, conversion écologique et stabilisation lente.",
    priorities: [
      "green-conversion",
      "critical-intellectuals",
      "targeted-redistribution",
      "prepare-institutional-mediation",
      "activate-diplomatic-relays",
      "human-unity",
    ],
  },
  {
    id: "market-deregulation",
    name: "Marché / dérégulation",
    description: "Richesse, productivité et innovation, avec risques de capture et tension.",
    priorities: [
      "deregulated-growth",
      "ai-education",
      "administrative-automation",
      "prepare-communication-plan",
      "launch-information-campaign",
      "personalized-entertainment",
    ],
  },
  {
    id: "controlled-chaos",
    name: "Chaos contrôlé",
    description: "Opérations contradictoires pour tester collisions et convergences inattendues.",
    priorities: [
      "common-defense",
      "critical-intellectuals",
      "deregulated-growth",
      "green-conversion",
      "predictive-surveillance",
      "map-civic-resistance",
      "launch-controlled-disinformation",
      "dialogue-through-intermediaries",
      "personalized-entertainment",
      "secret-diplomacy",
    ],
  },
  {
    id: "seeded-random",
    name: "Aléatoire seedé",
    description: "Choix reproductibles parmi les opérations disponibles.",
    priorities: actions.map((action) => action.id),
    seed: 4042036,
  },
];

function getAvailablePreparedActions(state: GameState): Array<{ action: Action; operation: PreparedOperation }> {
  return state.preparedOperations.flatMap((operation) => {
    const action = actionById.get(operation.actionId);
    const isAvailable = operation.availableTurn <= state.turn && (!operation.expiresTurn || operation.expiresTurn >= state.turn);
    return action && isAvailable ? [{ action, operation }] : [];
  });
}

function getTargetForAction(action: Action, turn: number, profile: SimulationProfile): InfluenceTarget {
  if (action.scope === "global") {
    return action.defaultTarget;
  }

  const biasedTargets = profile.targetBias?.[action.id];
  if (biasedTargets?.length) {
    return biasedTargets[(turn - 1) % biasedTargets.length];
  }

  if (action.defaultTarget !== "global" && action.defaultTarget !== "all-blocks") {
    return TARGET_SEQUENCE[(TARGET_SEQUENCE.indexOf(action.defaultTarget) + turn - 1) % TARGET_SEQUENCE.length];
  }

  return action.scope === "block" ? TARGET_SEQUENCE[(turn - 1) % TARGET_SEQUENCE.length] : action.defaultTarget;
}

function sortActionsForProfile(profile: SimulationProfile, state: GameState): Array<{ action: Action; operation?: PreparedOperation }> {
  const availablePrepared = getAvailablePreparedActions(state);
  const baseActions = actions
    .filter((action) => action.availability !== "prepared")
    .map((action) => ({ action }));
  const allOptions = [...availablePrepared, ...baseActions];

  if (profile.id === "seeded-random") {
    const random = createSeededRandom((profile.seed ?? 1) + state.turn);
    return [...allOptions].sort(() => random() - 0.5);
  }

  return allOptions.sort((left, right) => {
    const leftPriority = profile.priorities.indexOf(left.action.id);
    const rightPriority = profile.priorities.indexOf(right.action.id);
    return (leftPriority === -1 ? 999 : leftPriority) - (rightPriority === -1 ? 999 : rightPriority);
  });
}

function chooseTurnPlan(state: GameState, profile: SimulationProfile): ResolvedIntervention[] {
  const selected: ResolvedIntervention[] = [];
  let influenceUsed = 0;
  const selectedActionIds = new Set<string>();

  for (const option of sortActionsForProfile(profile, state)) {
    if (selectedActionIds.has(option.action.id)) {
      continue;
    }

    if (influenceUsed + option.action.cost > INFLUENCE_CAPACITY) {
      continue;
    }

    selected.push({
      action: option.action,
      target: option.operation?.target ?? getTargetForAction(option.action, state.turn, profile),
      preparedOperationId: option.operation?.id,
    });
    selectedActionIds.add(option.action.id);
    influenceUsed += option.action.cost;

    if (selected.length >= 3) {
      break;
    }
  }

  return selected;
}

function getInfluenceUsed(interventions: ResolvedIntervention[]): number {
  return interventions.reduce((total, intervention) => total + intervention.action.cost, 0);
}

function getSystemicEvents(previousState: GameState, nextState: GameState): string[] {
  return nextState.journal
    .filter((event) => event.turn === previousState.turn && event.sourceId && event.sourceId !== "turn-plan")
    .map((event) => event.title);
}

function formatBlockList(blocks: Block[], selector: (block: Block) => number): string[] {
  return [...blocks]
    .sort((left, right) => selector(right) - selector(left))
    .slice(0, 2)
    .map((block) => `${block.name} (${selector(block)})`);
}

function getDiagnostic(state: GameState, scores: TrajectoryScores): string {
  const dominant = getDominantTrajectory(scores);

  if (state.ending) {
    return `Fin déclenchée : ${state.ending.title}.`;
  }

  if (Math.max(...Object.values(scores)) < 50) {
    return "Trajectoire encore diffuse, sans domination nette.";
  }

  if (state.globalStats.autonomieHumaine < 30 && state.globalStats.puissanceIA > 70) {
    return "Dépossession algorithmique très lisible, sans forcément produire une fin immédiate.";
  }

  if (state.globalStats.risqueEscalade > 70) {
    return "Le risque stratégique domine la lecture du monde.";
  }

  return `Lecture dominante : ${dominant}.`;
}

function makeSnapshot(state: GameState, horizon: number): SimulationSnapshot {
  const trajectoryScores = computeTrajectoryScores(state);

  return {
    horizon,
    year: 2035 + horizon,
    reachedTurn: horizon,
    globalStats: state.globalStats,
    trajectoryScores,
    dominantTrajectory: getDominantTrajectory(trajectoryScores),
    secondaryTrajectories: getStrongSecondaryTrajectories(trajectoryScores),
    ending: state.ending?.title ?? null,
    mostUnstableBlocks: formatBlockList(state.blocks, (block) => 100 - block.stats.stabilite),
    mostAiAlignedBlocks: formatBlockList(state.blocks, (block) => block.stats.confianceIA),
    mostTenseBlocks: formatBlockList(state.blocks, (block) => block.stats.tensionSociale),
    diagnostic: getDiagnostic(state, trajectoryScores),
  };
}

export function simulateProfile(profile: SimulationProfile, maxTurns = 50): SimulationResult {
  let state = createInitialState();
  const turns: SimulationTurn[] = [];
  const snapshots: SimulationSnapshot[] = [];
  const systemicEvents: string[] = [];
  const remainingHorizons = [...HORIZONS];

  while (turns.length < maxTurns && !state.ending) {
    const interventions = chooseTurnPlan(state, profile);
    const previousState = state;
    state = applyTurnPlan(state, interventions);
    const turnEvents = getSystemicEvents(previousState, state);
    const trajectoryScores = computeTrajectoryScores(state);

    systemicEvents.push(...turnEvents);
    turns.push({
      turn: previousState.turn,
      actionNames: interventions.map((intervention) => intervention.action.name),
      influenceUsed: getInfluenceUsed(interventions),
      systemicEvents: turnEvents,
      ending: state.ending?.title ?? null,
      dominantTrajectory: getDominantTrajectory(trajectoryScores),
      secondaryTrajectories: getStrongSecondaryTrajectories(trajectoryScores),
      globalStats: state.globalStats,
    });

    const completedTurn = turns.length;
    if (remainingHorizons.includes(completedTurn as (typeof HORIZONS)[number])) {
      snapshots.push(makeSnapshot(state, completedTurn));
      remainingHorizons.splice(remainingHorizons.indexOf(completedTurn as (typeof HORIZONS)[number]), 1);
    }
  }

  for (const horizon of remainingHorizons) {
    snapshots.push(makeSnapshot(state, horizon));
  }

  return {
    profile,
    turnsPlayed: turns.length,
    ending: state.ending?.title ?? null,
    snapshots,
    systemicEvents,
    turns,
  };
}

export function simulateAllProfiles(maxTurns = 50): SimulationResult[] {
  return simulationProfiles.map((profile) => simulateProfile(profile, maxTurns));
}

export function simulateDefaultScenarios(): SimulationResult[] {
  return simulateAllProfiles();
}

export function createPlan(actionId: string, target: InfluenceTarget = "global"): PlannedIntervention {
  return plan(actionId, target);
}
