import type { Block, BlockId, InterBlockRelation } from "../types/game";
import { BlockAnalysisPanel } from "./BlockAnalysisPanel";
import { BlockCard } from "./BlockCard";

type BlocksGridProps = {
  blocks: Block[];
  onSelectBlock: (blockId: BlockId) => void;
  previousBlocks: Block[] | null;
  relations: InterBlockRelation[];
  selectedBlockId: BlockId;
};

export function BlocksGrid({ blocks, onSelectBlock, previousBlocks, relations, selectedBlockId }: BlocksGridProps) {
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? blocks[0];
  const previousSelectedBlock = previousBlocks?.find((block) => block.id === selectedBlock.id);

  return (
    <section className="panel" aria-labelledby="blocks-title">
      <h2 id="blocks-title">Blocs mondiaux</h2>
      <p className="panel-help">
        Sélectionnez un bloc pour lire l'analyse détaillée. La carte reste synthétique ; les tendances, groupes sociaux
        et relations sont regroupés ici.
      </p>
      <div className="blocks-analysis-layout">
        <div className="blocks-grid" aria-label="Sélection des blocs">
          {blocks.map((block) => (
            <BlockCard
              block={block}
              isSelected={block.id === selectedBlock.id}
              key={block.id}
              onSelect={() => onSelectBlock(block.id)}
              previousBlock={previousBlocks?.find((candidate) => candidate.id === block.id)}
            />
          ))}
        </div>
        <BlockAnalysisPanel block={selectedBlock} blocks={blocks} previousBlock={previousSelectedBlock} relations={relations} />
      </div>
    </section>
  );
}
