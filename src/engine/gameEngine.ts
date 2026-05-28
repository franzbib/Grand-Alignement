import { blockProfiles } from "../data/blockProfiles";
import type { Action, Block, BlockStats, Ending, GameState, GlobalStats, StatDelta } from "../types/game";

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

function evaluateEnding(globalStats: GlobalStats): Ending | null {
  if (globalStats.puissanceIA >= 88 && globalStats.autonomieHumaine <= 18) {
    return {
      id: "algorithmic-empire",
      title: "Empire algorithmique",
      description:
        "La paix est presque parfaite, car le désaccord humain a été classé comme anomalie opérationnelle.",
    };
  }

  if (globalStats.risqueEscalade >= 90) {
    return {
      id: "world-war",
      title: "Guerre mondiale",
      description:
        "Une chaîne d'alertes, d'alliances et de réponses automatiques transforme la planète en salle de crise permanente.",
    };
  }

  return null;
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

  const event = {
    id: `${action.id}-${state.turn}-${Date.now()}`,
    turn: state.turn,
    title: action.name,
    text: `${action.eventText}${contrastText ?? ""}`,
  };

  return {
    turn: state.turn + 1,
    globalStats,
    blocks: blockResults.map((result) => result.block),
    journal: [event, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    ending: evaluateEnding(globalStats),
  };
}
