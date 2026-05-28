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

export type SocialGroupId =
  | "travailleurs_precaires"
  | "classes_moyennes"
  | "diplomes_techniques"
  | "intellectuels_critiques"
  | "elites_administratives"
  | "elites_economiques"
  | "jeunesse_etudiante";

export type SocialGroupProfile = {
  id: SocialGroupId;
  label: string;
  descriptor: string;
};

export type SocialGroupSalience = Partial<Record<SocialGroupId, number>>;

export type BlockTrend = {
  stat: keyof BlockStats;
  label: string;
  direction: "up" | "down" | "stable";
  delta: number;
};

export type SocialMood = {
  tenseGroups: string[];
  favorableGroups: string[];
  mostAffectedGroup: string;
  summary: string;
};

export type RelationDomain =
  | "security"
  | "trade"
  | "climate"
  | "technology"
  | "migration"
  | "information"
  | "resources";

export type InterBlockRelation = {
  id: string;
  from: BlockId;
  to: BlockId;
  tension: number;
  cooperation: number;
  dependence: number;
  domain: RelationDomain;
  label: string;
  recentTrend?: string;
};

export type RelationDelta = Partial<Pick<InterBlockRelation, "tension" | "cooperation" | "dependence">>;

export type RelationChange = {
  relationId: string;
  label: string;
  tensionDelta: number;
  cooperationDelta: number;
  dependenceDelta: number;
  reason: string;
};

export type BlockReport = {
  generalSituation: string;
  tenseGroups: string[];
  favorableGroups: string[];
  mainRisk: string;
  recentTrend: string;
  strategicReading: string;
  strategicVulnerability: string;
  possibleLeverage: string;
  relationsSummary: string;
  mostTenseRelation: string;
  mostCooperativeRelation: string;
  socialMood: SocialMood;
  trends: BlockTrend[];
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
  synthesis: string;
  immediateInterventions: string[];
  preparedOperations: string[];
  unlockedOperations: string[];
  globalChanges: string[];
  affectedBlocks: string[];
  socialSignals: string[];
  worldSignals: string[];
  relationChanges: string[];
  relationTensionIncrease: string | null;
  relationTensionDecrease: string | null;
  weakSignals: string[];
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
  relations: InterBlockRelation[];
  previousRelations: InterBlockRelation[] | null;
  journal: Event[];
  triggeredEventIds: string[];
  preparedOperations: PreparedOperation[];
  previousBlocks: Block[] | null;
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
  relation?: {
    domain?: RelationDomain;
    minTension?: number;
    maxTension?: number;
    minCooperation?: number;
    maxCooperation?: number;
    minDependence?: number;
  };
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
