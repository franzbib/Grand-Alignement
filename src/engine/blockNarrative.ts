import { generateBlockReport, getBlockTrends } from "./reports";
import type { Block, BlockId, InterBlockRelation } from "../types/game";

export type BlockIndicator = {
  label: string;
  value: string;
};

export type BlockBrief = {
  label: string;
  text: string;
};

export type BlockNarrativeSummary = {
  year: number;
  direction: string;
  summary: string;
  indicators: BlockIndicator[];
  briefs: BlockBrief[];
};

export function getGameYear(turn: number): number {
  return 2035 + turn;
}

function getRelatedRelations(blockId: BlockId, relations: InterBlockRelation[]): InterBlockRelation[] {
  return relations.filter((relation) => relation.from === blockId || relation.to === blockId);
}

function getPoliticalClimate(block: Block): string {
  if (block.stats.liberte <= 38) return "autoritaire";
  if (block.stats.tensionSociale >= 68) return "fragmenté";
  if (block.stats.tensionSociale >= 55) return "tendu";
  if (block.stats.stabilite >= 65 && block.stats.liberte >= 55) return "stable";
  if (block.stats.stabilite >= 62) return "crispé mais contrôlé";
  return "incertain";
}

function getAiRelation(block: Block): string {
  if (block.stats.confianceIA >= 72) return "confiance excessive";
  if (block.stats.confianceIA >= 60) return "dépendance fonctionnelle";
  if (block.stats.confianceIA >= 48) return "adoption pragmatique";
  if (block.stats.tensionSociale >= 60 && block.stats.liberte >= 52) return "résistance civique";
  return "méfiance diffuse";
}

function getSocialState(block: Block): string {
  if (block.stats.tensionSociale >= 70) return "polarisé";
  if (block.stats.tensionSociale >= 58) return "inquiet";
  if (block.stats.education >= 62 && block.stats.liberte >= 55) return "mobilisé";
  if (block.stats.stabilite >= 65 && block.stats.tensionSociale <= 45) return "apaisé";
  return "résigné";
}

function getDominantRisk(block: Block, relations: InterBlockRelation[]): string {
  const relatedRelations = getRelatedRelations(block.id, relations);
  const securityTension = Math.max(0, ...relatedRelations.filter((relation) => relation.domain === "security").map((relation) => relation.tension));
  const techDependence = Math.max(0, ...relatedRelations.filter((relation) => relation.domain === "technology").map((relation) => relation.dependence));
  const climateTension = Math.max(0, ...relatedRelations.filter((relation) => relation.domain === "climate").map((relation) => relation.tension));

  if (securityTension >= 68) return "militarisation";
  if (block.stats.confianceIA >= 70 && block.stats.liberte <= 48) return "alignement algorithmique";
  if (techDependence >= 70 && block.stats.liberte <= 48) return "capture privée";
  if (climateTension >= 65 || (block.stats.stabilite <= 45 && block.stats.richesse <= 45)) return "effondrement climatique";
  if (block.stats.tensionSociale >= 66) return "révolte";
  if (block.stats.education <= 42 && block.stats.tensionSociale <= 52) return "abêtissement";
  if (block.stats.stabilite <= 45) return "paralysie";
  return "dépendance lente";
}

export function getDominantDirection(block: Block, relations: InterBlockRelation[] = []): string {
  const risk = getDominantRisk(block, relations);

  if (risk === "militarisation") return "Course à la sécurité";
  if (risk === "capture privée") return "Capture privée";
  if (risk === "alignement algorithmique") return "Alignement algorithmique";
  if (risk === "révolte") return "Fragmentation sociale";
  if (risk === "effondrement climatique") return "Mobilisation écologique contrainte";
  if (block.stats.confianceIA >= 62 && block.stats.stabilite >= 60) return "Stabilisation technocratique";
  if (block.stats.education >= 62 && block.stats.liberte >= 55) return "Réveil critique";
  if (block.stats.liberte <= 42) return "Glissement autoritaire";
  if (block.stats.stabilite >= 64 && block.stats.tensionSociale <= 45) return "Pacification par le confort";
  if (block.stats.stabilite <= 45) return "Blocage institutionnel";
  return "Dépendance fonctionnelle à l'IA";
}

function getSummary(block: Block, previousBlock: Block | undefined, relations: InterBlockRelation[]): string {
  const report = generateBlockReport(block, previousBlock, relations);
  const direction = getDominantDirection(block, relations);
  const aiRelation = getAiRelation(block);
  const socialState = getSocialState(block);

  return `${block.name} suit une trajectoire de ${direction.toLowerCase()}. Le climat social paraît ${socialState}, tandis que le rapport à l'IA relève surtout de l'${aiRelation}. ${report.strategicReading}`;
}

function getBriefs(block: Block, previousBlock: Block | undefined, relations: InterBlockRelation[], year: number): BlockBrief[] {
  const report = generateBlockReport(block, previousBlock, relations);
  const trends = getBlockTrends(previousBlock, block);
  const relatedRelations = getRelatedRelations(block.id, relations);
  const tenseRelation = [...relatedRelations].sort((left, right) => right.tension - left.tension)[0];
  const mainTrend = trends[0];

  const institutionalText =
    block.stats.confianceIA >= 62
      ? "les administrations étendent les protocoles d'aide à la décision sans débat public très visible."
      : block.stats.liberte <= 45
        ? "un comité de contrôle annonce des restrictions provisoires, reconduites sans calendrier clair."
        : "les institutions publient une note prudente sur la coordination des décisions publiques.";

  const socialText = mainTrend
    ? `${mainTrend.label} ${mainTrend.direction === "up" ? "progresse" : "recule"} nettement depuis le dernier tour.`
    : report.socialMood.summary;

  const localText =
    block.stats.education <= 45
      ? "un éditorial demande si comprendre reste nécessaire lorsque les tableaux de bord répondent avant les citoyens."
      : block.stats.tensionSociale >= 60
        ? "plusieurs collectifs contestent une optimisation jugée efficace, mais sans visage."
        : "un quotidien local s'interroge sur la différence entre confort public et consentement réel.";

  const relationText = tenseRelation
    ? `${tenseRelation.label.toLowerCase()} impose un bruit de fond ${tenseRelation.tension >= 65 ? "préoccupant" : "persistant"}.`
    : "aucune relation extérieure ne domine encore la lecture du bloc.";

  return [
    { label: `${year} — Note institutionnelle`, text: institutionalText },
    { label: `${year} — Signal social`, text: socialText },
    { label: `${year} — Tension discrète`, text: relationText },
    { label: `${year} — Brève locale`, text: localText },
  ];
}

export function generateBlockNarrativeSummary(
  block: Block,
  previousBlock: Block | undefined,
  relations: InterBlockRelation[],
  year: number,
): BlockNarrativeSummary {
  return {
    year,
    direction: getDominantDirection(block, relations),
    summary: getSummary(block, previousBlock, relations),
    indicators: [
      { label: "Climat politique", value: getPoliticalClimate(block) },
      { label: "Rapport à l'IA", value: getAiRelation(block) },
      { label: "Risque dominant", value: getDominantRisk(block, relations) },
      { label: "État social", value: getSocialState(block) },
    ],
    briefs: getBriefs(block, previousBlock, relations, year),
  };
}
