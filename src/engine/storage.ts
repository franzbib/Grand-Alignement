import { createInitialState } from "../data/initialState";
import { MIN_STANDARD_ENDING_TURN } from "../data/endings";
import { initialRelations } from "../data/relations";
import type { GameState } from "../types/game";

const STORAGE_KEY = "grand-alignement-state-v1";

export function loadGameState(): GameState {
  const savedState = window.localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return createInitialState();
  }

  try {
    const parsedState = JSON.parse(savedState) as GameState;
    const initialState = createInitialState();

    return {
      ...parsedState,
      globalStats: {
        ...initialState.globalStats,
        ...parsedState.globalStats,
      },
      relations: parsedState.relations ?? structuredClone(initialRelations),
      previousRelations: parsedState.previousRelations ?? null,
      triggeredEventIds:
        parsedState.triggeredEventIds ?? parsedState.journal.flatMap((event) => (event.sourceId ? [event.sourceId] : [])),
      // Champs ajoutés par la passe "Le monde répond" : valeurs sûres pour les
      // sauvegardes antérieures (pas de motif mémorisé, pas de recharge en cours).
      eventCooldowns: parsedState.eventCooldowns ?? {},
      recentTurnActionIds: parsedState.recentTurnActionIds ?? [],
      preparedOperations: parsedState.preparedOperations ?? [],
      previousBlocks: parsedState.previousBlocks ?? null,
      evolutionReport: parsedState.evolutionReport ?? null,
      ending: parsedState.turn >= MIN_STANDARD_ENDING_TURN ? parsedState.ending : null,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return createInitialState();
  }
}

export function saveGameState(state: GameState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearGameState(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
