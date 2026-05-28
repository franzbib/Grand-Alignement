import { blockProfiles } from "../data/blockProfiles";
import { endings } from "../data/endings";
import { systemicEvents } from "../data/events";
import type {
  Action,
  Block,
  BlockStats,
  Ending,
  EndingDefinition,
  GameState,
  GlobalStats,
  StatDelta,
  StatThresholds,
  SystemicEvent,
  SystemicEventCondition,
} from "../types/game";

const MAX_JOURNAL_ENTRIES = 10;

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
  action?: Action,
): boolean {
  if (condition.actionIds && (!action || !condition.actionIds.includes(action.id))) {
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
  return {
    ...block,
    stats: applyDelta(applyDelta(block.stats, getProfileAdjustedDelta(block, action)), addBlockDrift(block.stats)),
  };
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

function chooseSystemicEvent(state: GameState, action: Action, globalStats: GlobalStats, blocks: Block[]): SystemicEvent | null {
  return (
    systemicEvents.find(
      (event) =>
        !state.journal.some((journalEvent) => journalEvent.sourceId === event.id) &&
        matchesCondition(event.condition, globalStats, blocks, action),
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
  if (state.ending) {
    return state;
  }

  const globalStats = applyDelta(
    applyDelta(state.globalStats, action.globalEffects),
    addSystemicDrift(state.globalStats),
  );

  const blockResults = state.blocks.map((block) => {
    const adjustedBlock = applyActionToBlock(block, action);

    return {
      block: adjustedBlock,
      intensity: getTotalDelta(block.stats, adjustedBlock.stats),
    };
  });

  const contrastText = createContrastText(blockResults);
  const actionAdjustedBlocks = blockResults.map((result) => result.block);
  const systemicEvent = chooseSystemicEvent(state, action, globalStats, actionAdjustedBlocks);
  const resolvedState = applySystemicEvent(systemicEvent, globalStats, actionAdjustedBlocks);

  const actionEvent = {
    id: `${action.id}-${state.turn}-${Date.now()}`,
    sourceId: action.id,
    turn: state.turn,
    title: action.name,
    text: `${action.eventText}${contrastText ?? ""}`,
  };

  const journalEvents = systemicEvent
    ? [
        {
          id: `${systemicEvent.id}-${state.turn}-${Date.now()}`,
          sourceId: systemicEvent.id,
          turn: state.turn,
          title: systemicEvent.title,
          text: systemicEvent.text,
          effectsText: systemicEvent.effectsText,
          tone: systemicEvent.tone,
        },
        actionEvent,
      ]
    : [actionEvent];

  return {
    turn: state.turn + 1,
    globalStats: resolvedState.globalStats,
    blocks: resolvedState.blocks,
    journal: [...journalEvents, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    ending: evaluateEnding(resolvedState.globalStats, resolvedState.blocks),
  };
}
