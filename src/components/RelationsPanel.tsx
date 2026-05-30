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

function getGlobalDiplomaticSynthesis(relations: InterBlockRelation[]): string {
  const criticalCount = relations.filter((r) => getRelationStatus(r) === "critique").length;
  const tensedCount = relations.filter((r) => getRelationStatus(r) === "tendue").length;
  const peacefulCount = relations.filter((r) => getRelationStatus(r) === "apaisée").length;

  if (criticalCount >= 2) {
    return "Plusieurs relations ont atteint un niveau critique. La coopération reste formellement maintenue, mais elle ne repose plus sur la confiance.";
  }
  if (criticalCount === 1) {
    return "Une relation a basculé dans le rouge. Les autres restent sous contrôle, mais la contagion des tensions est possible.";
  }
  if (tensedCount >= 3) {
    return "Les relations mondiales restent officiellement stables, mais plusieurs blocs traitent désormais la coopération comme une forme de dépendance.";
  }
  if (peacefulCount >= 3) {
    return "Les relations inter-blocs traversent une phase de détente relative. Elle tient moins à une confiance retrouvée qu'à la fatigue des crises successives.";
  }
  return "Les équilibres diplomatiques se maintiennent par inertie. Aucune rupture nette, mais aucune confiance structurée non plus.";
}

function getDecorativeDiplomaticNote(relations: InterBlockRelation[]): string | null {
  const mostTense = [...relations].sort((a, b) => b.tension - a.tension)[0];
  if (!mostTense) return null;

  const status = getRelationStatus(mostTense);
  if (status === "critique") {
    return "« Les canaux diplomatiques restent ouverts. C'est ce qu'ils ne disent plus qui compte », observe un négociateur.";
  }
  if (status === "tendue") {
    return "« L'accord est maintenu. Il ressemble moins à une paix qu'à une manière de différer le conflit », note un analyste.";
  }
  return null;
}

export function RelationsPanel({ blocks, relations }: RelationsPanelProps) {
  const blockNames = new Map(blocks.map((block) => [block.id, block.name]));

  const sortedByTension = [...relations].sort((a, b) => b.tension - a.tension);
  const sortedByCooperation = [...relations].sort((a, b) => b.cooperation - a.cooperation);

  const mainTension = sortedByTension[0];
  const mainCooperation = sortedByCooperation.find(
    (r) => r.id !== mainTension?.id && r.cooperation >= 50,
  );

  // Relations compactes : les 3 plus tendues
  const compactRelations = sortedByTension.slice(0, 3);

  const globalSynthesis = getGlobalDiplomaticSynthesis(relations);
  const diplomaticNote = getDecorativeDiplomaticNote(relations);

  return (
    <section className="panel relations-panel" aria-labelledby="relations-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Monde autonome</p>
          <h2 id="relations-title">Relations inter-blocs</h2>
        </div>
      </div>

      <p className="panel-help">{globalSynthesis}</p>

      {mainTension && (
        <div className="relation-highlight relation-highlight--tension">
          <small className="eyebrow">Tension principale · {domainLabels[mainTension.domain]}</small>
          <p className="relation-highlight__title">{mainTension.label}</p>
          <p className="relation-highlight__detail">
            {blockNames.get(mainTension.from)} ↔ {blockNames.get(mainTension.to)} —{" "}
            <em>{getRelationStatus(mainTension)}</em>
          </p>
          <div className="relation-highlight__gauges">
            <StatGauge label="Tension" value={mainTension.tension} tone="danger" />
            <StatGauge label="Coopération" value={mainTension.cooperation} />
          </div>
          {mainTension.recentTrend && (
            <p className="relation-highlight__trend">{mainTension.recentTrend}</p>
          )}
        </div>
      )}

      {mainCooperation && (
        <div className="relation-highlight relation-highlight--cooperation">
          <small className="eyebrow">Rapprochement lisible · {domainLabels[mainCooperation.domain]}</small>
          <p className="relation-highlight__title">{mainCooperation.label}</p>
          <p className="relation-highlight__detail">
            {blockNames.get(mainCooperation.from)} ↔ {blockNames.get(mainCooperation.to)}
          </p>
          <div className="relation-highlight__gauges">
            <StatGauge label="Coopération" value={mainCooperation.cooperation} />
            <StatGauge label="Dépendance" value={mainCooperation.dependence} tone="warning" />
          </div>
        </div>
      )}

      <div className="relations-compact-list">
        {compactRelations.map((relation) => {
          const status = getRelationStatus(relation);
          return (
            <div
              className={`relation-compact relation-compact--${status}`}
              key={relation.id}
            >
              <div className="relation-compact__header">
                <span className="relation-compact__domain">{domainLabels[relation.domain]}</span>
                <span className={`relation-compact__status relation-compact__status--${status}`}>
                  {status}
                </span>
              </div>
              <p className="relation-compact__label">{relation.label}</p>
              <p className="relation-compact__blocks">
                {blockNames.get(relation.from)} ↔ {blockNames.get(relation.to)}
              </p>
              <div className="relation-compact__values">
                <span
                  className={`relation-value-badge relation-value-badge--tension${relation.tension >= 65 ? " relation-value-badge--high" : ""}`}
                  title="Tension"
                >
                  T {relation.tension}
                </span>
                <span className="relation-value-badge" title="Coopération">
                  C {relation.cooperation}
                </span>
                {relation.dependence > 0 && (
                  <span className="relation-value-badge relation-value-badge--dep" title="Dépendance">
                    D {relation.dependence}
                  </span>
                )}
              </div>
              {relation.recentTrend && (
                <p className="relation-compact__trend">{relation.recentTrend}</p>
              )}
            </div>
          );
        })}
      </div>

      {diplomaticNote && (
        <p className="relations-diplomatic-note">{diplomaticNote}</p>
      )}
    </section>
  );
}
