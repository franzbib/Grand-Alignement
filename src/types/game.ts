export type BlockId =
  | "north-america"
  | "europe"
  | "russia-eurasia"
  | "industrial-asia"
  | "emerging-south"
  | "latin-america";

export type GlobalStats = {
  cohesionMondiale: number;
  risqueEscalade: number;
  autonomieHumaine: number;
  stressClimatique: number;
  puissanceIA: number;
};

export type BlockStats = {
  stabilite: number;
  richesse: number;
  education: number;
  liberte: number;
  confianceIA: number;
  tensionSociale: number;
};

export type BlockSensitivity =
  | "techSensitivity"
  | "socialSensitivity"
  | "climateSensitivity"
  | "militarySensitivity"
  | "eliteCaptureSensitivity"
  | "aiTrustSensitivity";

export type BlockProfile = Record<BlockSensitivity, number>;

export type Block = {
  id: BlockId;
  name: string;
  description: string;
  stats: BlockStats;
};

export type StatDelta<TStats> = Partial<Record<keyof TStats, number>>;

export type Action = {
  id: string;
  name: string;
  description: string;
  globalEffects: StatDelta<GlobalStats>;
  blockEffects: StatDelta<BlockStats>;
  sensitivityEffects?: Partial<Record<BlockSensitivity, StatDelta<BlockStats>>>;
  eventText: string;
};

export type Event = {
  id: string;
  turn: number;
  title: string;
  text: string;
};

export type Ending = {
  id: string;
  title: string;
  description: string;
};

export type GameState = {
  turn: number;
  globalStats: GlobalStats;
  blocks: Block[];
  journal: Event[];
  ending: Ending | null;
};
