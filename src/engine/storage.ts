import { createInitialState } from "../data/initialState";
import type { GameState } from "../types/game";

const STORAGE_KEY = "grand-alignement-state-v1";

export function loadGameState(): GameState {
  const savedState = window.localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return createInitialState();
  }

  try {
    return JSON.parse(savedState) as GameState;
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
