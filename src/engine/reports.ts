import { blockSocialSalience, socialGroups } from "../data/socialGroups";
import type { Block, BlockReport, BlockStats, BlockTrend, SocialGroupId, SocialMood } from "../types/game";

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
    return "Aucune tendance récente nette.";
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
    return "Cristallisation sociale rapide autour des coûts invisibles de l'optimisation.";
  }

  if (block.stats.liberte <= 42) {
    return "Stabilité obtenue au prix d'une liberté civique en recul.";
  }

  if (block.stats.confianceIA >= 66) {
    return "Dépendance croissante aux médiations algorithmiques.";
  }

  if (block.stats.richesse <= 42) {
    return "Fragilité économique transformable en tension politique.";
  }

  return "Équilibre encore lisible, mais sensible aux opérations trop visibles.";
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

export function generateBlockReport(block: Block, previousBlock?: Block | null): BlockReport {
  const trends = getBlockTrends(previousBlock, block);
  const mood = getSocialMood(block);
  const favorableGroups = mood.favorableGroups.length > 0 ? mood.favorableGroups : ["Aucun groupe clairement acquis"];
  const tenseGroups = mood.tenseGroups.length > 0 ? mood.tenseGroups : ["Tensions diffuses"];
  const trendSummary = formatTrendSummary(trends);

  return {
    generalSituation:
      block.stats.stabilite >= 60
        ? `${block.name} conserve une stabilité exploitable, mais cette stabilité ne dit pas tout de l'adhésion sociale.`
        : `${block.name} présente une stabilité fragile, avec des arbitrages visibles dans plusieurs milieux sociaux.`,
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
        ? "Vulnérabilité : liberté en recul, risque de résistance mieux formulée."
        : block.stats.tensionSociale >= 58
          ? "Vulnérabilité : tension sociale transformable en langage politique."
          : "Vulnérabilité : acceptation encore réversible des dispositifs indirects.",
    possibleLeverage: getStrategicLeverage(block, mood),
    socialMood: mood,
    trends,
  };
}
