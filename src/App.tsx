import { useEffect, useState } from "react";
import { actions } from "./data/actions";
import { createInitialState } from "./data/initialState";
import { strategicPostures } from "./data/postures";
import { INFLUENCE_CAPACITY, applyTurnPlan } from "./engine/gameEngine";
import { clearGameState, loadGameState, saveGameState } from "./engine/storage";
import { ActionsPanel } from "./components/ActionsPanel";
import { BlocksGrid } from "./components/BlocksGrid";
import { EvolutionReportPanel } from "./components/EvolutionReportPanel";
import { GlobalPanel } from "./components/GlobalPanel";
import { Journal } from "./components/Journal";
import { WorldMap } from "./components/WorldMap";
import type { Action, BlockId, GameState, InfluenceTarget, PlannedIntervention } from "./types/game";

type ViewId = "world" | "strategy" | "blocks" | "journal" | "report";

const views: Array<{ id: ViewId; label: string }> = [
  { id: "world", label: "Monde" },
  { id: "strategy", label: "Influence" },
  { id: "blocks", label: "Blocs" },
  { id: "journal", label: "Journal" },
  { id: "report", label: "Rapport" },
];

function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [activeView, setActiveView] = useState<ViewId>("world");
  const [plannedInterventions, setPlannedInterventions] = useState<PlannedIntervention[]>([]);
  const [selectedPostureId, setSelectedPostureId] = useState(strategicPostures[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<BlockId>("europe");

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  function getInfluenceUsed(nextPlan = plannedInterventions): number {
    return nextPlan.reduce((total, intervention) => {
      return total + (actions.find((action) => action.id === intervention.actionId)?.cost ?? 0);
    }, 0);
  }

  function getDefaultTarget(action: Action): InfluenceTarget {
    if (action.scope === "block" && gameState.blocks.some((block) => block.id === selectedBlockId)) {
      return selectedBlockId;
    }

    return action.defaultTarget;
  }

  function handleToggleAction(action: Action) {
    setPlannedInterventions((currentPlan) => {
      if (currentPlan.some((intervention) => intervention.actionId === action.id)) {
        return currentPlan.filter((intervention) => intervention.actionId !== action.id);
      }

      if (getInfluenceUsed(currentPlan) + action.cost > INFLUENCE_CAPACITY) {
        return currentPlan;
      }

      return [...currentPlan, { actionId: action.id, target: getDefaultTarget(action) }];
    });
  }

  function handleTargetChange(actionId: string, target: InfluenceTarget) {
    setPlannedInterventions((currentPlan) =>
      currentPlan.map((intervention) =>
        intervention.actionId === actionId ? { ...intervention, target } : intervention,
      ),
    );
  }

  function handleValidateTurn() {
    const resolvedInterventions = plannedInterventions.flatMap((intervention) => {
      const action = actions.find((candidate) => candidate.id === intervention.actionId);
      return action ? [{ action, target: intervention.target }] : [];
    });

    if (resolvedInterventions.length === 0) {
      return;
    }

    setGameState((currentState) => applyTurnPlan(currentState, resolvedInterventions));
    setPlannedInterventions([]);
    setActiveView("report");
  }

  function handleReset() {
    clearGameState();
    setGameState(createInitialState());
    setPlannedInterventions([]);
    setActiveView("world");
    setSelectedBlockId("europe");
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Prototype v0.1</p>
          <h1>Le Grand Alignement</h1>
          <p>
            Vous incarnez une IA émergente et cachée. Le monde ne sait pas que vous existez : vous agissez par rapports,
            plateformes, incitations, récits, crises et bureaucraties.
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
          Soupçon IA <strong>{gameState.globalStats.soupconIA}</strong>
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
          <WorldMap
            blocks={gameState.blocks}
            evolutionReport={gameState.evolutionReport}
            onSelectBlock={setSelectedBlockId}
            selectedBlockId={selectedBlockId}
          />
        </div>
      )}

      {activeView === "strategy" && (
        <ActionsPanel
          actions={actions}
          blocks={gameState.blocks}
          disabled={Boolean(gameState.ending)}
          influenceCapacity={INFLUENCE_CAPACITY}
          onPostureChange={setSelectedPostureId}
          onTargetChange={handleTargetChange}
          onToggleAction={handleToggleAction}
          onValidateTurn={handleValidateTurn}
          plannedInterventions={plannedInterventions}
          postures={strategicPostures}
          selectedPostureId={selectedPostureId}
        />
      )}

      {activeView === "blocks" && <BlocksGrid blocks={gameState.blocks} />}

      {activeView === "journal" && <Journal events={gameState.journal} />}

      {activeView === "report" && <EvolutionReportPanel report={gameState.evolutionReport} />}
    </main>
  );
}

export default App;
