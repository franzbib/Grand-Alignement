import type { Block } from "../types/game";
import { BlockCard } from "./BlockCard";

type BlocksGridProps = {
  blocks: Block[];
};

export function BlocksGrid({ blocks }: BlocksGridProps) {
  return (
    <section className="panel" aria-labelledby="blocks-title">
      <h2 id="blocks-title">Blocs mondiaux</h2>
      <div className="blocks-grid">
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}
