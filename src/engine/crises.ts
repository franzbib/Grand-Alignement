import { crises } from "../data/crises";
import type {
  ActiveCrisis,
  BlockStats,
  CrisisDefinition,
  Event,
  GameState,
  GlobalStats,
  StatDelta,
} from "../types/game";

/**
 * Crises à échéance — passe "Crises et bilan".
 *
 * Le cycle de vie d'une crise est évalué chaque tour, dans cet ordre :
 * 1. Si une crise est active : résolue si la jauge a atteint la cible,
 *    échouée si l'échéance est dépassée, sinon elle continue.
 * 2. Si aucune crise n'est active : une nouvelle peut se déclencher si ses
 *    conditions sont réunies et sa recharge écoulée. Une seule à la fois,
 *    pour que l'ultimatum reste lisible.
 *
 * Le module est pur : il reçoit l'état, rend un verdict et des effets, et ne
 * touche à rien lui-même.
 */

export type CrisisUpdate = {
  activeCrisis: ActiveCrisis | null;
  crisisCooldowns: Record<string, number>;
  globalEffects: StatDelta<GlobalStats>;
  blockEffects: StatDelta<BlockStats>;
  journalEvents: Event[];
  worldSignals: string[];
};

export function getCrisisDefinition(definitionId: string): CrisisDefinition | null {
  return crises.find((crisis) => crisis.id === definitionId) ?? null;
}

export function isCrisisResolved(crisis: ActiveCrisis, globalStats: GlobalStats): boolean {
  const definition = getCrisisDefinition(crisis.definitionId);

  if (!definition) {
    return true;
  }

  const currentValue = globalStats[definition.stat];

  return definition.direction === "decrease" ? currentValue <= crisis.targetValue : currentValue >= crisis.targetValue;
}

export function describeCrisisRequirement(crisis: ActiveCrisis): string {
  const definition = getCrisisDefinition(crisis.definitionId);

  if (!definition) {
    return "";
  }

  const verb = definition.direction === "decrease" ? "Ramener" : "Porter";
  const statLabels: Record<keyof GlobalStats, string> = {
    cohesionMondiale: "la cohésion mondiale",
    risqueEscalade: "le risque d'escalade",
    autonomieHumaine: "l'autonomie humaine",
    stressClimatique: "le stress climatique",
    puissanceIA: "la puissance IA",
    soupconIA: "le soupçon IA",
  };

  return `${verb} ${statLabels[definition.stat]} à ${crisis.targetValue} avant la fin du tour ${crisis.deadlineTurn}.`;
}

function createCrisisEvent(definition: CrisisDefinition, turn: number, kind: "trigger" | "success" | "failure"): Event {
  const text =
    kind === "trigger" ? definition.text : kind === "success" ? definition.resolutionText : definition.failureText;
  const titlePrefix = kind === "trigger" ? "Crise — " : kind === "success" ? "Crise résolue — " : "Crise manquée — ";

  return {
    id: `crisis-${definition.id}-${kind}-${turn}`,
    sourceId: `crisis-${definition.id}`,
    turn,
    title: `${titlePrefix}${definition.title}`,
    text,
    tone: "realiste",
  };
}

function computeTargetValue(definition: CrisisDefinition, baselineValue: number): number {
  const shifted =
    definition.direction === "decrease" ? baselineValue - definition.requiredShift : baselineValue + definition.requiredShift;

  return Math.max(0, Math.min(100, shifted));
}

function canTriggerCrisis(
  state: GameState,
  definition: CrisisDefinition,
  matchesCondition: (definition: CrisisDefinition) => boolean,
): boolean {
  const lastTriggeredTurn = state.crisisCooldowns[definition.id];

  if (lastTriggeredTurn !== undefined && state.turn - lastTriggeredTurn < definition.cooldownTurns) {
    return false;
  }

  return matchesCondition(definition);
}

/**
 * Évalue le cycle de vie des crises pour le tour en cours.
 *
 * @param state état du début de tour (pour la recharge et la crise active)
 * @param nextGlobalStats jauges globales après actions et dérive du tour
 * @param nextTurn numéro du tour qui s'ouvre
 * @param matchesCondition prédicat de déclenchement fourni par le moteur
 *        principal (réutilise le gabarit de conditions des événements)
 */
export function advanceCrises(
  state: GameState,
  nextGlobalStats: GlobalStats,
  nextTurn: number,
  matchesCondition: (definition: CrisisDefinition) => boolean,
): CrisisUpdate {
  const update: CrisisUpdate = {
    activeCrisis: state.activeCrisis,
    crisisCooldowns: state.crisisCooldowns,
    globalEffects: {},
    blockEffects: {},
    journalEvents: [],
    worldSignals: [],
  };

  if (state.activeCrisis) {
    const definition = getCrisisDefinition(state.activeCrisis.definitionId);

    if (!definition) {
      update.activeCrisis = null;
      return update;
    }

    if (isCrisisResolved(state.activeCrisis, nextGlobalStats)) {
      update.activeCrisis = null;
      update.globalEffects = definition.successGlobalEffects ?? {};
      update.journalEvents.push(createCrisisEvent(definition, nextTurn, "success"));
      update.worldSignals.push(`La crise « ${definition.title} » est résorbée avant son échéance.`);
      return update;
    }

    if (nextTurn > state.activeCrisis.deadlineTurn) {
      update.activeCrisis = null;
      update.globalEffects = definition.failureGlobalEffects ?? {};
      update.blockEffects = definition.failureBlockEffects ?? {};
      update.journalEvents.push(createCrisisEvent(definition, nextTurn, "failure"));
      update.worldSignals.push(`L'échéance de la crise « ${definition.title} » est dépassée. Le monde encaisse.`);
      return update;
    }

    const turnsLeft = state.activeCrisis.deadlineTurn - nextTurn + 1;
    update.worldSignals.push(
      `Crise en cours — ${definition.title} : ${describeCrisisRequirement(state.activeCrisis)} (${turnsLeft} tour${turnsLeft > 1 ? "s" : ""} restant${turnsLeft > 1 ? "s" : ""}).`,
    );
    return update;
  }

  for (const definition of crises) {
    if (!canTriggerCrisis(state, definition, matchesCondition)) {
      continue;
    }

    const baselineValue = nextGlobalStats[definition.stat];
    const activeCrisis: ActiveCrisis = {
      definitionId: definition.id,
      triggeredTurn: nextTurn,
      deadlineTurn: nextTurn + definition.deadlineTurns - 1,
      baselineValue,
      targetValue: computeTargetValue(definition, baselineValue),
    };

    update.activeCrisis = activeCrisis;
    update.crisisCooldowns = { ...state.crisisCooldowns, [definition.id]: state.turn };
    update.journalEvents.push(createCrisisEvent(definition, nextTurn, "trigger"));
    update.worldSignals.push(`Nouvelle crise — ${definition.title} : ${describeCrisisRequirement(activeCrisis)}`);
    return update;
  }

  return update;
}

export { crises };
