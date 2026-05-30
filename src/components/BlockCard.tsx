import { generateBlockNarrativeSummary } from "../engine/blockNarrative";
import { generateBlockReport } from "../engine/reports";
import type { Block, InterBlockRelation } from "../types/game";

type BlockCardProps = {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  previousBlock?: Block;
  relations?: InterBlockRelation[];
};

export function BlockCard({ block, isSelected = false, onSelect, previousBlock, relations = [] }: BlockCardProps) {
  const report = generateBlockReport(block, previousBlock, relations);
  const narrative = generateBlockNarrativeSummary(block, previousBlock, relations, 0);

  return (
    <article
      aria-pressed={isSelected}
      className={isSelected ? "block-card block-card--selected" : "block-card"}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="block-card__header">
        <h3>{block.name}</h3>
        <span>{narrative.direction}</span>
      </div>
      <p>{report.recentTrend}</p>
    </article>
  );
}
