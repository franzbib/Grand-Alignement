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

type RelationArcLevel = "moderate" | "high" | "critical";

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

type MapSignal = {
  symbol: string;
  label: string;
  description: string;
};

export function getMapSignalsForBlock(
  block: Block,
  relations: InterBlockRelation[],
  globalSoupconIA: number
): MapSignal[] {
  const signals: MapSignal[] = [];
  const mapState = getBlockMapState(block);

  // 1. Tension ou crise (⚠️)
  if (mapState.status === "crisis" || block.stats.stabilite <= 35) {
    signals.push({
      symbol: "⚠️",
      label: "Crise",
      description: "Instabilité critique ou crise multisectorielle",
    });
  }

  // 2. Tension sociale (🔥)
  if (block.stats.tensionSociale >= 60) {
    signals.push({
      symbol: "🔥",
      label: "Tension sociale",
      description: `Forte tension sociale active (${block.stats.tensionSociale})`,
    });
  }

  // 3. Soupçon IA (👁️)
  if (block.stats.confianceIA <= 35 && globalSoupconIA >= 30) {
    signals.push({
      symbol: "👁️",
      label: "Soupçon IA",
      description: "Méfiance locale face aux opérations clandestines",
    });
  }

  // 4. Lucidité/résistance (🧠)
  if (mapState.status === "resistance" || (block.stats.education >= 60 && block.stats.liberte >= 55)) {
    signals.push({
      symbol: "🧠",
      label: "Résistance & Lucidité",
      description: "Société civile éduquée et activement vigilante",
    });
  }

  // 5. Calme suspect (😶)
  if (block.stats.confianceIA >= 65 && (block.stats.liberte <= 42 || block.stats.tensionSociale <= 35)) {
    signals.push({
      symbol: "😶",
      label: "Calme suspect",
      description: "Forte docilité algorithmique ou apathie politique",
    });
  }

  // 6. Militarisation (🛡️)
  const blockRelations = relations.filter(r => r.from === block.id || r.to === block.id);
  const hasSecurityTension = blockRelations.some(r => r.domain === "security" && r.tension >= 60);
  if (hasSecurityTension) {
    signals.push({
      symbol: "🛡️",
      label: "Militarisation",
      description: "Frictions sécuritaires ou renforcement militaire aux frontières",
    });
  }

  // 7. Coopération/apaisement (🤝)
  const hasHighCooperation = blockRelations.some(r => r.cooperation >= 65 && r.tension <= 40);
  if (hasHighCooperation) {
    signals.push({
      symbol: "🤝",
      label: "Coopération",
      description: "Canaux d'échanges ou d'accords inter-blocs actifs",
    });
  }

  // 8. Amélioration climatique ou transition (🌱)
  const hasClimateCooperation = blockRelations.some(r => r.domain === "climate" && r.cooperation >= 55);
  if (hasClimateCooperation) {
    signals.push({
      symbol: "🌱",
      label: "Transition écologique",
      description: "Coopération active sur les dossiers de stress climatique",
    });
  }

  // Max 3 signals to prevent clutter
  return signals.slice(0, 3);
}

type WorldMapProps = {
  blocks: Block[];
  evolutionReport: EvolutionReport | null;
  previousBlocks: Block[] | null;
  relations: InterBlockRelation[];
  selectedBlockId: BlockId;
  soupconIA: number;
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

function getRelationArcLevel(relation: InterBlockRelation): RelationArcLevel {
  if (relation.tension >= 78) {
    return "critical";
  }

  if (relation.tension >= 62) {
    return "high";
  }

  return "moderate";
}

export function WorldMap({ blocks, evolutionReport, previousBlocks, relations, selectedBlockId, soupconIA, onSelectBlock }: WorldMapProps) {
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const zonesById = new Map(mapZones.map((zone) => [zone.id, zone]));
  const selectedBlock = blocksById.get(selectedBlockId) ?? blocks[0];
  const selectedMapState = getBlockMapState(selectedBlock);
  const previousBlock = previousBlocks?.find((block) => block.id === selectedBlock.id);
  const blockReport = generateBlockReport(selectedBlock, previousBlock, relations);
  const tenseRelations = [...relations].sort((left, right) => right.tension - left.tension).slice(0, 2);

  return (
    <section className="panel world-map-panel" aria-labelledby="world-map-title">
      <div className="world-map-panel__header">
        <div>
          <p className="eyebrow">Observation mondiale</p>
          <h2 id="world-map-title">Carte d'observation synthétique</h2>
        </div>
        <p>Cliquez un bloc pour le sélectionner. La carte montre surtout la position des blocs, leur état dominant et quelques tensions majeures.</p>
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
            const arcLevel = getRelationArcLevel(relation);
            const relationStatus = getRelationStatus(relation);

            return (
              <g key={relation.id}>
                <path
                  aria-label={`${relation.label}. Tension ${relation.tension}. Niveau ${arcLevel}.`}
                  className={`world-map__relation world-map__relation--${relationStatus} world-map__relation--${arcLevel}`}
                  d={`M${fromZone.labelX} ${fromZone.labelY} Q${midX} ${midY} ${toZone.labelX} ${toZone.labelY}`}
                >
                  <title>
                    {relation.label}. Tension {relation.tension}, coopération {relation.cooperation}.
                  </title>
                </path>
              </g>
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
            const signals = getMapSignalsForBlock(
              block,
              relations,
              soupconIA
            );
            const signalTexts = signals.map(s => `${s.symbol} ${s.label} : ${s.description}`).join(", ");
            const summary = `${block.name}. ${mapState.label}. ${signalTexts ? `Signaux : ${signalTexts}. ` : ""}Stabilité ${block.stats.stabilite}, confiance IA ${block.stats.confianceIA}, tension sociale ${block.stats.tensionSociale}, liberté ${block.stats.liberte}.`;

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
                {signals.length > 0 && (
                  <text className="world-map__signals" x={zone.labelX} y={zone.labelY + 34} textAnchor="middle">
                    {signals.map((s) => s.symbol).join(" ")}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="world-map-legend" aria-label="Légende de la carte">
        <span>
          <i className="legend-dot legend-dot--stable" /> Bloc sous veille
        </span>
        <span>
          <i className="legend-dot legend-dot--influence" /> Influence IA forte
        </span>
        <span>
          <i className="legend-dot legend-dot--tension" /> Tension sociale
        </span>
        <span>
          <i className="legend-dot legend-dot--fragile" /> Fragilité
        </span>
        <span>
          <i className="legend-dot legend-dot--authoritarian" /> Liberté basse
        </span>
        <span>
          <i className="legend-dot legend-dot--resistance" /> Résistance
        </span>
        <span>
          <i className="legend-dot legend-dot--crisis" /> Crise
        </span>
        <span>
          <i className="legend-line legend-line--relation" /> Tension inter-blocs
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
        <p className="block-report__trend">
          {evolutionReport?.blockTrends[selectedBlock.id] ?? blockReport.recentTrend} {getBlockInterpretation(selectedBlock, selectedMapState)}
        </p>
      </aside>
    </section>
  );
}
