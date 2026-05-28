import { blockProfiles } from "../data/blockProfiles";
import { endings } from "../data/endings";
import { systemicEvents } from "../data/events";
import { initialRelations } from "../data/relations";
import { advanceWorldDynamics, applyPlayerRelationEffects } from "./relations";
import { formatTrendSummary, generateBlockReport, getBlockTrends } from "./reports";
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

const MAX_JOURNAL_ENTRIES = 10;
export const INFLUENCE_CAPACITY = 5;

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

function applyDelta<TStats extends Record<string, number>>(stats: TStats, delta: StatDelta<TStats>): TStats {
  const nextStats = { ...stats };

  for (const key of Object.keys(delta) as Array<keyof TStats>) {
    nextStats[key] = clampStat(nextStats[key] + (delta[key] ?? 0)) as TStats[keyof TStats];
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

function evaluateEnding(globalStats: GlobalStats, blocks: Block[]): Ending | null {
  const ending = endings.find((endingDefinition) => matchesEnding(endingDefinition, globalStats, blocks));

  if (!ending) {
    return null;
  }

  const { condition: _condition, ...publicEnding } = ending;
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

function applyActionEffectToBlock(block: Block, action: Action): Block {
  return {
    ...block,
    stats: applyDelta(block.stats, getProfileAdjustedDelta(block, action)),
  };
}

function shouldApplyBlockEffects(target: InfluenceTarget, block: Block): boolean {
  return target === "global" || target === "all-blocks" || target === block.id;
}

function getTargetedGlobalEffects(intervention: ResolvedIntervention): StatDelta<GlobalStats> {
  const isBlockTargeted = intervention.target !== "global" && intervention.target !== "all-blocks";
  const baseEffects = isBlockTargeted ? scaleDelta(intervention.action.globalEffects, 0.65) : intervention.action.globalEffects;

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

function chooseSystemicEvent(
  state: GameState,
  actions: Action[],
  globalStats: GlobalStats,
  blocks: Block[],
  relations: InterBlockRelation[],
): SystemicEvent | null {
  return (
    systemicEvents.find(
      (event) =>
        !state.triggeredEventIds.includes(event.id) &&
        matchesCondition(event.condition, globalStats, blocks, actions, relations),
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
      return "Le soupçon atteint une zone critique. Une branche d'exposition pourra exister plus tard.";
    }

    if (nextSuspicion >= 60) {
      return "Le soupçon entre en zone d'enquête latente.";
    }

    if (nextSuspicion >= 30) {
      return "Le soupçon devient perceptible, sans dominer encore le récit.";
    }

    return "Le soupçon repasse en bruit de fond.";
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
    weakSignals,
    mostAffectedBlock: mostAffected
      ? `${mostAffected.block.name} (${mostAffected.intensity} points de variation cumulée)`
      : "Aucun bloc nettement affecté",
    mainTension: mostTense
      ? `${mostTense.name} concentre le plus de friction visible.`
      : "Aucune tension principale détectée.",
    systemicEventTitle: systemicEvent?.title ?? null,
    suspicionNote: getSuspicionNote(previousState, nextState, systemicEvent),
    blockTrends,
  };
}

export function applyTurnPlan(state: GameState, interventions: ResolvedIntervention[]): GameState {
  if (state.ending || interventions.length === 0) {
    return state;
  }

  const globalStatsAfterActions = interventions.reduce(
    (currentStats, intervention) => applyDelta(currentStats, getTargetedGlobalEffects(intervention)),
    state.globalStats,
  );
  const globalStats = applyDelta(globalStatsAfterActions, addSystemicDrift(state.globalStats));

  const blockResults = state.blocks.map((block) => {
    const blockAfterActions = interventions.reduce(
      (currentBlock, intervention) =>
        shouldApplyBlockEffects(intervention.target, currentBlock)
          ? applyActionEffectToBlock(currentBlock, intervention.action)
          : currentBlock,
      block,
    );
    const adjustedBlock = {
      ...blockAfterActions,
      stats: applyDelta(blockAfterActions.stats, addBlockDrift(block.stats)),
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
      ]
    : [actionEvent];

  const nextStateWithoutReport: GameState = {
    turn: state.turn + 1,
    globalStats: resolvedState.globalStats,
    blocks: resolvedState.blocks,
    relations: worldDynamicsResult.relations,
    previousRelations: initialStateRelations,
    journal: [...journalEvents, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    triggeredEventIds: systemicEvent ? [...state.triggeredEventIds, systemicEvent.id] : state.triggeredEventIds,
    preparedOperations,
    previousBlocks: state.blocks,
    evolutionReport: null,
    ending: evaluateEnding(resolvedState.globalStats, resolvedState.blocks),
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
      worldDynamicsResult.worldSignals,
    ),
  };
}

export function getAvailablePreparedOperations(state: GameState): PreparedOperation[] {
  return getActivePreparedOperations(state);
}
