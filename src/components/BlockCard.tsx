import type { Block } from "../types/game";
import { generateBlockReport } from "../engine/reports";
import { StatGauge } from "./StatGauge";

type BlockCardProps = {
  block: Block;
  previousBlock?: Block;
};

export function BlockCard({ block, previousBlock }: BlockCardProps) {
  const report = generateBlockReport(block, previousBlock);

  return (
    <article className="block-card">
      <h3>{block.name}</h3>
      <p>{report.generalSituation}</p>
      <div className="block-card__brief">
        <span>{report.socialMood.summary}</span>
        <span>{report.strategicVulnerability}</span>
        <span>{report.possibleLeverage}</span>
      </div>
      <div className="block-card__stats">
        <StatGauge label="Stabilité" value={block.stats.stabilite} />
        <StatGauge label="Richesse" value={block.stats.richesse} />
        <StatGauge label="Éducation" value={block.stats.education} />
        <StatGauge label="Liberté" value={block.stats.liberte} />
        <StatGauge label="Confiance IA" value={block.stats.confianceIA} />
        <StatGauge label="Tension sociale" value={block.stats.tensionSociale} tone="danger" />
      </div>
    </article>
  );
}
