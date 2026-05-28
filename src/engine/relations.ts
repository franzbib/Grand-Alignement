import type {
  Block,
  BlockId,
  GlobalStats,
  InterBlockRelation,
  RelationChange,
  RelationDelta,
  ResolvedIntervention,
} from "../types/game";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function involves(relation: InterBlockRelation, blockId: BlockId): boolean {
  return relation.from === blockId || relation.to === blockId;
}

function updateRelation(
  relation: InterBlockRelation,
  delta: RelationDelta,
  reason: string,
): { relation: InterBlockRelation; change: RelationChange | null } {
  const nextRelation = {
    ...relation,
    tension: clamp(relation.tension + (delta.tension ?? 0)),
    cooperation: clamp(relation.cooperation + (delta.cooperation ?? 0)),
    dependence: clamp(relation.dependence + (delta.dependence ?? 0)),
  };
  const tensionDelta = nextRelation.tension - relation.tension;
  const cooperationDelta = nextRelation.cooperation - relation.cooperation;
  const dependenceDelta = nextRelation.dependence - relation.dependence;

  if (tensionDelta === 0 && cooperationDelta === 0 && dependenceDelta === 0) {
    return { relation, change: null };
  }

  return {
    relation: {
      ...nextRelation,
      recentTrend: `${reason} (${tensionDelta >= 0 ? "+" : ""}${tensionDelta} tension, ${
        cooperationDelta >= 0 ? "+" : ""
      }${cooperationDelta} coopération).`,
    },
    change: {
      relationId: relation.id,
      label: relation.label,
      tensionDelta,
      cooperationDelta,
      dependenceDelta,
      reason,
    },
  };
}

function applyRelationDelta(
  relations: InterBlockRelation[],
  predicate: (relation: InterBlockRelation) => boolean,
  delta: RelationDelta,
  reason: string,
  limit = 2,
): { relations: InterBlockRelation[]; changes: RelationChange[] } {
  let applied = 0;
  const changes: RelationChange[] = [];
  const nextRelations = relations.map((relation) => {
    if (!predicate(relation) || applied >= limit) {
      return relation;
    }

    applied += 1;
    const result = updateRelation(relation, delta, reason);

    if (result.change) {
      changes.push(result.change);
    }

    return result.relation;
  });

  return { relations: nextRelations, changes };
}

export function applyPlayerRelationEffects(
  relations: InterBlockRelation[],
  interventions: ResolvedIntervention[],
): { relations: InterBlockRelation[]; changes: RelationChange[] } {
  let currentRelations = relations;
  const changes: RelationChange[] = [];

  for (const intervention of interventions) {
    const actionId = intervention.action.id;
    const target = intervention.target;
    let result: { relations: InterBlockRelation[]; changes: RelationChange[] } | null = null;

    if (actionId === "secret-diplomacy") {
      result = applyRelationDelta(
        [...currentRelations].sort((left, right) => right.tension - left.tension),
        () => true,
        { tension: -5, cooperation: 3 },
        "Canal diplomatique discret",
      );
    } else if (actionId === "activate-diplomatic-relays") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => target === "global" || target === "all-blocks" || involves(relation, target),
        { tension: -8, cooperation: 5 },
        "Relais diplomatiques activés",
        target === "global" ? 3 : 2,
      );
    } else if (actionId === "common-defense") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => relation.domain === "security" || relation.tension >= 55,
        { tension: 4, cooperation: 1 },
        "Défense commune perçue comme alignement",
        3,
      );
    } else if (actionId === "launch-information-campaign") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => target === "global" || target === "all-blocks" || involves(relation, target),
        { tension: -2, cooperation: 3 },
        "Récit informationnel synchronisé",
        2,
      );
    } else if (actionId === "launch-controlled-disinformation") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => relation.domain === "information" || target === "global" || target === "all-blocks" || involves(relation, target),
        { tension: 5, cooperation: -3 },
        "Désinformation détectable par fragments",
        2,
      );
    } else if (actionId === "green-conversion") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => relation.domain === "climate" || relation.domain === "resources" || relation.domain === "trade",
        { tension: 2, dependence: -2 },
        "Transition écologique et coût des chaînes",
        2,
      );
    } else if (actionId === "megacapital-tax") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => relation.domain === "technology" || relation.domain === "resources",
        { tension: 2, cooperation: -1 },
        "Fiscalité des plateformes et capitaux mobiles",
        2,
      );
    } else if (actionId === "critical-intellectuals") {
      result = applyRelationDelta(
        currentRelations,
        (relation) => relation.to === "russia-eurasia" || relation.from === "russia-eurasia" || relation.domain === "information",
        { tension: 2, cooperation: -1 },
        "Circulation critique et crispation informationnelle",
        2,
      );
    }

    if (result) {
      currentRelations = result.relations;
      changes.push(...result.changes);
    }
  }

  return { relations: currentRelations, changes };
}

export function advanceWorldDynamics(
  blocks: Block[],
  globalStats: GlobalStats,
  relations: InterBlockRelation[],
): { relations: InterBlockRelation[]; changes: RelationChange[]; worldSignals: string[] } {
  let currentRelations = relations;
  const changes: RelationChange[] = [];
  const worldSignals: string[] = [];
  const unstableBlockIds = blocks
    .filter((block) => block.stats.stabilite <= 45 || block.stats.tensionSociale >= 64)
    .map((block) => block.id);

  const rules: Array<{
    condition: boolean;
    predicate: (relation: InterBlockRelation) => boolean;
    delta: RelationDelta;
    reason: string;
    signal: string;
    limit?: number;
  }> = [
    {
      condition: globalStats.risqueEscalade >= 58,
      predicate: (relation) => relation.domain === "security" || relation.tension >= 60,
      delta: { tension: 3, cooperation: -1 },
      reason: "Escalade globale",
      signal: "La peur stratégique rigidifie plusieurs relations.",
      limit: 2,
    },
    {
      condition: globalStats.stressClimatique >= 62,
      predicate: (relation) => relation.domain === "climate" || relation.domain === "migration" || relation.domain === "resources",
      delta: { tension: 3, cooperation: -1 },
      reason: "Pression climatique",
      signal: "Le climat déplace les tensions vers les ressources et les migrations.",
      limit: 2,
    },
    {
      condition: globalStats.soupconIA >= 45,
      predicate: (relation) => relation.domain === "technology" || relation.domain === "information",
      delta: { tension: 2, cooperation: -1 },
      reason: "Soupçon algorithmique latent",
      signal: "Les normes techniques et informationnelles deviennent moins compatibles.",
      limit: 2,
    },
    {
      condition: unstableBlockIds.length > 0,
      predicate: (relation) => unstableBlockIds.some((blockId) => involves(relation, blockId)),
      delta: { tension: 2 },
      reason: "Instabilité interne contagieuse",
      signal: "Des fragilités internes débordent dans les relations extérieures.",
      limit: 2,
    },
    {
      condition: true,
      predicate: (relation) => relation.cooperation >= 62 && relation.tension >= 25,
      delta: { tension: -1, cooperation: 1 },
      reason: "Inertie institutionnelle coopérative",
      signal: "Quelques routines de coopération amortissent les tensions.",
      limit: 1,
    },
  ];

  for (const rule of rules) {
    if (!rule.condition) {
      continue;
    }

    const result = applyRelationDelta(currentRelations, rule.predicate, rule.delta, rule.reason, rule.limit ?? 2);

    if (result.changes.length > 0) {
      currentRelations = result.relations;
      changes.push(...result.changes);
      worldSignals.push(rule.signal);
    }

    if (worldSignals.length >= 3) {
      break;
    }
  }

  return { relations: currentRelations, changes, worldSignals };
}

export function getRelationStatus(relation: InterBlockRelation): "apaisée" | "fragile" | "tendue" | "critique" {
  if (relation.tension >= 75) {
    return "critique";
  }

  if (relation.tension >= 58) {
    return "tendue";
  }

  if (relation.cooperation >= 62 && relation.tension <= 42) {
    return "apaisée";
  }

  return "fragile";
}
