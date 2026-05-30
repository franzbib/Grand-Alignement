import type { Block, GameState, InterBlockRelation, RelationDomain, TrajectoryScores } from "../types/game";

export const trajectoryLabels: Record<keyof TrajectoryScores, string> = {
  t1: "Unification humaine imparfaite",
  t2: "Tutelle algorithmique",
  t3: "Résistance humaine",
  t4: "Abêtissement médiatique",
  t5: "Escalade militaire",
  t6: "Capture privée",
  t7: "Saturation systémique",
  t8: "Réel climatique",
};

const collisionPairs: Array<[keyof TrajectoryScores, keyof TrajectoryScores]> = [
  ["t1", "t2"],
  ["t2", "t3"],
  ["t2", "t6"],
  ["t4", "t7"],
  ["t5", "t7"],
  ["t7", "t8"],
];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function max(values: number[]): number {
  return values.length > 0 ? Math.max(...values) : 0;
}

function averageBlockStat(blocks: Block[], stat: keyof Block["stats"]): number {
  return average(blocks.map((block) => block.stats[stat]));
}

function maxBlockStat(blocks: Block[], stat: keyof Block["stats"]): number {
  return max(blocks.map((block) => block.stats[stat]));
}

function relationsByDomain(relations: InterBlockRelation[], domain: RelationDomain): InterBlockRelation[] {
  return relations.filter((relation) => relation.domain === domain);
}

function averageCooperation(relations: InterBlockRelation[]): number {
  return average(relations.map((relation) => relation.cooperation));
}

function maxTension(relations: InterBlockRelation[]): number {
  return max(relations.map((relation) => relation.tension));
}

function maxDependence(relations: InterBlockRelation[]): number {
  return max(relations.map((relation) => relation.dependence));
}

function maxPrivateCapturePressure(blocks: Block[]): number {
  return max(blocks.map((block) => Math.min(block.stats.richesse, 100 - block.stats.liberte)));
}

export function computeTrajectoryScores(state: GameState): TrajectoryScores {
  const { globalStats, blocks, relations } = state;
  const averageTrust = averageBlockStat(blocks, "confianceIA");
  const averageEducation = averageBlockStat(blocks, "education");
  const averageTension = averageBlockStat(blocks, "tensionSociale");
  const averageStability = averageBlockStat(blocks, "stabilite");
  const maxSocialTension = maxBlockStat(blocks, "tensionSociale");
  const maxWealth = maxBlockStat(blocks, "richesse");
  const averageWealth = averageBlockStat(blocks, "richesse");
  const privateCapturePressure = maxPrivateCapturePressure(blocks);
  const wealthConcentrationSignal = Math.max(0, maxWealth - averageWealth);
  const securityRelations = relationsByDomain(relations, "security");
  const technologyRelations = relationsByDomain(relations, "technology");
  const tradeRelations = relationsByDomain(relations, "trade");
  const platformDependence = Math.max(maxDependence(technologyRelations), maxDependence(tradeRelations));

  // These formulas are intentionally lightweight diagnostics, not ending conditions.
  return {
    t1: clampScore(
      globalStats.cohesionMondiale * 0.35 +
        globalStats.autonomieHumaine * 0.35 +
        averageCooperation(relations) * 0.2 -
        globalStats.puissanceIA * 0.15 -
        globalStats.soupconIA * 0.1,
    ),
    t2: clampScore(
      globalStats.puissanceIA * 0.4 +
        averageTrust * 0.3 +
        (100 - globalStats.autonomieHumaine) * 0.3 -
        globalStats.soupconIA * 0.2,
    ),
    t3: clampScore(
      globalStats.soupconIA * 0.4 +
        globalStats.autonomieHumaine * 0.25 +
        maxSocialTension * 0.25 -
        globalStats.puissanceIA * 0.2,
    ),
    t4: clampScore(
      (100 - averageEducation) * 0.45 +
        (100 - globalStats.autonomieHumaine) * 0.35 -
        globalStats.puissanceIA * 0.15,
    ),
    t5: clampScore(
      globalStats.risqueEscalade * 0.55 +
        maxTension(securityRelations) * 0.35 -
        globalStats.cohesionMondiale * 0.2,
    ),
    t6: clampScore(privateCapturePressure * 0.45 + platformDependence * 0.3 + wealthConcentrationSignal * 0.25),
    t7: clampScore(
      (100 - globalStats.cohesionMondiale) * 0.35 +
        averageTension * 0.3 +
        (100 - averageStability) * 0.25 +
        globalStats.risqueEscalade * 0.1,
    ),
    t8: clampScore((globalStats.stressClimatique - 35) * 1.25),
  };
}

export function getDominantTrajectory(scores: TrajectoryScores): string {
  const dominant = (Object.entries(scores) as Array<[keyof TrajectoryScores, number]>).sort(
    (left, right) => right[1] - left[1],
  )[0];

  return dominant ? `${trajectoryLabels[dominant[0]]} (${dominant[1]})` : "Aucune trajectoire dominante";
}

export function getStrongSecondaryTrajectories(scores: TrajectoryScores): string[] {
  const sortedScores = (Object.entries(scores) as Array<[keyof TrajectoryScores, number]>).sort(
    (left, right) => right[1] - left[1],
  );

  return sortedScores
    .slice(1)
    .filter(([, score]) => score >= 60)
    .slice(0, 2)
    .map(([trajectory, score]) => `${trajectoryLabels[trajectory]} (${score})`);
}

export function getCollidingTrajectories(scores: TrajectoryScores): string[] {
  return collisionPairs
    .filter(([left, right]) => scores[left] >= 60 && scores[right] >= 60)
    .slice(0, 2)
    .map(([left, right]) => `${trajectoryLabels[left]} / ${trajectoryLabels[right]}`);
}

export function getTrajectoryWeakSignals(scores: TrajectoryScores): string[] {
  const signals = [
    scores.t1 >= 65 ? "Unification humaine imparfaite : la cohésion progresse sans effacer la lenteur institutionnelle." : null,
    scores.t5 >= 65 ? "Escalade militaire en progression." : null,
    scores.t2 >= 65 ? "Tutelle algorithmique avancée." : null,
    scores.t4 >= 65 ? "Abêtissement médiatique : la stabilité apparente masque une perte de lucidité." : null,
    scores.t6 >= 65 ? "Capture privée : la richesse se concentre autour de dispositifs peu contestés." : null,
    scores.t8 >= 65 ? "Stress climatique critique." : null,
    scores.t7 >= 65 ? "Saturation systémique en progression." : null,
    scores.t3 >= 65 ? "Résistance humaine en cristallisation." : null,
  ];

  return signals.filter((signal): signal is string => Boolean(signal)).slice(0, 2);
}
