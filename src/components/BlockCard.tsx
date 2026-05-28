import type { Block } from "../types/game";
import { StatGauge } from "./StatGauge";

type BlockCardProps = {
  block: Block;
};

export function BlockCard({ block }: BlockCardProps) {
  return (
    <article className="block-card">
      <h3>{block.name}</h3>
      <p>{block.description}</p>
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
