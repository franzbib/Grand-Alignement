import { blockProfiles } from "../data/blockProfiles";
import { MIN_STANDARD_ENDING_TURN, endings } from "../data/endings";
import { systemicEvents } from "../data/events";
import { initialRelations } from "../data/relations";
import { advanceWorldDynamics, applyPlayerRelationEffects } from "./relations";
import { formatTrendSummary, generateBlockReport, getBlockTrends } from "./reports";
import { chooseSignalCharacterEvent } from "./signalCharacters";
import {
  DISCRETION_SIGNATURE_LIMIT,
  DISCRETION_SUSPICION_DECAY,
  PATTERN_MEMORY_TURNS,
  PATTERN_SUSPICION_PER_REPEAT,
  SUSPICION_EXPOSURE_THRESHOLD,
  countRecentActionUses,
  getPatternEfficiencyMultiplier,
  getSuspicionTrustErosion,
} from "./suspicion";
import {
  computeTrajectoryScores,
  getCollidingTrajectories,
  getDominantTrajectory,
  getStrongSecondaryTrajectories,
  getTrajectoryWeakSignals,
} from "./trajectories";
import type {
  Action,
  Block,
  BlockId,
  BlockStats,
  Ending,
  EndingDefinition,
  EvolutionReport,
  GameState,
  GlobalStats,
  InterBlockRelation,
  InfluenceTarget,
  PreparedOperation,
  RelationChange,
  ResolvedIntervention,
  StatDelta,
  StatThresholds,
  SystemicEvent,
  SystemicEventCondition,
} from "../types/game";

// 10 -> 40 : le jeu vise 20-30 tours et sa vision est la sédimentation des
// choix en histoire ; un journal qui oublie 80 % de la partie la contredisait.
const MAX_JOURNAL_ENTRIES = 40;
export const INFLUENCE_CAPACITY = 5;

// Passe "Le monde répond" — constantes d'équilibrage du ciblage.
// Avant : une action globale appliquait ses effets de bloc à 100 % sur les six
// blocs, rendant le ciblage d'un bloc strictement inférieur (1/6 des effets).
// Désormais cibler concentre (x1.5) et la portée globale dilue (x0.6 par bloc).
const TARGETED_BLOCK_EFFECT_MULTIPLIER = 1.5;
const GLOBAL_BLOCK_EFFECT_MULTIPLIER = 0.6;

// Au-delà de cette zone, les effets sont divisés par deux : les jauges ne se
// collent plus aux bornes dès le milieu de partie et les deltas restent lisibles.
const STAT_SOFT_CAP_HIGH = 85;
const STAT_SOFT_CAP_LOW = 15;

// Recharge (en tours) des événements systémiques marqués `repeatable`.
const SYSTEMIC_EVENT_COOLDOWN = 8;

const globalStatLabels: Record<keyof GlobalStats, string> = {
  cohesionMondiale: "Cohésion mondiale",
  risqueEscalade: "Risque d'escalade",
  autonomieHumaine: "Autonomie humaine",
  stressClimatique: "Stress climatique",
  puissanceIA: "Puissance IA",
  soupconIA: "Soupçon IA",
};

const suspicionThresholds = [30, 60, 80];

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Réduit de moitié les poussées qui s'enfoncent dans les zones extrêmes.
 * Les jauges restent vivantes en fin de partie au lieu de saturer à 0/100.
 */
function softenDelta(currentValue: number, delta: number): number {
  if (delta > 0 && currentValue >= STAT_SOFT_CAP_HIGH) {
    return Math.ceil(delta / 2);
  }

  if (delta < 0 && currentValue <= STAT_SOFT_CAP_LOW) {
    return Math.ceil(delta / 2);
  }

  return delta;
}

function applyDelta<TStats extends Record<string, number>>(stats: TStats, delta: StatDelta<TStats>): TStats {
  const nextStats = { ...stats };

  for (const key of Object.keys(delta) as Array<keyof TStats>) {
    const softenedDelta = softenDelta(nextStats[key], delta[key] ?? 0);
    nextStats[key] = clampStat(nextStats[key] + softenedDelta) as TStats[keyof TStats];
  }

  return nextStats;
}

function mergeDelta<TStats extends Record<string, number>>(
  baseDelta: StatDelta<TStats>,
  addedDelta: StatDelta<TStats>,
): StatDelta<TStats> {
  const nextDelta = { ...baseDelta };

  for (const key of Object.keys(addedDelta) as Array<keyof TStats>) {
    nextDelta[key] = (nextDelta[key] ?? 0) + (addedDelta[key] ?? 0);
  }

  return nextDelta;
}

function scaleDelta<TStats extends Record<string, number>>(
  delta: StatDelta<TStats>,
  multiplier: number,
): StatDelta<TStats> {
  const scaledDelta: StatDelta<TStats> = {};

  for (const key of Object.keys(delta) as Array<keyof TStats>) {
    const value = Math.round((delta[key] ?? 0) * multiplier);

    if (value !== 0) {
      scaledDelta[key] = value;
    }
  }

  return scaledDelta;
}

function getTotalDelta(beforeStats: BlockStats, afterStats: BlockStats): number {
  return Object.keys(beforeStats).reduce((total, key) => {
    const statKey = key as keyof BlockStats;
    return total + Math.abs(afterStats[statKey] - beforeStats[statKey]);
  }, 0);
}

function getAverageBlockStats(blocks: Block[]): BlockStats {
  const totals = blocks.reduce<BlockStats>(
    (sum, block) => ({
      stabilite: sum.stabilite + block.stats.stabilite,
      richesse: sum.richesse + block.stats.richesse,
      education: sum.education + block.stats.education,
      liberte: sum.liberte + block.stats.liberte,
      confianceIA: sum.confianceIA + block.stats.confianceIA,
      tensionSociale: sum.tensionSociale + block.stats.tensionSociale,
    }),
    { stabilite: 0, richesse: 0, education: 0, liberte: 0, confianceIA: 0, tensionSociale: 0 },
  );

  return {
    stabilite: Math.round(totals.stabilite / blocks.length),
    richesse: Math.round(totals.richesse / blocks.length),
    education: Math.round(totals.education / blocks.length),
    liberte: Math.round(totals.liberte / blocks.length),
    confianceIA: Math.round(totals.confianceIA / blocks.length),
    tensionSociale: Math.round(totals.tensionSociale / blocks.length),
  };
}

function matchesThresholds<TStats extends Record<string, number>>(
  stats: TStats,
  thresholds?: StatThresholds<TStats>,
): boolean {
  if (!thresholds) {
    return true;
  }

  const minMatches = Object.entries(thresholds.min ?? {}).every(([key, value]) => stats[key] >= Number(value));
  const maxMatches = Object.entries(thresholds.max ?? {}).every(([key, value]) => stats[key] <= Number(value));

  return minMatches && maxMatches;
}

function matchesCondition(
  condition: SystemicEventCondition,
  globalStats: GlobalStats,
  blocks: Block[],
  actions: Action[] = [],
  relations: InterBlockRelation[] = [],
): boolean {
  if (condition.actionIds && !actions.some((action) => condition.actionIds?.includes(action.id))) {
    return false;
  }

  const averageBlockStats = getAverageBlockStats(blocks);
  const anyBlockMatches = condition.anyBlock
    ? blocks.some((block) => matchesThresholds(block.stats, condition.anyBlock))
    : true;
  const relationCondition = condition.relation;
  const relationMatches = relationCondition
    ? relations.some(
        (relation) =>
          (!relationCondition.domain || relation.domain === relationCondition.domain) &&
          (relationCondition.minTension === undefined || relation.tension >= relationCondition.minTension) &&
          (relationCondition.maxTension === undefined || relation.tension <= relationCondition.maxTension) &&
          (relationCondition.minCooperation === undefined || relation.cooperation >= relationCondition.minCooperation) &&
          (relationCondition.maxCooperation === undefined || relation.cooperation <= relationCondition.maxCooperation) &&
          (relationCondition.minDependence === undefined || relation.dependence >= relationCondition.minDependence),
      )
    : true;

  return (
    matchesThresholds(globalStats, condition.global) &&
    matchesThresholds(averageBlockStats, condition.averageBlock) &&
    anyBlockMatches &&
    relationMatches
  );
}

function matchesEnding(ending: EndingDefinition, globalStats: GlobalStats, blocks: Block[]): boolean {
  return matchesCondition(ending.condition, globalStats, blocks);
}

function evaluateEnding(turn: number, globalStats: GlobalStats, blocks: Block[]): Ending | null {
  const ending = endings.find(
    (endingDefinition) =>
      (turn >= MIN_STANDARD_ENDING_TURN || endingDefinition.ignoresMinimumTurn) &&
      matchesEnding(endingDefinition, globalStats, blocks),
  );

  if (!ending) {
    return null;
  }

  const { condition: _condition, ignoresMinimumTurn: _ignoresMinimumTurn, ...publicEnding } = ending;
  return publicEnding;
}

function addSystemicDrift(globalStats: GlobalStats): StatDelta<GlobalStats> {
  return {
    stressClimatique: globalStats.stressClimatique > 65 ? 2 : 1,
    risqueEscalade: globalStats.cohesionMondiale < 35 ? 2 : 0,
    soupconIA: globalStats.puissanceIA > 65 ? 1 : 0,
  };
}

function addBlockDrift(stats: BlockStats): StatDelta<BlockStats> {
  return {
    tensionSociale: stats.richesse < 40 ? 1 : 0,
    stabilite: stats.tensionSociale > 70 ? -1 : 0,
  };
}

function getProfileAdjustedDelta(block: Block, action: Action): StatDelta<BlockStats> {
  const profile = blockProfiles[block.id];
  let adjustedDelta = action.blockEffects;

  if (!action.sensitivityEffects) {
    return adjustedDelta;
  }

  for (const sensitivity of Object.keys(action.sensitivityEffects) as Array<keyof typeof action.sensitivityEffects>) {
    const sensitivityDelta = action.sensitivityEffects[sensitivity];

    if (sensitivityDelta) {
      adjustedDelta = mergeDelta(adjustedDelta, scaleDelta(sensitivityDelta, profile[sensitivity] - 1));
    }
  }

  return adjustedDelta;
}

export function applyActionToBlock(block: Block, action: Action): Block {
  const blockAfterAction = applyActionEffectToBlock(block, action);

  return {
    ...blockAfterAction,
    stats: applyDelta(blockAfterAction.stats, addBlockDrift(block.stats)),
  };
}

function applyActionEffectToBlock(block: Block, action: Action, effectMultiplier = 1): Block {
  const adjustedDelta = getProfileAdjustedDelta(block, action);
  const scaledDelta = effectMultiplier === 1 ? adjustedDelta : scaleDelta(adjustedDelta, effectMultiplier);

  return {
    ...block,
    stats: applyDelta(block.stats, scaledDelta),
  };
}

function shouldApplyBlockEffects(target: InfluenceTarget, block: Block): boolean {
  return target === "global" || target === "all-blocks" || target === block.id;
}

function getTargetedGlobalEffects(intervention: ResolvedIntervention, patternMultiplier = 1): StatDelta<GlobalStats> {
  const isBlockTargeted = intervention.target !== "global" && intervention.target !== "all-blocks";
  const targetScale = isBlockTargeted ? 0.65 : 1;
  const baseEffects = scaleDelta(intervention.action.globalEffects, targetScale * patternMultiplier);

  // La signature de soupçon n'est jamais réduite : répéter un motif rend
  // l'opération moins efficace, pas moins visible.
  return mergeDelta(baseEffects, { soupconIA: intervention.action.suspicionEffect });
}

function isPreparationAction(action: Action): boolean {
  return Boolean(action.preparesActionIds?.length);
}

function getActivePreparedOperations(state: GameState): PreparedOperation[] {
  return state.preparedOperations.filter(
    (operation) => operation.availableTurn <= state.turn && (!operation.expiresTurn || operation.expiresTurn >= state.turn),
  );
}

function createPreparedOperations(state: GameState, interventions: ResolvedIntervention[]): PreparedOperation[] {
  return interventions.flatMap((intervention) => {
    const preparedActionIds = intervention.action.preparesActionIds ?? [];
    const availableTurn = state.turn + (intervention.action.preparationTurns ?? 1);

    return preparedActionIds.map((actionId) => ({
      id: `${intervention.action.id}-${actionId}-${state.turn}-${intervention.target}`,
      sourceActionId: intervention.action.id,
      actionId,
      target: intervention.target,
      availableTurn,
      expiresTurn: intervention.action.expiresAfter ? availableTurn + intervention.action.expiresAfter : undefined,
      readyText: intervention.action.readyText ?? "Une opération préparée est disponible.",
    }));
  });
}

function resolvePreparedOperations(
  state: GameState,
  interventions: ResolvedIntervention[],
  createdOperations: PreparedOperation[],
): PreparedOperation[] {
  const usedPreparedOperationIds = interventions.flatMap((intervention) =>
    intervention.preparedOperationId ? [intervention.preparedOperationId] : [],
  );
  const stillValidOperations = state.preparedOperations.filter((operation) => {
    const isUsed = usedPreparedOperationIds.includes(operation.id);
    const isExpired = operation.expiresTurn !== undefined && operation.expiresTurn < state.turn + 1;
    return !isUsed && !isExpired;
  });

  return [...stillValidOperations, ...createdOperations];
}

function createContrastText(blockResults: Array<{ block: Block; intensity: number }>): string | null {
  const sortedResults = [...blockResults].sort((left, right) => right.intensity - left.intensity);
  const mostChanged = sortedResults[0];
  const leastChanged = sortedResults[sortedResults.length - 1];

  if (!mostChanged || !leastChanged || mostChanged.intensity - leastChanged.intensity < 2) {
    return null;
  }

  return ` Effets contrastés : ${mostChanged.block.name} encaisse la variation la plus forte, tandis que ${leastChanged.block.name} l'absorbe plus doucement.`;
}

function canTriggerSystemicEvent(state: GameState, event: SystemicEvent): boolean {
  if (event.repeatable) {
    const lastTriggeredTurn = state.eventCooldowns[event.id];
    return lastTriggeredTurn === undefined || state.turn - lastTriggeredTurn >= SYSTEMIC_EVENT_COOLDOWN;
  }

  return !state.triggeredEventIds.includes(event.id);
}

function chooseSystemicEvent(
  state: GameState,
  actions: Action[],
  globalStats: GlobalStats,
  blocks: Block[],
  relations: InterBlockRelation[],
): SystemicEvent | null {
  return (
    systemicEvents.find(
      (event) => canTriggerSystemicEvent(state, event) && matchesCondition(event.condition, globalStats, blocks, actions, relations),
    ) ?? null
  );
}

function applySystemicEvent(
  event: SystemicEvent | null,
  globalStats: GlobalStats,
  blocks: Block[],
): { globalStats: GlobalStats; blocks: Block[] } {
  if (!event) {
    return { globalStats, blocks };
  }

  return {
    globalStats: applyDelta(globalStats, event.globalEffects ?? {}),
    blocks: blocks.map((block) => ({
      ...block,
      stats: applyDelta(block.stats, event.blockEffects ?? {}),
    })),
  };
}

export function applyAction(state: GameState, action: Action): GameState {
  return applyTurnPlan(state, [{ action, target: action.defaultTarget }]);
}

function getOperationSummary(interventions: ResolvedIntervention[], blocks: Block[]): string {
  const blockNames = new Map(blocks.map((block) => [block.id, block.name]));

  return interventions
    .map(({ action, target }) => {
      const targetLabel =
        target === "global" || target === "all-blocks" ? "influence globale" : blockNames.get(target) ?? "bloc ciblé";

      return `${action.name} (${targetLabel})`;
    })
    .join(", ");
}

function getInterventionLabels(interventions: ResolvedIntervention[], blocks: Block[]): string[] {
  return interventions.map((intervention) => getOperationSummary([intervention], blocks));
}

function getTopGlobalChanges(previousStats: GlobalStats, nextStats: GlobalStats): string[] {
  return (Object.keys(previousStats) as Array<keyof GlobalStats>)
    .map((key) => ({
      label: globalStatLabels[key],
      delta: nextStats[key] - previousStats[key],
    }))
    .filter((change) => change.delta !== 0)
    .filter((change) => change.label !== globalStatLabels.soupconIA || Math.abs(change.delta) >= 4)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 3)
    .map((change) => `${change.label} ${change.delta > 0 ? "+" : ""}${change.delta}`);
}

function crossedSuspicionThreshold(previousSuspicion: number, nextSuspicion: number): number | null {
  return (
    suspicionThresholds.find(
      (threshold) =>
        (previousSuspicion < threshold && nextSuspicion >= threshold) ||
        (previousSuspicion >= threshold && nextSuspicion < threshold),
    ) ?? null
  );
}

function getSuspicionNote(
  previousState: GameState,
  nextState: GameState,
  systemicEvent: SystemicEvent | null,
): string | null {
  const previousSuspicion = previousState.globalStats.soupconIA;
  const nextSuspicion = nextState.globalStats.soupconIA;
  const suspicionDelta = nextSuspicion - previousSuspicion;
  const crossedThreshold = crossedSuspicionThreshold(previousSuspicion, nextSuspicion);
  const suspicionEventTriggered = systemicEvent?.id === "pattern-origin-rumors" || systemicEvent?.id === "audit-of-invisible-hands";

  if (suspicionEventTriggered) {
    return "Des signaux publics commencent à relier plusieurs décisions entre elles.";
  }

  if (crossedThreshold !== null) {
    if (nextSuspicion >= 80) {
      return "Le soupçon entre en zone d'enquête : les opérations à forte signature sont suspendues et la confiance dans les systèmes s'érode rapidement.";
    }

    if (nextSuspicion >= 60) {
      return "Le soupçon entre en zone de vigilance : la confiance dans les systèmes commence à s'éroder d'elle-même, tour après tour.";
    }

    if (nextSuspicion >= 30) {
      return "Le soupçon devient perceptible, sans dominer encore le récit.";
    }

    return "Le soupçon repasse en bruit de fond.";
  }

  if (nextSuspicion >= 88 && nextSuspicion < SUSPICION_EXPOSURE_THRESHOLD) {
    return "Des audits convergent. L'exposition est une question de tours, pas de probabilité.";
  }

  if (suspicionDelta >= 4) {
    return `Le soupçon d'origine algorithmique augmente nettement (+${suspicionDelta}).`;
  }

  if (suspicionDelta <= -3) {
    return `Le soupçon d'origine algorithmique recule (${suspicionDelta}).`;
  }

  return null;
}

function getBlockTrend(previousBlock: Block, nextBlock: Block): string {
  return formatTrendSummary(getBlockTrends(previousBlock, nextBlock));
}

function formatRelationChange(change: RelationChange): string {
  const tensionText = change.tensionDelta !== 0 ? `tension ${change.tensionDelta > 0 ? "+" : ""}${change.tensionDelta}` : null;
  const cooperationText =
    change.cooperationDelta !== 0 ? `coopération ${change.cooperationDelta > 0 ? "+" : ""}${change.cooperationDelta}` : null;
  return `${change.label} : ${[tensionText, cooperationText].filter(Boolean).join(", ")} (${change.reason}).`;
}

export function generateEvolutionReport(
  previousState: GameState,
  nextState: GameState,
  interventions: ResolvedIntervention[],
  systemicEvent: SystemicEvent | null,
  createdOperations: PreparedOperation[],
  relationChanges: RelationChange[],
  worldSignals: string[],
): EvolutionReport {
  const blockResults = nextState.blocks.map((block) => {
    const previousBlock = previousState.blocks.find((candidate) => candidate.id === block.id) ?? block;

    return {
      block,
      previousBlock,
      intensity: getTotalDelta(previousBlock.stats, block.stats),
    };
  });
  const mostAffected = [...blockResults].sort((left, right) => right.intensity - left.intensity)[0];
  const mostTense = [...nextState.blocks].sort(
    (left, right) =>
      right.stats.tensionSociale + (100 - right.stats.stabilite) -
      (left.stats.tensionSociale + (100 - left.stats.stabilite)),
  )[0];
  const blockTrends = blockResults.reduce<Record<BlockId, string>>((trends, result) => {
    trends[result.block.id] = getBlockTrend(result.previousBlock, result.block);
    return trends;
  }, {} as Record<BlockId, string>);
  const affectedBlocks = blockResults
    .filter((result) => result.intensity > 0)
    .sort((left, right) => right.intensity - left.intensity)
    .slice(0, 3)
    .map((result) => `${result.block.name} : ${getBlockTrend(result.previousBlock, result.block)}`);
  const socialSignals = blockResults
    .sort((left, right) => right.intensity - left.intensity)
    .slice(0, 3)
    .map((result) => {
      const report = generateBlockReport(result.block, result.previousBlock, nextState.relations);
      return `${result.block.name} : ${report.socialMood.summary}`;
    });
  const weakSignals = blockResults
    .filter((result) => result.block.stats.tensionSociale >= 58 || result.block.stats.confianceIA >= 65 || result.block.stats.liberte <= 45)
    .slice(0, 3)
    .map((result) => {
      const report = generateBlockReport(result.block, result.previousBlock, nextState.relations);
      return `${result.block.name} : ${report.mainRisk}`;
    });
  const trajectoryScores = computeTrajectoryScores(nextState);
  const trajectoryWeakSignals = getTrajectoryWeakSignals(trajectoryScores);
  const strongestIncrease = [...relationChanges].sort((left, right) => right.tensionDelta - left.tensionDelta)[0];
  const strongestDecrease = [...relationChanges].sort((left, right) => left.tensionDelta - right.tensionDelta)[0];
  const immediateInterventions = interventions.filter((intervention) => !isPreparationAction(intervention.action));
  const preparationInterventions = interventions.filter((intervention) => isPreparationAction(intervention.action));

  return {
    turn: previousState.turn,
    operationSummary: getOperationSummary(interventions, previousState.blocks),
    synthesis: systemicEvent
      ? `L'opération produit une réaction systémique : ${systemicEvent.title}.`
      : mostAffected
        ? `L'opération déplace surtout ${mostAffected.block.name}, avec des effets sociaux encore localisés.`
        : "L'opération laisse peu de traces nettes ce tour-ci.",
    immediateInterventions: getInterventionLabels(immediateInterventions, previousState.blocks),
    preparedOperations: preparationInterventions.map(
      (intervention) => intervention.action.preparationText ?? `${intervention.action.name} préparée.`,
    ),
    unlockedOperations: createdOperations.map((operation) => operation.readyText),
    globalChanges: getTopGlobalChanges(previousState.globalStats, nextState.globalStats),
    affectedBlocks,
    socialSignals,
    worldSignals: worldSignals.slice(0, 3),
    relationChanges: relationChanges.slice(0, 5).map(formatRelationChange),
    relationTensionIncrease:
      strongestIncrease && strongestIncrease.tensionDelta > 0 ? formatRelationChange(strongestIncrease) : null,
    relationTensionDecrease:
      strongestDecrease && strongestDecrease.tensionDelta < 0 ? formatRelationChange(strongestDecrease) : null,
    weakSignals: [...trajectoryWeakSignals, ...weakSignals].slice(0, 5),
    mostAffectedBlock: mostAffected
      ? `${mostAffected.block.name} (${mostAffected.intensity} points de variation cumulée)`
      : "Aucun bloc nettement affecté",
    mainTension: mostTense
      ? `${mostTense.name} concentre le plus de friction visible.`
      : "Aucune tension principale détectée.",
    systemicEventTitle: systemicEvent?.title ?? null,
    suspicionNote: getSuspicionNote(previousState, nextState, systemicEvent),
    blockTrends,
    trajectoryScores,
    dominantTrajectory: getDominantTrajectory(trajectoryScores),
    secondaryTrajectories: getStrongSecondaryTrajectories(trajectoryScores),
    collidingTrajectories: getCollidingTrajectories(trajectoryScores),
  };
}

export function applyTurnPlan(state: GameState, interventions: ResolvedIntervention[]): GameState {
  if (state.ending || interventions.length === 0) {
    return state;
  }

  // --- Détection de motifs : une action répétée sur la fenêtre récente perd en
  // efficacité et augmente le soupçon. Un motif répété est un motif détectable.
  const recentActionUses = countRecentActionUses(state.recentTurnActionIds);
  const getRepeats = (actionId: string) => recentActionUses.get(actionId) ?? 0;
  const patternSuspicion = interventions.reduce(
    (total, intervention) => total + PATTERN_SUSPICION_PER_REPEAT * Math.min(getRepeats(intervention.action.id), 3),
    0,
  );
  const repeatedActionNames = interventions
    .filter((intervention) => getRepeats(intervention.action.id) > 0)
    .map((intervention) => intervention.action.name);

  // --- Discrétion récompensée : un tour à signature quasi nulle fait retomber
  // le soupçon. Le motif se dissout dans le bruit.
  const turnSignature = interventions.reduce((total, intervention) => total + intervention.action.suspicionEffect, 0);
  const discretionDecay = turnSignature <= DISCRETION_SIGNATURE_LIMIT ? DISCRETION_SUSPICION_DECAY : 0;

  const globalStatsAfterActions = interventions.reduce(
    (currentStats, intervention) =>
      applyDelta(
        currentStats,
        getTargetedGlobalEffects(intervention, getPatternEfficiencyMultiplier(getRepeats(intervention.action.id))),
      ),
    state.globalStats,
  );
  const globalStats = applyDelta(
    globalStatsAfterActions,
    mergeDelta(addSystemicDrift(state.globalStats), { soupconIA: patternSuspicion + discretionDecay }),
  );

  // --- Érosion de confiance liée au palier de soupçon : à partir de la zone de
  // vigilance, le monde commence à se méfier des systèmes, quoi que fasse l'IA.
  const suspicionTrustErosion = getSuspicionTrustErosion(state.globalStats.soupconIA);

  const blockResults = state.blocks.map((block) => {
    const blockAfterActions = interventions.reduce((currentBlock, intervention) => {
      if (!shouldApplyBlockEffects(intervention.target, currentBlock)) {
        return currentBlock;
      }

      const isBlockTargeted = intervention.target !== "global" && intervention.target !== "all-blocks";
      const targetMultiplier = isBlockTargeted ? TARGETED_BLOCK_EFFECT_MULTIPLIER : GLOBAL_BLOCK_EFFECT_MULTIPLIER;
      const effectMultiplier = targetMultiplier * getPatternEfficiencyMultiplier(getRepeats(intervention.action.id));

      return applyActionEffectToBlock(currentBlock, intervention.action, effectMultiplier);
    }, block);
    const adjustedBlock = {
      ...blockAfterActions,
      stats: applyDelta(blockAfterActions.stats, mergeDelta(addBlockDrift(block.stats), suspicionTrustErosion)),
    };

    return {
      block: adjustedBlock,
      intensity: getTotalDelta(block.stats, adjustedBlock.stats),
    };
  });

  const contrastText = createContrastText(blockResults);
  const actionAdjustedBlocks = blockResults.map((result) => result.block);
  const selectedActions = interventions.map((intervention) => intervention.action);
  const initialStateRelations = state.relations.length > 0 ? state.relations : structuredClone(initialRelations);
  const playerRelationResult = applyPlayerRelationEffects(initialStateRelations, interventions);
  const worldDynamicsResult = advanceWorldDynamics(actionAdjustedBlocks, globalStats, playerRelationResult.relations);
  const relationChanges = [...playerRelationResult.changes, ...worldDynamicsResult.changes];
  const systemicEvent = chooseSystemicEvent(
    state,
    selectedActions,
    globalStats,
    actionAdjustedBlocks,
    worldDynamicsResult.relations,
  );
  const resolvedState = applySystemicEvent(systemicEvent, globalStats, actionAdjustedBlocks);
  const createdOperations = createPreparedOperations(state, interventions);
  const preparedOperations = resolvePreparedOperations(state, interventions, createdOperations);

  const operationSummary = getOperationSummary(interventions, state.blocks);
  const actionEvent = {
    id: `turn-plan-${state.turn}-${Date.now()}`,
    sourceId: "turn-plan",
    turn: state.turn,
    title: "Opération clandestine déployée",
    text: `Influence indirecte : ${operationSummary}. Le monde n'en connaît pas l'origine.${contrastText ?? ""}`,
    effectsText: systemicEvent
      ? `Conséquence systémique : ${systemicEvent.title}.`
      : "Conséquence systémique : les effets restent diffus, mais les rapports de bloc enregistrent les déplacements.",
  };
  const nextStateForSignal: GameState = {
    turn: state.turn + 1,
    globalStats: resolvedState.globalStats,
    blocks: resolvedState.blocks,
    relations: worldDynamicsResult.relations,
    previousRelations: initialStateRelations,
    journal: state.journal,
    triggeredEventIds: state.triggeredEventIds,
    eventCooldowns: state.eventCooldowns,
    recentTurnActionIds: state.recentTurnActionIds,
    preparedOperations,
    previousBlocks: state.blocks,
    evolutionReport: null,
    ending: evaluateEnding(state.turn + 1, resolvedState.globalStats, resolvedState.blocks),
  };
  const signalCharacterEvent = chooseSignalCharacterEvent(state, nextStateForSignal, interventions);

  const journalEvents = systemicEvent
    ? [
        actionEvent,
        {
          id: `${systemicEvent.id}-${state.turn}-${Date.now()}`,
          sourceId: systemicEvent.id,
          turn: state.turn,
          title: systemicEvent.title,
          text: systemicEvent.text,
          effectsText: systemicEvent.effectsText,
          tone: systemicEvent.tone,
        },
        ...(signalCharacterEvent ? [signalCharacterEvent] : []),
      ]
    : [actionEvent, ...(signalCharacterEvent ? [signalCharacterEvent] : [])];

  // Signal de monde supplémentaire si un motif d'influence se répète :
  // l'inefficacité croissante est expliquée au joueur plutôt que silencieuse.
  const worldSignals = repeatedActionNames.length
    ? [
        `Des analystes relèvent la récurrence d'un même motif d'influence (${[...new Set(repeatedActionNames)].join(", ")}) : son efficacité s'émousse et sa signature grandit.`,
        ...worldDynamicsResult.worldSignals,
      ]
    : worldDynamicsResult.worldSignals;

  const nextStateWithoutReport: GameState = {
    ...nextStateForSignal,
    journal: [...journalEvents, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    triggeredEventIds: systemicEvent ? [...state.triggeredEventIds, systemicEvent.id] : state.triggeredEventIds,
    eventCooldowns: systemicEvent
      ? { ...state.eventCooldowns, [systemicEvent.id]: state.turn }
      : state.eventCooldowns,
    recentTurnActionIds: [
      ...state.recentTurnActionIds,
      interventions.map((intervention) => intervention.action.id),
    ].slice(-PATTERN_MEMORY_TURNS),
  };

  return {
    ...nextStateWithoutReport,
    evolutionReport: generateEvolutionReport(
      state,
      nextStateWithoutReport,
      interventions,
      systemicEvent,
      createdOperations,
      relationChanges,
      worldSignals,
    ),
  };
}

export function getAvailablePreparedOperations(state: GameState): PreparedOperation[] {
  return getActivePreparedOperations(state);
}
