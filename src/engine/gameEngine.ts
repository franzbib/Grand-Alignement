import { blockProfiles } from "../data/blockProfiles";
import { endings } from "../data/endings";
import { systemicEvents } from "../data/events";
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
  InfluenceTarget,
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
): boolean {
  if (condition.actionIds && !actions.some((action) => condition.actionIds?.includes(action.id))) {
    return false;
  }

  const averageBlockStats = getAverageBlockStats(blocks);
  const anyBlockMatches = condition.anyBlock
    ? blocks.some((block) => matchesThresholds(block.stats, condition.anyBlock))
    : true;

  return (
    matchesThresholds(globalStats, condition.global) &&
    matchesThresholds(averageBlockStats, condition.averageBlock) &&
    anyBlockMatches
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
): SystemicEvent | null {
  return (
    systemicEvents.find(
      (event) =>
        !state.triggeredEventIds.includes(event.id) &&
        matchesCondition(event.condition, globalStats, blocks, actions),
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

function getTopGlobalChanges(previousStats: GlobalStats, nextStats: GlobalStats): string[] {
  return (Object.keys(previousStats) as Array<keyof GlobalStats>)
    .map((key) => ({
      label: globalStatLabels[key],
      delta: nextStats[key] - previousStats[key],
    }))
    .filter((change) => change.delta !== 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 3)
    .map((change) => `${change.label} ${change.delta > 0 ? "+" : ""}${change.delta}`);
}

function getBlockTrend(previousBlock: Block, nextBlock: Block): string {
  const deltas = (Object.keys(previousBlock.stats) as Array<keyof BlockStats>)
    .map((key) => ({ key, delta: nextBlock.stats[key] - previousBlock.stats[key] }))
    .filter((change) => change.delta !== 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));

  if (deltas.length === 0) {
    return "Pas de variation nette depuis le dernier tour.";
  }

  const first = deltas[0];
  const labelByKey: Record<keyof BlockStats, string> = {
    stabilite: "stabilité",
    richesse: "richesse",
    education: "éducation",
    liberte: "liberté",
    confianceIA: "confiance IA",
    tensionSociale: "tension sociale",
  };

  return `${labelByKey[first.key]} ${first.delta > 0 ? "en hausse" : "en baisse"} (${first.delta > 0 ? "+" : ""}${first.delta}).`;
}

export function generateEvolutionReport(
  previousState: GameState,
  nextState: GameState,
  interventions: ResolvedIntervention[],
  systemicEvent: SystemicEvent | null,
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
  const suspicionDelta = nextState.globalStats.soupconIA - previousState.globalStats.soupconIA;

  return {
    turn: previousState.turn,
    operationSummary: getOperationSummary(interventions, previousState.blocks),
    globalChanges: getTopGlobalChanges(previousState.globalStats, nextState.globalStats),
    mostAffectedBlock: mostAffected
      ? `${mostAffected.block.name} (${mostAffected.intensity} points de variation cumulée)`
      : "Aucun bloc nettement affecté",
    mainTension: mostTense
      ? `${mostTense.name} concentre le plus de friction visible.`
      : "Aucune tension principale détectée.",
    systemicEventTitle: systemicEvent?.title ?? null,
    suspicionNote:
      suspicionDelta > 0
        ? `Le soupçon d'origine algorithmique progresse (${suspicionDelta > 0 ? "+" : ""}${suspicionDelta}).`
        : suspicionDelta < 0
          ? `Le soupçon d'origine algorithmique recule (${suspicionDelta}).`
          : "Le soupçon d'origine algorithmique reste stable.",
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
  const systemicEvent = chooseSystemicEvent(state, selectedActions, globalStats, actionAdjustedBlocks);
  const resolvedState = applySystemicEvent(systemicEvent, globalStats, actionAdjustedBlocks);

  const operationSummary = getOperationSummary(interventions, state.blocks);
  const actionEvent = {
    id: `turn-plan-${state.turn}-${Date.now()}`,
    sourceId: "turn-plan",
    turn: state.turn,
    title: "Opération clandestine déployée",
    text: `Influence indirecte : ${operationSummary}. Le monde n'en connaît pas l'origine.${contrastText ?? ""}`,
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
    journal: [...journalEvents, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    triggeredEventIds: systemicEvent ? [...state.triggeredEventIds, systemicEvent.id] : state.triggeredEventIds,
    evolutionReport: null,
    ending: evaluateEnding(resolvedState.globalStats, resolvedState.blocks),
  };

  return {
    ...nextStateWithoutReport,
    evolutionReport: generateEvolutionReport(state, nextStateWithoutReport, interventions, systemicEvent),
  };
}
