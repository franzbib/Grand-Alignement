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
  soupconIA: number;
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

export type EventTone = "realiste" | "ironique" | "absurde_modere" | "absurde_avance";

export type ActionScope = "global" | "block" | "mixed";

export type InfluenceTarget = "global" | "all-blocks" | BlockId;

export type ActionAvailability = "base" | "prepared";

export type Action = {
  id: string;
  name: string;
  description: string;
  category: string;
  promise: string;
  risk: string;
  cost: 1 | 2 | 3;
  scope: ActionScope;
  defaultTarget: InfluenceTarget;
  targetRequired: boolean;
  suspicionEffect: number;
  availability?: ActionAvailability;
  recommendedPostures?: string[];
  preparesActionIds?: string[];
  preparationTurns?: number;
  expiresAfter?: number;
  preparationText?: string;
  readyText?: string;
  globalEffects: StatDelta<GlobalStats>;
  blockEffects: StatDelta<BlockStats>;
  sensitivityEffects?: Partial<Record<BlockSensitivity, StatDelta<BlockStats>>>;
  eventText: string;
};

export type PlannedIntervention = {
  actionId: string;
  target: InfluenceTarget;
  preparedOperationId?: string;
};

export type ResolvedIntervention = {
  action: Action;
  target: InfluenceTarget;
  preparedOperationId?: string;
};

export type PreparedOperation = {
  id: string;
  sourceActionId: string;
  actionId: string;
  target: InfluenceTarget;
  availableTurn: number;
  expiresTurn?: number;
  readyText: string;
};

export type StrategicPosture = {
  id: string;
  name: string;
  description: string;
};

export type Event = {
  id: string;
  sourceId?: string;
  turn: number;
  title: string;
  text: string;
  effectsText?: string;
  tone?: EventTone;
};

export type EvolutionReport = {
  turn: number;
  operationSummary: string;
  immediateInterventions: string[];
  preparedOperations: string[];
  unlockedOperations: string[];
  globalChanges: string[];
  mostAffectedBlock: string;
  mainTension: string;
  systemicEventTitle: string | null;
  suspicionNote: string | null;
  blockTrends: Record<BlockId, string>;
};

export type Ending = {
  id: string;
  title: string;
  description: string;
  type: "fragile_success" | "disturbing_success" | "failure" | "revolt";
  tone: EventTone;
};

export type GameState = {
  turn: number;
  globalStats: GlobalStats;
  blocks: Block[];
  journal: Event[];
  triggeredEventIds: string[];
  preparedOperations: PreparedOperation[];
  evolutionReport: EvolutionReport | null;
  ending: Ending | null;
};

export type StatThresholds<TStats> = {
  min?: Partial<Record<keyof TStats, number>>;
  max?: Partial<Record<keyof TStats, number>>;
};

export type SystemicEventCondition = {
  actionIds?: string[];
  global?: StatThresholds<GlobalStats>;
  averageBlock?: StatThresholds<BlockStats>;
  anyBlock?: StatThresholds<BlockStats>;
};

export type SystemicEvent = {
  id: string;
  title: string;
  text: string;
  tone: EventTone;
  condition: SystemicEventCondition;
  globalEffects?: StatDelta<GlobalStats>;
  blockEffects?: StatDelta<BlockStats>;
  effectsText?: string;
};

export type EndingDefinition = Ending & {
  condition: {
    global?: StatThresholds<GlobalStats>;
    averageBlock?: StatThresholds<BlockStats>;
    anyBlock?: StatThresholds<BlockStats>;
  };
};
