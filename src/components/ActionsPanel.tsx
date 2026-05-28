import type { Action, StrategicPosture } from "../types/game";

type ActionsPanelProps = {
  actions: Action[];
  disabled: boolean;
  maxSelections: number;
  selectedActionIds: string[];
  selectedPostureId: string;
  postures: StrategicPosture[];
  onPostureChange: (postureId: string) => void;
  onToggleAction: (action: Action) => void;
  onValidateTurn: () => void;
};

function getSelectionLabel(selectedCount: number, maxSelections: number): string {
  if (selectedCount === 0) {
    return `Sélectionnez 1 à ${maxSelections} interventions avant de valider.`;
  }

  return `${selectedCount}/${maxSelections} interventions sélectionnées.`;
}

export function ActionsPanel({
  actions,
  disabled,
  maxSelections,
  selectedActionIds,
  selectedPostureId,
  postures,
  onPostureChange,
  onToggleAction,
  onValidateTurn,
}: ActionsPanelProps) {
  const selectedActions = actions.filter((action) => selectedActionIds.includes(action.id));
  const selectionLimitReached = selectedActionIds.length >= maxSelections;
  const selectedPosture = postures.find((posture) => posture.id === selectedPostureId);

  return (
    <section className="panel" aria-labelledby="actions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Planification</p>
          <h2 id="actions-title">Stratégie du tour</h2>
        </div>
        <strong>{getSelectionLabel(selectedActionIds.length, maxSelections)}</strong>
      </div>
      <p className="panel-help">
        Choisissez une posture de lecture, puis préparez un paquet de 1 à 3 interventions. Les conséquences ne sont
        appliquées qu'après validation explicite du tour.
      </p>

      <div className="posture-selector" aria-label="Posture stratégique">
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
        <strong>Paquet en préparation</strong>
        {selectedActions.length > 0 ? (
          <ul>
            {selectedActions.map((action) => (
              <li key={action.id}>{action.name}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune intervention sélectionnée.</p>
        )}
      </div>

      <button
        className="validate-turn-button"
        disabled={disabled || selectedActionIds.length === 0}
        onClick={onValidateTurn}
        type="button"
      >
        Valider le tour
      </button>

      <div className="actions-list">
        {actions.map((action) => {
          const isSelected = selectedActionIds.includes(action.id);
          const isDisabled = disabled || (!isSelected && selectionLimitReached);

          return (
            <button
              className={`action-card${isSelected ? " action-card--selected" : ""}`}
              disabled={isDisabled}
              key={action.id}
              onClick={() => onToggleAction(action)}
              type="button"
            >
              <small className="action-card__category">{action.category}</small>
              <span>{action.name}</span>
              <small>{action.description}</small>
              <em>{action.promise}</em>
              <small className="action-card__risk">{action.risk}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
