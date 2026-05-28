import type { Block } from "../types/game";
import { BlockCard } from "./BlockCard";

type BlocksGridProps = {
  blocks: Block[];
  previousBlocks: Block[] | null;
};

export function BlocksGrid({ blocks, previousBlocks }: BlocksGridProps) {
  return (
    <section className="panel" aria-labelledby="blocks-title">
      <h2 id="blocks-title">Blocs mondiaux</h2>
      <p className="panel-help">
        Les blocs affichent maintenant une lecture sociale courte : humeur dominante, vulnérabilité et levier probable.
      </p>
      <div className="blocks-grid">
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} previousBlock={previousBlocks?.find((candidate) => candidate.id === block.id)} />
        ))}
      </div>
    </section>
  );
}
