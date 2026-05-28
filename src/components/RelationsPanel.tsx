import { getRelationStatus } from "../engine/relations";
import type { Block, InterBlockRelation } from "../types/game";
import { StatGauge } from "./StatGauge";

type RelationsPanelProps = {
  blocks: Block[];
  relations: InterBlockRelation[];
};

const domainLabels: Record<InterBlockRelation["domain"], string> = {
  security: "Sécurité",
  trade: "Commerce",
  climate: "Climat",
  technology: "Technologie",
  migration: "Migrations",
  information: "Information",
  resources: "Ressources",
};

export function RelationsPanel({ blocks, relations }: RelationsPanelProps) {
  const blockNames = new Map(blocks.map((block) => [block.id, block.name]));

  return (
    <section className="panel relations-panel" aria-labelledby="relations-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Monde autonome</p>
          <h2 id="relations-title">Tensions inter-blocs</h2>
        </div>
        <strong>{relations.length} relations suivies</strong>
      </div>
      <p className="panel-help">
        Quelques relations structurantes évoluent à chaque tour. Elles ne forment pas une diplomatie complète.
      </p>
      <div className="relations-list">
        {relations.map((relation) => (
          <article className={`relation-card relation-card--${getRelationStatus(relation)}`} key={relation.id}>
            <div>
              <small>{domainLabels[relation.domain]}</small>
              <h3>{relation.label}</h3>
              <p>
                {blockNames.get(relation.from)} ↔ {blockNames.get(relation.to)} · {getRelationStatus(relation)}
              </p>
              <p>{relation.recentTrend ?? "Tendance stable."}</p>
            </div>
            <div className="relation-card__gauges">
              <StatGauge label="Tension" value={relation.tension} tone="danger" />
              <StatGauge label="Coopération" value={relation.cooperation} />
              <StatGauge label="Dépendance" value={relation.dependence} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
