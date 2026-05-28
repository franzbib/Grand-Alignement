import type { Action, BlockStats, Ending, GameState, GlobalStats, StatDelta } from "../types/game";

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

export function applyAction(state: GameState, action: Action): GameState {
  if (state.ending) {
    return state;
  }

  const globalStats = applyDelta(
    applyDelta(state.globalStats, action.globalEffects),
    addSystemicDrift(state.globalStats),
  );

  const blocks = state.blocks.map((block) => ({
    ...block,
    stats: applyDelta(applyDelta(block.stats, action.blockEffects), addBlockDrift(block.stats)),
  }));

  const event = {
    id: `${action.id}-${state.turn}-${Date.now()}`,
    turn: state.turn,
    title: action.name,
    text: action.eventText,
  };

  return {
    turn: state.turn + 1,
    globalStats,
    blocks,
    journal: [event, ...state.journal].slice(0, MAX_JOURNAL_ENTRIES),
    ending: evaluateEnding(globalStats),
  };
}
