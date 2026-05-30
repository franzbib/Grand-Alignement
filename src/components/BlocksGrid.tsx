import { getGameYear } from "../engine/blockNarrative";
import type { Block, BlockId, InterBlockRelation } from "../types/game";
import { BlockAnalysisPanel } from "./BlockAnalysisPanel";
import { BlockCard } from "./BlockCard";

type BlocksGridProps = {
  blocks: Block[];
  onSelectBlock: (blockId: BlockId) => void;
  previousBlocks: Block[] | null;
  relations: InterBlockRelation[];
  selectedBlockId: BlockId;
  turn: number;
};

export function BlocksGrid({ blocks, onSelectBlock, previousBlocks, relations, selectedBlockId, turn }: BlocksGridProps) {
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? blocks[0];
  const previousSelectedBlock = previousBlocks?.find((block) => block.id === selectedBlock.id);
  const year = getGameYear(turn);

  return (
    <section className="panel" aria-labelledby="blocks-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Journal interne des blocs</p>
          <h2 id="blocks-title">Blocs mondiaux</h2>
        </div>
        <strong>{year}</strong>
      </div>
      <p className="panel-help">Sélectionnez un bloc pour lire sa trajectoire politique synthétique.</p>

      <div className="blocks-analysis-layout">
        <div className="blocks-grid" aria-label="Sélection des blocs">
          {blocks.map((block) => (
            <BlockCard
              block={block}
              isSelected={block.id === selectedBlock.id}
              key={block.id}
              onSelect={() => onSelectBlock(block.id)}
              previousBlock={previousBlocks?.find((candidate) => candidate.id === block.id)}
              relations={relations}
            />
          ))}
        </div>
        <BlockAnalysisPanel
          block={selectedBlock}
          blocks={blocks}
          previousBlock={previousSelectedBlock}
          relations={relations}
          year={year}
        />
      </div>
    </section>
  );
}
