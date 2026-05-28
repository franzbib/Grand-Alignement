import type { Action } from "../types/game";

type ActionsPanelProps = {
  actions: Action[];
  disabled: boolean;
  onAction: (action: Action) => void;
};

export function ActionsPanel({ actions, disabled, onAction }: ActionsPanelProps) {
  return (
    <section className="panel" aria-labelledby="actions-title">
      <h2 id="actions-title">Interventions IA</h2>
      <div className="actions-list">
        {actions.map((action) => (
          <button
            className="action-card"
            disabled={disabled}
            key={action.id}
            onClick={() => onAction(action)}
            type="button"
          >
            <span>{action.name}</span>
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
