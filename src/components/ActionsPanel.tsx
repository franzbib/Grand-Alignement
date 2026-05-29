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

type ActionsPanelProps = {
  actions: Action[];
  availablePreparedOperations: PreparedOperation[];
  blocks: Block[];
  disabled: boolean;
  influenceCapacity: number;
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
  plannedInterventions,
  selectedBlockId,
  selectedPostureId,
  postures,
  onPostureChange,
  onToggleAction,
  onTargetChange,
  onValidateTurn,
}: ActionsPanelProps) {
  const actionById = new Map(actions.map((action) => [action.id, action]));
  const baseActions = actions.filter((action) => action.availability !== "prepared");
  const influenceUsed = plannedInterventions.reduce((total, intervention) => {
    return total + (actionById.get(intervention.actionId)?.cost ?? 0);
  }, 0);
  const influenceRemaining = influenceCapacity - influenceUsed;
  const selectedPosture = postures.find((posture) => posture.id === selectedPostureId);
  const [pendingTargets, setPendingTargets] = useState<Record<string, InfluenceTarget>>({});

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

    return (
      <article className={`action-card${isSelected ? " action-card--selected" : ""}`} key={preparedOperation?.id ?? action.id}>
        <button disabled={isDisabled} onClick={() => handleToggle(action, preparedOperation, isSelected)} type="button">
          <small className="action-card__category">
            {action.category} · coût {action.cost}
          </small>
          <span>{action.name}</span>
          <small>{action.description}</small>
          <em>{action.promise}</em>
          <small className="action-card__risk">{action.risk}</small>
          {recommended && <small className="action-card__recommendation">Recommandé pour cette orientation</small>}
          {preparedOperation && <small className="action-card__ready">{preparedOperation.readyText}</small>}
        </button>

        {canChooseTarget && (
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
        )}
      </article>
    );
  }

  return (
    <section className="panel" aria-labelledby="actions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Orientation stratégique</p>
          <h2 id="actions-title">Plan d'influence clandestin</h2>
        </div>
        <strong>
          Influence {influenceUsed}/{influenceCapacity}, reste {Math.max(0, influenceRemaining)}
        </strong>
      </div>
      <p className="panel-help">
        Préparez une opération. Certaines actions créent des possibilités pour les tours suivants.
      </p>

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
          {selectedPosture.description} Elle ne décide pas à votre place : elle organise votre lecture du tour.
        </p>
      )}

      <div className="selected-actions" aria-live="polite">
        <strong>Opération en préparation</strong>
        {plannedInterventions.length > 0 ? (
          <ul>
            {plannedInterventions.map((intervention) => {
              const action = actionById.get(intervention.actionId);
              const targetLabel = getTargetLabel(intervention.target, blocks);

              return action ? (
                <li key={intervention.preparedOperationId ?? intervention.actionId}>
                  {action.name} <span>{targetLabel}</span>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p>Aucune intervention sélectionnée.</p>
        )}
        {availablePreparedOperations.length > 0 && (
          <p className="selected-actions__ready">
            Opérations prêtes :{" "}
            {availablePreparedOperations
              .map((operation) => actionById.get(operation.actionId)?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </div>

      <button
        className="validate-turn-button"
        disabled={disabled || plannedInterventions.length === 0}
        onClick={onValidateTurn}
        type="button"
      >
        Déployer l'opération
      </button>

      {availablePreparedOperations.length > 0 && (
        <div className="actions-section">
          <h3>Opérations prêtes</h3>
          <div className="actions-list">
            {availablePreparedOperations.map((operation) => {
              const action = actionById.get(operation.actionId);
              return action ? renderActionCard(action, operation) : null;
            })}
          </div>
        </div>
      )}

      <div className="actions-section">
        <h3>Interventions disponibles</h3>
        <div className="actions-list">{baseActions.map((action) => renderActionCard(action))}</div>
      </div>
    </section>
  );
}
