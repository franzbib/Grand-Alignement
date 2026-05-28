import type { Action, Block, InfluenceTarget, PlannedIntervention, StrategicPosture } from "../types/game";

type ActionsPanelProps = {
  actions: Action[];
  blocks: Block[];
  disabled: boolean;
  influenceCapacity: number;
  plannedInterventions: PlannedIntervention[];
  selectedPostureId: string;
  postures: StrategicPosture[];
  onPostureChange: (postureId: string) => void;
  onToggleAction: (action: Action) => void;
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

export function ActionsPanel({
  actions,
  blocks,
  disabled,
  influenceCapacity,
  plannedInterventions,
  selectedPostureId,
  postures,
  onPostureChange,
  onToggleAction,
  onTargetChange,
  onValidateTurn,
}: ActionsPanelProps) {
  const actionById = new Map(actions.map((action) => [action.id, action]));
  const influenceUsed = plannedInterventions.reduce((total, intervention) => {
    return total + (actionById.get(intervention.actionId)?.cost ?? 0);
  }, 0);
  const influenceRemaining = influenceCapacity - influenceUsed;
  const selectedPosture = postures.find((posture) => posture.id === selectedPostureId);

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
      <p className="panel-help">Composez une opération d'influence. Le monde n'en connaît pas l'origine.</p>

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

      {selectedPosture && <p className="posture-note">{selectedPosture.description}</p>}

      <div className="selected-actions" aria-live="polite">
        <strong>Opération en préparation</strong>
        {plannedInterventions.length > 0 ? (
          <ul>
            {plannedInterventions.map((intervention) => {
              const action = actionById.get(intervention.actionId);
              const targetLabel =
                intervention.target === "global"
                  ? "global"
                  : blocks.find((block) => block.id === intervention.target)?.name ?? "cible";

              return action ? (
                <li key={intervention.actionId}>
                  {action.name} <span>{targetLabel}</span>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p>Aucune intervention sélectionnée.</p>
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

      <div className="actions-list">
        {actions.map((action) => {
          const intervention = plannedInterventions.find((planned) => planned.actionId === action.id);
          const isSelected = Boolean(intervention);
          const isDisabled = disabled || (!isSelected && action.cost > influenceRemaining);
          const targetOptions = getTargetOptions(action, blocks);

          return (
            <article className={`action-card${isSelected ? " action-card--selected" : ""}`} key={action.id}>
              <button disabled={isDisabled} onClick={() => onToggleAction(action)} type="button">
                <small className="action-card__category">
                  {action.category} · coût {action.cost}
                </small>
                <span>{action.name}</span>
                <small>{action.description}</small>
                <em>{action.promise}</em>
                <small className="action-card__risk">{action.risk}</small>
              </button>

              {isSelected && targetOptions.length > 1 && (
                <label className="target-control">
                  Cible
                  <select
                    disabled={disabled}
                    onChange={(event) => onTargetChange(action.id, event.target.value as InfluenceTarget)}
                    value={intervention?.target ?? action.defaultTarget}
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
        })}
      </div>
    </section>
  );
}
