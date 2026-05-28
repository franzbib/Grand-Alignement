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
      <p className="panel-help">
        Choisissez un levier systémique. Les jauges, la carte et le journal racontent ensuite ce que le monde en fait.
      </p>
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
