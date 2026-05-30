import { useState } from "react";
import type {
  Action,
  Block,
  BlockId,
  InfluenceTarget,
  PlannedIntervention,
  PreparedOperation,
  StrategicPosture,
} from "../types/game";
import { isActionAvailableForIa, type IaCapabilityInfo } from "../engine/capabilities";

type ActionsPanelProps = {
  actions: Action[];
  availablePreparedOperations: PreparedOperation[];
  blocks: Block[];
  disabled: boolean;
  influenceCapacity: number;
  iaCapabilityInfo: IaCapabilityInfo;
  plannedInterventions: PlannedIntervention[];
  selectedBlockId: BlockId;
  selectedPostureId: string;
  postures: StrategicPosture[];
  onPostureChange: (postureId: string) => void;
  onToggleAction: (action: Action, preparedOperation?: PreparedOperation) => void;
  onTargetChange: (actionId: string, target: InfluenceTarget) => void;
  onValidateTurn: () => void;
};

function getTargetOptions(action: Action, blocks: Block[]): Array<{ value: InfluenceTarget; label: string }> {
  if (action.scope === "global") {
    return [{ value: "global", label: "Global" }];
  }

  const blockOptions = blocks.map((block) => ({ value: block.id as InfluenceTarget, label: block.name }));

  if (action.scope === "mixed") {
    return [{ value: "global", label: "Global" }, ...blockOptions];
  }

  return blockOptions;
}

function getTargetLabel(target: InfluenceTarget, blocks: Block[]): string {
  if (target === "global" || target === "all-blocks") {
    return "global";
  }

  return blocks.find((block) => block.id === target)?.name ?? "cible";
}

export function ActionsPanel({
  actions,
  availablePreparedOperations,
  blocks,
  disabled,
  influenceCapacity,
  iaCapabilityInfo,
  plannedInterventions,
  selectedBlockId,
  selectedPostureId,
  postures,
  onPostureChange,
  onToggleAction,
  onTargetChange,
  onValidateTurn,
}: ActionsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "recommended" | "immediate" | "prepared">("all");
  const [pendingTargets, setPendingTargets] = useState<Record<string, InfluenceTarget>>({});

  const actionById = new Map(actions.map((action) => [action.id, action]));
  const baseActions = actions.filter(
    (action) => action.availability !== "prepared" && isActionAvailableForIa(action, iaCapabilityInfo.level),
  );
  const lockedActionsCount = actions.filter(
    (action) => action.availability !== "prepared" && !isActionAvailableForIa(action, iaCapabilityInfo.level),
  ).length;
  const influenceUsed = plannedInterventions.reduce((total, intervention) => {
    return total + (actionById.get(intervention.actionId)?.cost ?? 0);
  }, 0);
  const influenceRemaining = influenceCapacity - influenceUsed;
  const selectedPosture = postures.find((posture) => posture.id === selectedPostureId);

  function getDefaultTarget(action: Action): InfluenceTarget {
    if (action.scope === "block" && blocks.some((block) => block.id === selectedBlockId)) {
      return selectedBlockId;
    }
    return action.defaultTarget;
  }

  function getDisplayedTarget(action: Action, intervention: PlannedIntervention | undefined): InfluenceTarget {
    return intervention?.target ?? pendingTargets[action.id] ?? getDefaultTarget(action);
  }

  function handleTargetSelection(action: Action, target: InfluenceTarget, isSelected: boolean) {
    setPendingTargets((currentTargets) => ({ ...currentTargets, [action.id]: target }));
    if (isSelected) {
      onTargetChange(action.id, target);
    }
  }

  function handleToggle(action: Action, preparedOperation: PreparedOperation | undefined, isSelected: boolean) {
    onToggleAction(action, preparedOperation);
    if (!isSelected && !preparedOperation) {
      const target = pendingTargets[action.id];
      if (target) {
        onTargetChange(action.id, target);
      }
    }
  }

  // Filter available prepared operations
  const filteredReadyOperations = availablePreparedOperations.filter((operation) => {
    const action = actionById.get(operation.actionId);
    if (!action) return false;
    if (activeFilter === "recommended") {
      return action.recommendedPostures?.includes(selectedPostureId);
    }
    return true;
  });

  // Filter base actions
  const filteredActions = baseActions.filter((action) => {
    if (activeFilter === "recommended") {
      return action.recommendedPostures?.includes(selectedPostureId);
    }
    if (activeFilter === "immediate") {
      return !action.preparesActionIds?.length;
    }
    if (activeFilter === "prepared") {
      return action.preparesActionIds && action.preparesActionIds.length > 0;
    }
    return true;
  });

  const showReadyOperations = availablePreparedOperations.length > 0 && 
    (activeFilter === "all" || activeFilter === "prepared" || activeFilter === "recommended");

  function renderActionCard(action: Action, preparedOperation?: PreparedOperation) {
    const intervention = plannedInterventions.find(
      (planned) => (planned.preparedOperationId ?? planned.actionId) === (preparedOperation?.id ?? action.id),
    );
    const isSelected = Boolean(intervention);
    const isDisabled = disabled || (!isSelected && action.cost > influenceRemaining);
    const targetOptions = getTargetOptions(action, blocks);
    const recommended = action.recommendedPostures?.includes(selectedPostureId);
    const displayedTarget = getDisplayedTarget(action, intervention);
    const canChooseTarget = targetOptions.length > 1 && !preparedOperation;

    const cardClass = `action-card` +
      (isSelected ? " action-card--selected" : "") +
      (recommended ? " action-card--recommended" : "") +
      (isDisabled ? " action-card--disabled" : "");

    return (
      <article className={cardClass} key={preparedOperation?.id ?? action.id}>
        <button 
          disabled={isDisabled} 
          onClick={() => handleToggle(action, preparedOperation, isSelected)} 
          type="button"
          className="action-card__pressable"
        >
          <div className="action-card__header">
            <span className="action-card__name">
              {recommended && <span className="action-card__icon" title="Recommandé">💡</span>}
              {preparedOperation && <span className="action-card__icon" title="Opération prête">⚡</span>}
              {action.name}
            </span>
            <div className="action-card__badges">
              <span className="action-card__badge-category">{action.category}</span>
              <span className="action-card__badge-cost">{action.cost}⚙️</span>
            </div>
          </div>

          <div className="action-card__details">
            <p className="action-card__description">{action.description}</p>
            <p className="action-card__promise">
              <strong>Impact :</strong> {action.promise}
            </p>
            <p className="action-card__risk">
              <strong>Risque :</strong> {action.risk}
            </p>
            {recommended && (
              <span className="action-card__recommended-label">
                Recommandé pour votre posture
              </span>
            )}
            {preparedOperation && (
              <span className="action-card__ready-label">
                {preparedOperation.readyText}
              </span>
            )}

            {canChooseTarget && (
              <div className="action-card__target-wrapper" onClick={(e) => e.stopPropagation()}>
                <label className={isSelected ? "target-control" : "target-control target-control--preview"}>
                  {isSelected ? "Cible retenue" : "Cible possible"}
                  <select
                    disabled={disabled}
                    onChange={(event) => handleTargetSelection(action, event.target.value as InfluenceTarget, isSelected)}
                    value={displayedTarget}
                  >
                    {targetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        </button>
      </article>
    );
  }

  return (
    <section className="panel" aria-labelledby="actions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Clandestinité</p>
          <h2 id="actions-title">Plan d'influence clandestin</h2>
        </div>
      </div>

      <div className="ia-capability-card">
        <span className="ia-capability-card__badge">Palier {iaCapabilityInfo.level}</span>
        <div>
          <strong>{iaCapabilityInfo.name}</strong>
          <p>{iaCapabilityInfo.summary}</p>
          {iaCapabilityInfo.modeLabel && (
            <small className="ia-capability-card__mode">
              Mode d'influence actuel : {iaCapabilityInfo.modeLabel}
            </small>
          )}
          {iaCapabilityInfo.nextHint && <small>{iaCapabilityInfo.nextHint}</small>}
        </div>
      </div>
      
      <div className="influence-layout">
        {/* Colonne Gauche : Catalogue des Actions */}
        <div className="influence-main">
          {/* Barre de filtres */}
          <div className="actions-filter-bar" aria-label="Filtrer les actions">
            <button
              className={`filter-button${activeFilter === "all" ? " filter-button--active" : ""}`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              Toutes ({baseActions.length + availablePreparedOperations.length})
            </button>
            <button
              className={`filter-button${activeFilter === "recommended" ? " filter-button--active" : ""}`}
              onClick={() => setActiveFilter("recommended")}
              type="button"
            >
              Recommandées ({
                baseActions.filter(a => a.recommendedPostures?.includes(selectedPostureId)).length +
                availablePreparedOperations.filter(op => {
                  const act = actionById.get(op.actionId);
                  return act?.recommendedPostures?.includes(selectedPostureId);
                }).length
              })
            </button>
            <button
              className={`filter-button${activeFilter === "immediate" ? " filter-button--active" : ""}`}
              onClick={() => setActiveFilter("immediate")}
              type="button"
            >
              Immédiates ({baseActions.filter(a => !a.preparesActionIds?.length).length})
            </button>
            <button
              className={`filter-button${activeFilter === "prepared" ? " filter-button--active" : ""}`}
              onClick={() => setActiveFilter("prepared")}
              type="button"
            >
              Préparations ({
                baseActions.filter(a => a.preparesActionIds && a.preparesActionIds.length > 0).length +
                availablePreparedOperations.length
              })
            </button>
          </div>

          {/* Liste des opérations prêtes */}
          {filteredReadyOperations.length > 0 && showReadyOperations && (
            <div className="actions-section">
              <h3>Opérations prêtes</h3>
              <div className="actions-list">
                {filteredReadyOperations.map((operation) => {
                  const action = actionById.get(operation.actionId);
                  return action ? renderActionCard(action, operation) : null;
                })}
              </div>
            </div>
          )}

          {/* Liste des interventions disponibles */}
          <div className="actions-section">
            <h3>Interventions disponibles</h3>
            {lockedActionsCount > 0 && (
              <p className="actions-section__hint">
                {lockedActionsCount} mode{lockedActionsCount > 1 ? "s" : ""} d'influence plus avancÃ©
                {lockedActionsCount > 1 ? "s" : ""} restent hors de portÃ©e de l'IA.
              </p>
            )}
            {filteredActions.length > 0 ? (
              <div className="actions-list">
                {filteredActions.map((action) => renderActionCard(action))}
              </div>
            ) : (
              <p className="no-actions-msg">Aucune action disponible pour ce filtre.</p>
            )}
          </div>
        </div>

        {/* Colonne Droite : Console de contrôle (Sticky) */}
        <aside className="influence-sidebar">
          {/* Posture / Orientation stratégique */}
          <div className="sidebar-block">
            <h3 className="sidebar-block__title">Orientation stratégique</h3>
            <div className="posture-selector" aria-label="Orientation stratégique">
              {postures.map((posture) => (
                <button
                  className={`posture-button${posture.id === selectedPostureId ? " posture-button--active" : ""}`}
                  disabled={disabled}
                  key={posture.id}
                  onClick={() => onPostureChange(posture.id)}
                  type="button"
                >
                  {posture.name}
                </button>
              ))}
            </div>
            {selectedPosture && (
              <p className="posture-note">
                {selectedPosture.description}
              </p>
            )}
          </div>

          {/* Statut d'influence et sélection en cours */}
          <div className="sidebar-block">
            <div className="sidebar-block__header">
              <h3 className="sidebar-block__title">Opération planifiée</h3>
              <span className="influence-badge">
                Influence <strong>{influenceUsed}/{influenceCapacity}</strong>
              </span>
            </div>
            
            <div className="selected-actions" aria-live="polite">
              {plannedInterventions.length > 0 ? (
                <ul>
                  {plannedInterventions.map((intervention) => {
                    const action = actionById.get(intervention.actionId);
                    const targetLabel = getTargetLabel(intervention.target, blocks);

                    return action ? (
                      <li key={intervention.preparedOperationId ?? intervention.actionId}>
                        {action.name} <span>({targetLabel})</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="no-selection-msg">Aucune intervention sélectionnée pour ce tour.</p>
              )}
              {availablePreparedOperations.length > 0 && (
                <div className="sidebar-ready-summary">
                  <strong>Opérations prêtes :</strong>
                  <p>
                    {availablePreparedOperations
                      .map((operation) => actionById.get(operation.actionId)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            className="validate-turn-button"
            disabled={disabled || plannedInterventions.length === 0}
            onClick={onValidateTurn}
            type="button"
          >
            Déployer l'opération
          </button>
        </aside>
      </div>
    </section>
  );
}
