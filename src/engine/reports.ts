import { blockSocialSalience, socialGroups } from "../data/socialGroups";
import type { Block, BlockReport, BlockStats, BlockTrend, InterBlockRelation, SocialGroupId, SocialMood } from "../types/game";
import { getRelationStatus } from "./relations";

const statLabels: Record<keyof BlockStats, string> = {
  stabilite: "stabilité",
  richesse: "richesse",
  education: "éducation",
  liberte: "liberté",
  confianceIA: "confiance IA",
  tensionSociale: "tension sociale",
};

function getSalientGroups(block: Block): SocialGroupId[] {
  const salience = blockSocialSalience[block.id];

  return (Object.keys(salience) as SocialGroupId[]).sort((left, right) => (salience[right] ?? 0) - (salience[left] ?? 0));
}

export function getBlockTrends(previousBlock: Block | undefined | null, currentBlock: Block): BlockTrend[] {
  if (!previousBlock) {
    return [];
  }

  return (Object.keys(currentBlock.stats) as Array<keyof BlockStats>)
    .map((stat) => {
      const delta = currentBlock.stats[stat] - previousBlock.stats[stat];
      return {
        stat,
        label: statLabels[stat],
        direction: delta > 0 ? "up" : delta < 0 ? "down" : "stable",
        delta,
      } satisfies BlockTrend;
    })
    .filter((trend) => trend.delta !== 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));
}

export function formatTrendSummary(trends: BlockTrend[]): string {
  if (trends.length === 0) {
    return "Aucun mouvement net depuis le dernier tour.";
  }

  return trends
    .slice(0, 3)
    .map((trend) => `${trend.label} ${trend.direction === "up" ? "en hausse" : "en baisse"} (${trend.delta > 0 ? "+" : ""}${trend.delta})`)
    .join(", ");
}

export function getSocialMood(block: Block): SocialMood {
  const salientGroups = getSalientGroups(block);
  const tenseGroups: SocialGroupId[] = [];
  const favorableGroups: SocialGroupId[] = [];

  for (const group of salientGroups) {
    if (group === "travailleurs_precaires" && (block.stats.tensionSociale >= 55 || block.stats.richesse <= 45)) {
      tenseGroups.push(group);
    }

    if (group === "classes_moyennes" && (block.stats.liberte <= 48 || block.stats.stabilite <= 45)) {
      tenseGroups.push(group);
    }

    if (group === "intellectuels_critiques" && (block.stats.liberte <= 55 || block.stats.confianceIA >= 62)) {
      tenseGroups.push(group);
    }

    if (group === "jeunesse_etudiante" && (block.stats.tensionSociale >= 52 || block.stats.education >= 58)) {
      tenseGroups.push(group);
    }

    if (group === "diplomes_techniques" && block.stats.confianceIA >= 48) {
      favorableGroups.push(group);
    }

    if (group === "elites_administratives" && block.stats.stabilite >= 48) {
      favorableGroups.push(group);
    }

    if (group === "elites_economiques" && block.stats.richesse >= 50) {
      favorableGroups.push(group);
    }

    if (group === "classes_moyennes" && block.stats.stabilite >= 58 && block.stats.tensionSociale <= 55) {
      favorableGroups.push(group);
    }
  }

  const uniqueTenseGroups = [...new Set(tenseGroups)].slice(0, 3);
  const uniqueFavorableGroups = [...new Set(favorableGroups)].filter((group) => !uniqueTenseGroups.includes(group)).slice(0, 3);
  const mostAffectedGroup = uniqueTenseGroups[0] ?? uniqueFavorableGroups[0] ?? salientGroups[0];
  const tenseLabels = uniqueTenseGroups.map((group) => socialGroups[group].label);
  const favorableLabels = uniqueFavorableGroups.map((group) => socialGroups[group].label);

  return {
    tenseGroups: tenseLabels,
    favorableGroups: favorableLabels,
    mostAffectedGroup: socialGroups[mostAffectedGroup].label,
    summary:
      tenseLabels.length > 0
        ? `${tenseLabels[0]} portent la tension la plus lisible.`
        : `${socialGroups[mostAffectedGroup].label} restent le groupe le plus structurant.`,
  };
}

function getMainRisk(block: Block): string {
  if (block.stats.tensionSociale >= 65) {
    return "La tension sociale s'organise : elle commence à trouver un vocabulaire politique.";
  }

  if (block.stats.liberte <= 42) {
    return "L'ordre tient, mais il repose de moins en moins sur le consentement.";
  }

  if (block.stats.confianceIA >= 66) {
    return "Les institutions délèguent trop : les décisions sont prises, mais personne ne sait toujours par qui.";
  }

  if (block.stats.richesse <= 42) {
    return "Les inégalités économiques alimentent une frustration qui n'a pas encore trouvé de cible claire.";
  }

  return "La situation reste lisible. Une opération trop visible pourrait rompre cet équilibre discret.";
}

function getStrategicLeverage(block: Block, mood: SocialMood): string {
  if (mood.tenseGroups.includes("Intellectuels critiques")) {
    return "Levier probable : dialogue par intermédiaires ou soutien critique contrôlé.";
  }

  if (block.stats.tensionSociale >= 60) {
    return "Levier probable : redistribution ciblée ou médiation institutionnelle.";
  }

  if (block.stats.confianceIA >= 60) {
    return "Levier probable : automatisation discrète ou campagne d'information préparée.";
  }

  if (block.stats.education >= 58) {
    return "Levier probable : éducation augmentée ou débat par intermédiaires.";
  }

  return "Levier probable : observation, médiation lente ou récit d'unité peu intrusif.";
}

function getBlockRelations(block: Block, relations: InterBlockRelation[]): InterBlockRelation[] {
  return relations.filter((relation) => relation.from === block.id || relation.to === block.id);
}

function formatRelationSummary(block: Block, relations: InterBlockRelation[]): {
  relationsSummary: string;
  mostTenseRelation: string;
  mostCooperativeRelation: string;
} {
  const blockRelations = getBlockRelations(block, relations);
  const mostTense = [...blockRelations].sort((left, right) => right.tension - left.tension)[0];
  const mostCooperative = [...blockRelations].sort((left, right) => right.cooperation - left.cooperation)[0];

  if (!mostTense || !mostCooperative) {
    return {
      relationsSummary: "Relations extérieures encore peu lisibles.",
      mostTenseRelation: "Aucune tension extérieure identifiée.",
      mostCooperativeRelation: "Aucune coopération extérieure dominante.",
    };
  }

  return {
    relationsSummary: `${block.name} est surtout exposé à ${mostTense.label.toLowerCase()} (${getRelationStatus(
      mostTense,
    )}).`,
    mostTenseRelation: `${mostTense.label} : tension ${mostTense.tension}, ${mostTense.recentTrend ?? "tendance stable"}`,
    mostCooperativeRelation: `${mostCooperative.label} : coopération ${mostCooperative.cooperation}, ${
      mostCooperative.recentTrend ?? "tendance stable"
    }`,
  };
}

export function generateBlockReport(
  block: Block,
  previousBlock?: Block | null,
  relations: InterBlockRelation[] = [],
): BlockReport {
  const trends = getBlockTrends(previousBlock, block);
  const mood = getSocialMood(block);
  const relationSummary = formatRelationSummary(block, relations);
  const favorableGroups = mood.favorableGroups.length > 0 ? mood.favorableGroups : ["Aucun groupe nettement favorable"];
  const tenseGroups = mood.tenseGroups.length > 0 ? mood.tenseGroups : ["Tensions diffuses"];
  const trendSummary = formatTrendSummary(trends);

  return {
    generalSituation:
      block.stats.stabilite >= 60 && block.stats.tensionSociale <= 50
        ? `${block.name} reste ordonné. Les institutions fonctionnent. Mais cette stabilité repose sur des compromis que peu d'acteurs ont envie de renommer.`
        : block.stats.stabilite >= 60 && block.stats.tensionSociale > 50
          ? `${block.name} maintient l'ordre en surface, mais la tension monte dans les milieux les plus exposés aux arbitrages non expliqués.`
          : block.stats.liberte <= 45
            ? `${block.name} présente une stabilité fragile. L'autorité maintient le calme, mais les marges d'expression civique se réduisent visiblement.`
            : `${block.name} traverse une période instable. Plusieurs groupes sociaux cherchent à nommer ce qui change, sans trouver encore de consensus.`,
    tenseGroups,
    favorableGroups,
    mainRisk: getMainRisk(block),
    recentTrend: trendSummary,
    strategicReading:
      mood.tenseGroups.length > 0 && mood.favorableGroups.length > 0
        ? `${mood.favorableGroups[0]} soutiennent une partie des dispositifs, tandis que ${mood.tenseGroups[0].toLowerCase()} structurent les réserves.`
        : mood.summary,
    strategicVulnerability:
      block.stats.liberte <= 45
        ? "Point sensible : la liberté recule. Une résistance mieux formulée pourrait se structurer rapidement."
        : block.stats.tensionSociale >= 58
          ? "Point sensible : la tension sociale cherche un langage. Elle pourrait le trouver à tout moment."
          : "Point sensible : l'acceptation des dispositifs reste réversible si leur coût devient trop visible.",
    possibleLeverage: getStrategicLeverage(block, mood),
    ...relationSummary,
    socialMood: mood,
    trends,
  };
}
