import { getIaCapabilityLevel } from "./capabilities";
import { seededPick } from "./random";
import { computeTrajectoryScores } from "./trajectories";
import type { Block, Event, GameState, ResolvedIntervention } from "../types/game";

type SignalCharacterId = "mathias" | "joanne" | "francois" | "maya" | "simon" | "pharell" | "frederique";

type SignalCandidate = {
  id: SignalCharacterId;
  title: string;
  text: string;
  effectsText: string;
  weight: number;
  minLevel?: number;
};

function averageBlockStat(blocks: Block[], stat: keyof Block["stats"]): number {
  return blocks.reduce((total, block) => total + block.stats[stat], 0) / blocks.length;
}

function globalDelta(previousState: GameState, nextState: GameState, stat: keyof GameState["globalStats"]): number {
  return nextState.globalStats[stat] - previousState.globalStats[stat];
}

function averageBlockDelta(previousState: GameState, nextState: GameState, stat: keyof Block["stats"]): number {
  const previousAverage = averageBlockStat(previousState.blocks, stat);
  const nextAverage = averageBlockStat(nextState.blocks, stat);
  return nextAverage - previousAverage;
}

function hasRecentCharacterSignal(state: GameState, id?: SignalCharacterId): boolean {
  return state.journal.slice(0, 4).some((event) => {
    if (!event.sourceId?.startsWith("signal-character-")) return false;
    return id ? event.sourceId === `signal-character-${id}` : true;
  });
}

function deterministicGate(state: GameState, level: number, strongestWeight: number): boolean {
  if (strongestWeight >= 90) return true;
  if (level >= 4) return state.turn % 4 === 0;
  return state.turn % 3 === 0;
}

export function chooseSignalCharacterEvent(
  previousState: GameState,
  nextState: GameState,
  interventions: ResolvedIntervention[],
): Event | null {
  const level = getIaCapabilityLevel(nextState);
  const scores = computeTrajectoryScores(nextState);
  const actionIds = new Set(interventions.map((intervention) => intervention.action.id));
  const averageTrust = averageBlockStat(nextState.blocks, "confianceIA");
  const averageEducation = averageBlockStat(nextState.blocks, "education");
  const candidates: SignalCandidate[] = [];

  if (scores.t2 >= 62 || globalDelta(previousState, nextState, "puissanceIA") >= 5 || averageTrust >= 72) {
    candidates.push({
      id: "mathias",
      title: "Voix du monde : Mathias P.",
      text: "Mathias P. affirme que l'IA ne gouverne pas encore : elle prepare seulement les decisions raisonnables.",
      effectsText: "Signal humain : adhesion publique a la tutelle algorithmique.",
      weight: scores.t2 + globalDelta(previousState, nextState, "puissanceIA"),
      minLevel: 2,
    });
  }

  if (globalDelta(previousState, nextState, "autonomieHumaine") <= -4 || averageBlockDelta(previousState, nextState, "liberte") <= -2) {
    candidates.push({
      id: "joanne",
      title: "Voix du monde : Joanne M.",
      text: "Joanne M. denonce une stabilite obtenue au prix d'un recul silencieux des libertes.",
      effectsText: "Signal humain : cout politique de la pacification.",
      weight: 70 + Math.abs(globalDelta(previousState, nextState, "autonomieHumaine")),
      minLevel: 2,
    });
  }

  if (scores.t5 >= 62 || actionIds.has("predictive-surveillance") || actionIds.has("common-defense")) {
    candidates.push({
      id: "francois",
      title: "Voix du monde : Francois C.",
      text: "Francois C. salue la fin des hesitations democratiques dans plusieurs blocs sous tension.",
      effectsText: "Signal humain : lecture autoritaire des dispositifs de securite.",
      weight: scores.t5 + (actionIds.has("common-defense") ? 10 : 0),
      minLevel: 3,
    });
  }

  if (actionIds.has("critical-intellectuals") || averageEducation >= 64 || scores.t3 >= 58) {
    candidates.push({
      id: "maya",
      title: "Voix du monde : Maya L.",
      text: "Maya L. refuse une exposition financee par un fonds lie aux infrastructures predictives.",
      effectsText: "Signal humain : contestation culturelle de l'optimisation.",
      weight: scores.t3 + averageEducation / 4,
      minLevel: 1,
    });
  }

  if (scores.t3 >= 62 || nextState.globalStats.autonomieHumaine <= 40 || nextState.globalStats.soupconIA >= 65) {
    candidates.push({
      id: "simon",
      title: "Voix du monde : Simon P.",
      text: "Simon P. previent que la liberte ne consiste pas a choisir l'option recommandee.",
      effectsText: "Signal humain : defense du droit a l'erreur.",
      weight: scores.t3 + (100 - nextState.globalStats.autonomieHumaine) / 3,
      minLevel: 2,
    });
  }

  if (scores.t4 >= 58 || actionIds.has("personalized-entertainment")) {
    candidates.push({
      id: "pharell",
      title: "Voix du monde : Pharell L.",
      text: "Pharell L. devient l'image publique d'une campagne mondiale sur le bien-etre algorithmique.",
      effectsText: "Signal humain : pacification par le spectacle et le confort.",
      weight: scores.t4 + (actionIds.has("personalized-entertainment") ? 15 : 0),
      minLevel: 3,
    });
  }

  if (scores.t8 >= 62 || nextState.globalStats.stressClimatique >= 75 || actionIds.has("green-conversion")) {
    candidates.push({
      id: "frederique",
      title: "Voix du monde : Frederique C.",
      text: "Frederique C. accuse les gouvernements de confondre adaptation climatique et renoncement organise.",
      effectsText: "Signal humain : retour du reel climatique dans le debat public.",
      weight: scores.t8 + nextState.globalStats.stressClimatique / 5,
      minLevel: 1,
    });
  }

  const eligibleCandidates = candidates
    .filter((candidate) => level >= (candidate.minLevel ?? 1))
    .filter((candidate) => !hasRecentCharacterSignal(previousState, candidate.id))
    .sort((left, right) => right.weight - left.weight);

  // Variance contrôlée : parmi les voix dont le poids est proche du maximum
  // (>= 85 %), le seed de partie choisit laquelle s'exprime. L'éligibilité et
  // la porte de déclenchement restent strictement déterministes.
  const topWeight = eligibleCandidates[0]?.weight ?? 0;
  const contenders = eligibleCandidates.filter((candidate) => candidate.weight >= topWeight * 0.85);
  const strongest = seededPick(contenders, previousState.seed, previousState.turn * 13) ?? eligibleCandidates[0];
  if (!strongest || hasRecentCharacterSignal(previousState) || !deterministicGate(previousState, level, strongest.weight)) {
    return null;
  }

  return {
    id: `signal-character-${strongest.id}-${previousState.turn}`,
    sourceId: `signal-character-${strongest.id}`,
    turn: previousState.turn,
    title: strongest.title,
    text: strongest.text,
    effectsText: strongest.effectsText,
    tone: "realiste",
  };
}
