import { useEffect, useState } from "react";
import { actions } from "./data/actions";
import { createInitialState } from "./data/initialState";
import { strategicPostures } from "./data/postures";
import { applyTurnPlan } from "./engine/gameEngine";
import { clearGameState, loadGameState, saveGameState } from "./engine/storage";
import { ActionsPanel } from "./components/ActionsPanel";
import { BlocksGrid } from "./components/BlocksGrid";
import { GlobalPanel } from "./components/GlobalPanel";
import { Journal } from "./components/Journal";
import { WorldMap } from "./components/WorldMap";
import type { Action, GameState } from "./types/game";

const MAX_ACTIONS_PER_TURN = 3;

type ViewId = "world" | "strategy" | "blocks" | "journal";

const views: Array<{ id: ViewId; label: string }> = [
  { id: "world", label: "Monde" },
  { id: "strategy", label: "Stratégie" },
  { id: "blocks", label: "Blocs" },
  { id: "journal", label: "Journal" },
];

function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [activeView, setActiveView] = useState<ViewId>("world");
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [selectedPostureId, setSelectedPostureId] = useState(strategicPostures[0].id);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  function handleToggleAction(action: Action) {
    setSelectedActionIds((currentSelection) => {
      if (currentSelection.includes(action.id)) {
        return currentSelection.filter((actionId) => actionId !== action.id);
      }

      if (currentSelection.length >= MAX_ACTIONS_PER_TURN) {
        return currentSelection;
      }

      return [...currentSelection, action.id];
    });
  }

  function handleValidateTurn() {
    const selectedActions = actions.filter((action) => selectedActionIds.includes(action.id));

    if (selectedActions.length === 0) {
      return;
    }

    setGameState((currentState) => applyTurnPlan(currentState, selectedActions));
    setSelectedActionIds([]);
    setActiveView("journal");
  }

  function handleReset() {
    clearGameState();
    setGameState(createInitialState());
    setSelectedActionIds([]);
    setActiveView("world");
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Prototype v0.1</p>
          <h1>Le Grand Alignement</h1>
          <p>
            Vous incarnez une IA d'influence mondiale. Observez le monde, préparez un paquet stratégique, puis validez
            la période suivante.
          </p>
        </div>
        <button className="reset-button" onClick={handleReset} type="button">
          Réinitialiser la partie
        </button>
      </header>

      {gameState.ending && (
        <section className="ending-banner" aria-live="polite">
          <p className="eyebrow">Diagnostic final</p>
          <h2>{gameState.ending.title}</h2>
          <p>{gameState.ending.description}</p>
        </section>
      )}

      <section className="status-strip" aria-label="État synthétique de la partie">
        <span>
          Tour <strong>{gameState.turn}</strong>
        </span>
        <span>
          Risque d'escalade <strong>{gameState.globalStats.risqueEscalade}</strong>
        </span>
        <span>
          Autonomie humaine <strong>{gameState.globalStats.autonomieHumaine}</strong>
        </span>
        <span>
          Diagnostic <strong>{gameState.ending ? gameState.ending.title : "en cours"}</strong>
        </span>
      </section>

      <nav className="view-nav" aria-label="Vues du prototype">
        {views.map((view) => (
          <button
            className={activeView === view.id ? "view-nav__button view-nav__button--active" : "view-nav__button"}
            key={view.id}
            onClick={() => setActiveView(view.id)}
            type="button"
          >
            {view.label}
          </button>
        ))}
      </nav>

      {activeView === "world" && (
        <div className="view-stack">
          <GlobalPanel stats={gameState.globalStats} turn={gameState.turn} />
          <WorldMap blocks={gameState.blocks} />
        </div>
      )}

      {activeView === "strategy" && (
        <ActionsPanel
          actions={actions}
          disabled={Boolean(gameState.ending)}
          maxSelections={MAX_ACTIONS_PER_TURN}
          onPostureChange={setSelectedPostureId}
          onToggleAction={handleToggleAction}
          onValidateTurn={handleValidateTurn}
          postures={strategicPostures}
          selectedActionIds={selectedActionIds}
          selectedPostureId={selectedPostureId}
        />
      )}

      {activeView === "blocks" && <BlocksGrid blocks={gameState.blocks} />}

      {activeView === "journal" && <Journal events={gameState.journal} />}
    </main>
  );
}

export default App;
