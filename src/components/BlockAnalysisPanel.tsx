import { generateBlockNarrativeSummary } from "../engine/blockNarrative";
import { generateBlockReport } from "../engine/reports";
import { getRelationStatus } from "../engine/relations";
import type { Block, BlockId, BlockTrend, InterBlockRelation } from "../types/game";
import { StatGauge } from "./StatGauge";

type BlockAnalysisPanelProps = {
  block: Block;
  blocks: Block[];
  previousBlock?: Block;
  relations: InterBlockRelation[];
  year: number;
};

const relationDomainLabels: Record<InterBlockRelation["domain"], string> = {
  security: "Sécurité",
  trade: "Commerce",
  climate: "Climat",
  technology: "Technologie",
  migration: "Migration",
  information: "Information",
  resources: "Ressources",
};

function formatTrendChip(trend: BlockTrend): string {
  return `${trend.label} ${trend.delta > 0 ? "+" : ""}${trend.delta}`;
}

function getRelatedRelations(blockId: BlockId, relations: InterBlockRelation[]): InterBlockRelation[] {
  return relations.filter((relation) => relation.from === blockId || relation.to === blockId);
}

function getOtherBlockName(relation: InterBlockRelation, blockId: BlockId, blocks: Block[]): string {
  const otherBlockId = relation.from === blockId ? relation.to : relation.from;
  return blocks.find((block) => block.id === otherBlockId)?.name ?? otherBlockId;
}

export function BlockAnalysisPanel({ block, blocks, previousBlock, relations, year }: BlockAnalysisPanelProps) {
  const report = generateBlockReport(block, previousBlock, relations);
  const narrative = generateBlockNarrativeSummary(block, previousBlock, relations, year);
  const relatedRelations = getRelatedRelations(block.id, relations);
  const mostTenseRelation = [...relatedRelations].sort((left, right) => right.tension - left.tension)[0];
  const mostCooperativeRelation = [...relatedRelations].sort((left, right) => right.cooperation - left.cooperation)[0];
  const recentRelation = relatedRelations.find((relation) => relation.recentTrend);

  return (
    <article className="block-analysis" aria-labelledby="block-analysis-title">
      <div className="block-analysis__header">
        <div>
          <p className="eyebrow">Synthèse du bloc</p>
          <h3 id="block-analysis-title">
            {block.name} — {narrative.year}
          </h3>
        </div>
        <span>{narrative.direction}</span>
      </div>

      <p className="block-analysis__lead">{narrative.summary}</p>

      <div className="block-analysis__vitals" aria-label="Jauges synthétiques du bloc">
        <StatGauge label="Stabilité" value={block.stats.stabilite} />
        <StatGauge label="Tension sociale" value={block.stats.tensionSociale} tone="danger" />
        <StatGauge label="Liberté" value={block.stats.liberte} />
        <StatGauge label="Confiance IA" value={block.stats.confianceIA} />
      </div>

      <div className="block-indicators" aria-label="Indicateurs interprétatifs">
        {narrative.indicators.map((indicator) => (
          <div className="block-indicator" key={indicator.label}>
            <span>{indicator.label}</span>
            <strong>{indicator.value}</strong>
          </div>
        ))}
      </div>

      <div className="block-analysis__journal">
        <h4>Brèves de bloc</h4>
        <ul>
          {narrative.briefs.map((brief) => (
            <li key={brief.label}>
              <strong>{brief.label} :</strong> {brief.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="block-analysis__grid">
        <section>
          <h4>Tendances récentes</h4>
          {report.trends.length > 0 ? (
            <div className="trend-chip-list">
              {report.trends.slice(0, 4).map((trend) => (
                <span className={`trend-chip trend-chip--${trend.direction}`} key={trend.stat}>
                  {formatTrendChip(trend)}
                </span>
              ))}
            </div>
          ) : (
            <p>{report.recentTrend}</p>
          )}
        </section>

        <section>
          <h4>Groupes sociaux</h4>
          <p>Sous tension : {report.tenseGroups.join(", ")}.</p>
          <p>Favorables : {report.favorableGroups.join(", ")}.</p>
        </section>

        <section>
          <h4>Relations extérieures</h4>
          {mostTenseRelation ? (
            <p>
              Tension principale : {getOtherBlockName(mostTenseRelation, block.id, blocks)},{" "}
              {relationDomainLabels[mostTenseRelation.domain].toLowerCase()}, {getRelationStatus(mostTenseRelation)}.
            </p>
          ) : (
            <p>{report.relationsSummary}</p>
          )}
          {mostCooperativeRelation && (
            <p>
              Coopération lisible : {getOtherBlockName(mostCooperativeRelation, block.id, blocks)},{" "}
              {mostCooperativeRelation.cooperation}.
            </p>
          )}
        </section>

        <section>
          <h4>Lecture stratégique</h4>
          <p>{report.mainRisk}</p>
          <p>{report.possibleLeverage}</p>
        </section>

        <section>
          <h4>Dernier signal</h4>
          <p>{recentRelation?.recentTrend ?? report.strategicVulnerability}</p>
        </section>
      </div>
    </article>
  );
}
