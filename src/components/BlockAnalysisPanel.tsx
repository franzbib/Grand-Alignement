import { generateBlockReport } from "../engine/reports";
import { getRelationStatus } from "../engine/relations";
import type { Block, BlockId, BlockTrend, InterBlockRelation } from "../types/game";
import { StatGauge } from "./StatGauge";

type BlockAnalysisPanelProps = {
  block: Block;
  blocks: Block[];
  previousBlock?: Block;
  relations: InterBlockRelation[];
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

export function BlockAnalysisPanel({ block, blocks, previousBlock, relations }: BlockAnalysisPanelProps) {
  const report = generateBlockReport(block, previousBlock, relations);
  const relatedRelations = getRelatedRelations(block.id, relations);
  const mostTenseRelation = [...relatedRelations].sort((left, right) => right.tension - left.tension)[0];
  const mostCooperativeRelation = [...relatedRelations].sort((left, right) => right.cooperation - left.cooperation)[0];
  const recentRelation = relatedRelations.find((relation) => relation.recentTrend);

  return (
    <article className="block-analysis" aria-labelledby="block-analysis-title">
      <div className="block-analysis__header">
        <div>
          <p className="eyebrow">Analyse détaillée</p>
          <h3 id="block-analysis-title">{block.name}</h3>
        </div>
        <span>{report.socialMood.mostAffectedGroup}</span>
      </div>

      <div className="block-analysis__grid">
        <section>
          <h4>Synthèse du bloc</h4>
          <p>{report.generalSituation}</p>
          <p>{report.strategicReading}</p>
        </section>

        <section>
          <h4>Jauges principales</h4>
          <div className="block-analysis__gauges">
            <StatGauge label="Stabilité" value={block.stats.stabilite} />
            <StatGauge label="Richesse" value={block.stats.richesse} />
            <StatGauge label="Éducation" value={block.stats.education} />
            <StatGauge label="Liberté" value={block.stats.liberte} />
            <StatGauge label="Confiance IA" value={block.stats.confianceIA} />
            <StatGauge label="Tension sociale" value={block.stats.tensionSociale} tone="danger" />
          </div>
        </section>

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
          <p>{report.socialMood.summary}</p>
        </section>

        <section>
          <h4>Relations extérieures</h4>
          <p>{report.relationsSummary}</p>
          {mostTenseRelation && (
            <p>
              Tension principale : {getOtherBlockName(mostTenseRelation, block.id, blocks)},{" "}
              {relationDomainLabels[mostTenseRelation.domain].toLowerCase()}, {getRelationStatus(mostTenseRelation)}.
            </p>
          )}
          {mostCooperativeRelation && (
            <p>
              Coopération la plus lisible : {getOtherBlockName(mostCooperativeRelation, block.id, blocks)},{" "}
              {mostCooperativeRelation.cooperation}.
            </p>
          )}
        </section>

        <section>
          <h4>Vulnérabilités</h4>
          <p>{report.mainRisk}</p>
          <p>{report.strategicVulnerability}</p>
        </section>

        <section>
          <h4>Leviers possibles</h4>
          <p>{report.possibleLeverage}</p>
        </section>

        <section>
          <h4>Derniers signaux</h4>
          <p>{recentRelation?.recentTrend ?? "Aucun changement relationnel récent dominant."}</p>
          <p>{report.recentTrend}</p>
        </section>
      </div>
    </article>
  );
}
