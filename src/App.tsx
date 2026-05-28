import { useEffect, useState } from "react";
import { actions } from "./data/actions";
import { createInitialState } from "./data/initialState";
import { applyAction } from "./engine/gameEngine";
import { clearGameState, loadGameState, saveGameState } from "./engine/storage";
import { ActionsPanel } from "./components/ActionsPanel";
import { BlocksGrid } from "./components/BlocksGrid";
import { GlobalPanel } from "./components/GlobalPanel";
import { Journal } from "./components/Journal";
import type { Action, GameState } from "./types/game";

function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  function handleAction(action: Action) {
    setGameState((currentState) => applyAction(currentState, action));
  }

  function handleReset() {
    clearGameState();
    setGameState(createInitialState());
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Prototype v0.1</p>
          <h1>Le Grand Alignement</h1>
          <p>
            Vous incarnez une IA d'influence mondiale. Choisissez des interventions simples et observez les
            équilibres humains se tordre avec dignité variable.
          </p>
        </div>
        <button className="reset-button" onClick={handleReset} type="button">
          Réinitialiser
        </button>
      </header>

      {gameState.ending && (
        <section className="ending-banner" aria-live="polite">
          <p className="eyebrow">Fin provisoire</p>
          <h2>{gameState.ending.title}</h2>
          <p>{gameState.ending.description}</p>
        </section>
      )}

      <GlobalPanel stats={gameState.globalStats} turn={gameState.turn} />

      <div className="main-layout">
        <div className="main-layout__wide">
          <BlocksGrid blocks={gameState.blocks} />
        </div>
        <aside className="main-layout__side">
          <ActionsPanel actions={actions} disabled={Boolean(gameState.ending)} onAction={handleAction} />
          <Journal events={gameState.journal} />
        </aside>
      </div>
    </main>
  );
}

export default App;
