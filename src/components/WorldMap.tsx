import type { Block, BlockId } from "../types/game";

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
};

export function WorldMap({ blocks }: WorldMapProps) {
  const blocksById = new Map(blocks.map((block) => [block.id, block]));

  return (
    <section className="panel world-map-panel" aria-labelledby="world-map-title">
      <div className="world-map-panel__header">
        <div>
          <p className="eyebrow">Observation mondiale</p>
          <h2 id="world-map-title">Carte des blocs</h2>
        </div>
        <p>Une projection simplifiée des blocs, de l'influence IA et des zones de friction.</p>
      </div>

      <div className="world-map-frame">
        <svg className="world-map" viewBox="0 0 980 470" role="img" aria-labelledby="world-map-title">
          <rect className="world-map__ocean" x="0" y="0" width="980" height="470" rx="12" />
          <path className="world-map__grid" d="M70 235 H910 M490 36 V430 M180 36 V430 M800 36 V430" />
          <path className="world-map__arc" d="M90 345 C280 205 589 190 893 326" />

          {mapZones.map((zone) => {
            const block = blocksById.get(zone.id);

            if (!block) {
              return null;
            }

            const mapState = getBlockMapState(block);
            const className = `world-map__zone world-map__zone--${mapState.status}`;
            const summary = `${block.name}. ${mapState.label}. Stabilité ${block.stats.stabilite}, confiance IA ${block.stats.confianceIA}, tension sociale ${block.stats.tensionSociale}, liberté ${block.stats.liberte}.`;

            return (
              <g className="world-map__block" key={zone.id} tabIndex={0} aria-label={summary}>
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
    </section>
  );
}
