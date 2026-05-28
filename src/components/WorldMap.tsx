import type { Block, BlockId, EvolutionReport, InterBlockRelation } from "../types/game";
import { generateBlockReport } from "../engine/reports";
import { getRelationStatus } from "../engine/relations";

type MapZone = {
  id: BlockId;
  shortName: string;
  shape: "path" | "rect";
  d?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  labelX: number;
  labelY: number;
};

type BlockMapState = {
  status: "stable" | "influence" | "tension" | "fragile" | "authoritarian" | "resistance" | "crisis";
  label: string;
  details: string[];
};

const mapZones: MapZone[] = [
  {
    id: "north-america",
    shortName: "Am. Nord",
    shape: "path",
    d: "M64 82 L169 58 L240 86 L218 154 L136 171 L70 139 Z",
    labelX: 145,
    labelY: 116,
  },
  {
    id: "latin-america",
    shortName: "Am. latine",
    shape: "path",
    d: "M180 178 L235 203 L221 285 L256 365 L214 414 L176 324 L139 245 Z",
    labelX: 202,
    labelY: 282,
  },
  {
    id: "europe",
    shortName: "Europe",
    shape: "path",
    d: "M348 93 L432 76 L486 112 L455 166 L365 156 L327 124 Z",
    labelX: 408,
    labelY: 121,
  },
  {
    id: "russia-eurasia",
    shortName: "Eurasie",
    shape: "path",
    d: "M472 64 L806 72 L858 140 L775 190 L568 164 L459 126 Z",
    labelX: 666,
    labelY: 124,
  },
  {
    id: "industrial-asia",
    shortName: "Asie ind.",
    shape: "path",
    d: "M632 194 L815 177 L914 238 L873 338 L703 326 L618 267 Z",
    labelX: 766,
    labelY: 259,
  },
  {
    id: "emerging-south",
    shortName: "Sud global",
    shape: "rect",
    x: 354,
    y: 214,
    width: 220,
    height: 134,
    labelX: 464,
    labelY: 279,
  },
];

export function getBlockMapState(block: Block): BlockMapState {
  const crisisScore =
    (block.stats.tensionSociale >= 72 ? 1 : 0) +
    (block.stats.stabilite <= 34 ? 1 : 0) +
    (block.stats.liberte <= 32 ? 1 : 0) +
    (block.stats.confianceIA <= 28 ? 1 : 0);

  if (crisisScore >= 2) {
    return {
      status: "crisis",
      label: "Crise",
      details: ["Seuils multiples"],
    };
  }

  if (block.stats.confianceIA >= 68) {
    return {
      status: "influence",
      label: "IA forte",
      details: ["Confiance IA haute"],
    };
  }

  if (block.stats.confianceIA <= 36 && block.stats.tensionSociale >= 56) {
    return {
      status: "resistance",
      label: "Résistance",
      details: ["Confiance IA basse", "Tension sociale active"],
    };
  }

  if (block.stats.tensionSociale >= 66) {
    return {
      status: "tension",
      label: "Tension",
      details: ["Tension sociale haute"],
    };
  }

  if (block.stats.stabilite <= 42) {
    return {
      status: "fragile",
      label: "Fragile",
      details: ["Stabilité basse"],
    };
  }

  if (block.stats.liberte <= 34) {
    return {
      status: "authoritarian",
      label: "Liberté basse",
      details: ["Autonomie civique réduite"],
    };
  }

  return {
    status: "stable",
    label: "Sous veille",
    details: ["Aucun seuil critique"],
  };
}

type WorldMapProps = {
  blocks: Block[];
  evolutionReport: EvolutionReport | null;
  previousBlocks: Block[] | null;
  relations: InterBlockRelation[];
  selectedBlockId: BlockId;
  onSelectBlock: (blockId: BlockId) => void;
};

function getBlockInterpretation(block: Block, mapState: BlockMapState): string {
  if (mapState.status === "crisis") {
    return `${block.name} concentre plusieurs fragilités visibles. L'influence indirecte risque d'y produire des effets plus brusques.`;
  }

  if (block.stats.confianceIA >= 65) {
    return `${block.name} absorbe facilement les signaux algorithmiques, mais cette confiance peut devenir une dépendance.`;
  }

  if (block.stats.liberte <= 40) {
    return `${block.name} paraît stable en surface, avec une marge civique déjà réduite.`;
  }

  if (block.stats.tensionSociale >= 60) {
    return `${block.name} réagit fortement aux arbitrages perçus comme imposés ou capturés.`;
  }

  return `${block.name} reste observable sans seuil critique dominant, ce qui ne signifie pas qu'il soit immobile.`;
}

export function WorldMap({ blocks, evolutionReport, previousBlocks, relations, selectedBlockId, onSelectBlock }: WorldMapProps) {
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const zonesById = new Map(mapZones.map((zone) => [zone.id, zone]));
  const selectedBlock = blocksById.get(selectedBlockId) ?? blocks[0];
  const selectedMapState = getBlockMapState(selectedBlock);
  const previousBlock = previousBlocks?.find((block) => block.id === selectedBlock.id);
  const blockReport = generateBlockReport(selectedBlock, previousBlock, relations);
  const tenseRelations = [...relations].sort((left, right) => right.tension - left.tension).slice(0, 3);

  return (
    <section className="panel world-map-panel" aria-labelledby="world-map-title">
      <div className="world-map-panel__header">
        <div>
          <p className="eyebrow">Observation mondiale</p>
          <h2 id="world-map-title">Carte des blocs</h2>
        </div>
        <p>Cliquez un bloc pour lire son rapport. La carte reste une surface d'observation, pas un théâtre d'opérations.</p>
      </div>

      <div className="world-map-frame">
        <svg className="world-map" viewBox="0 0 980 470" role="img" aria-labelledby="world-map-title">
          <rect className="world-map__ocean" x="0" y="0" width="980" height="470" rx="12" />
          <path className="world-map__grid" d="M70 235 H910 M490 36 V430 M180 36 V430 M800 36 V430" />
          <path className="world-map__arc" d="M90 345 C280 205 589 190 893 326" />

          {tenseRelations.map((relation) => {
            const fromZone = zonesById.get(relation.from);
            const toZone = zonesById.get(relation.to);

            if (!fromZone || !toZone) {
              return null;
            }

            const midX = (fromZone.labelX + toZone.labelX) / 2;
            const midY = Math.min(fromZone.labelY, toZone.labelY) - 48;

            return (
              <path
                aria-label={`${relation.label}. Tension ${relation.tension}.`}
                className={`world-map__relation world-map__relation--${getRelationStatus(relation)}`}
                d={`M${fromZone.labelX} ${fromZone.labelY} Q${midX} ${midY} ${toZone.labelX} ${toZone.labelY}`}
                key={relation.id}
              >
                <title>
                  {relation.label}. Tension {relation.tension}, coopération {relation.cooperation}.
                </title>
              </path>
            );
          })}

          {mapZones.map((zone) => {
            const block = blocksById.get(zone.id);

            if (!block) {
              return null;
            }

            const mapState = getBlockMapState(block);
            const isSelected = selectedBlockId === block.id;
            const className = `world-map__zone world-map__zone--${mapState.status}${
              isSelected ? " world-map__zone--selected" : ""
            }`;
            const summary = `${block.name}. ${mapState.label}. Stabilité ${block.stats.stabilite}, confiance IA ${block.stats.confianceIA}, tension sociale ${block.stats.tensionSociale}, liberté ${block.stats.liberte}.`;

            return (
              <g
                aria-label={summary}
                aria-pressed={isSelected}
                className="world-map__block"
                key={zone.id}
                onClick={() => onSelectBlock(zone.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectBlock(zone.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <title>{summary}</title>
                {zone.shape === "path" ? (
                  <path className={className} d={zone.d} />
                ) : (
                  <rect
                    className={className}
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="28"
                  />
                )}
                <text className="world-map__label" x={zone.labelX} y={zone.labelY - 10} textAnchor="middle">
                  {zone.shortName}
                </text>
                <text className="world-map__status" x={zone.labelX} y={zone.labelY + 14} textAnchor="middle">
                  {mapState.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="world-map-legend" aria-label="Légende de la carte">
        <span>
          <i className="legend-dot legend-dot--influence" /> Influence IA forte
        </span>
        <span>
          <i className="legend-dot legend-dot--tension" /> Tension
        </span>
        <span>
          <i className="legend-dot legend-dot--fragile" /> Fragilité
        </span>
        <span>
          <i className="legend-dot legend-dot--crisis" /> Crise
        </span>
        <span>
          <i className="legend-dot legend-dot--authoritarian" /> Liberté basse
        </span>
        <span>
          <i className="legend-dot legend-dot--resistance" /> Résistance humaine
        </span>
      </div>

      <aside className="block-report" aria-labelledby="block-report-title">
        <div>
          <p className="eyebrow">Rapport de bloc</p>
          <h3 id="block-report-title">{selectedBlock.name}</h3>
          <p>{blockReport.generalSituation}</p>
        </div>
        <dl>
          <div>
            <dt>État carte</dt>
            <dd>{selectedMapState.label}</dd>
          </div>
          <div>
            <dt>Stabilité</dt>
            <dd>{selectedBlock.stats.stabilite}</dd>
          </div>
          <div>
            <dt>Confiance IA</dt>
            <dd>{selectedBlock.stats.confianceIA}</dd>
          </div>
          <div>
            <dt>Tension sociale</dt>
            <dd>{selectedBlock.stats.tensionSociale}</dd>
          </div>
          <div>
            <dt>Liberté</dt>
            <dd>{selectedBlock.stats.liberte}</dd>
          </div>
        </dl>
        <div className="block-report__sections">
          <section>
            <h4>Tendances récentes</h4>
            <p>{evolutionReport?.blockTrends[selectedBlock.id] ?? blockReport.recentTrend}</p>
          </section>
          <section>
            <h4>Groupes sociaux</h4>
            <p>
              Sous tension : {blockReport.tenseGroups.join(", ")}. Favorables : {blockReport.favorableGroups.join(", ")}.
            </p>
          </section>
          <section>
            <h4>Risque interne</h4>
            <p>{blockReport.mainRisk}</p>
          </section>
          <section>
            <h4>Lecture stratégique</h4>
            <p>{blockReport.strategicReading} {blockReport.possibleLeverage}</p>
          </section>
          <section>
            <h4>Relations extérieures</h4>
            <p>{blockReport.relationsSummary}</p>
            <p>{blockReport.mostTenseRelation}</p>
            <p>{blockReport.mostCooperativeRelation}</p>
          </section>
        </div>
        <p className="block-report__trend">{getBlockInterpretation(selectedBlock, selectedMapState)}</p>
      </aside>
    </section>
  );
}
