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

function getHistoricalPhase(year: number): "early" | "middle" | "late" {
  if (year <= 2039) return "early";
  if (year <= 2044) return "middle";
  return "late";
}

function pickVariant<T>(items: T[], block: Block, year: number): T {
  const blockSeed = block.id.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  return items[(blockSeed + year) % items.length];
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

function formatAiRelationPhrase(aiRelation: string): string {
  switch (aiRelation) {
    case "confiance excessive":
      return "Le bloc fait preuve d'une confiance excessive envers l'IA, sans toujours distinguer assistance et délégation.";
    case "dépendance fonctionnelle":
      return "La dépendance aux systèmes automatisés s'est installée sans débat public notable.";
    case "adoption pragmatique":
      return "L'IA est adoptée de façon pragmatique : utile, mais pas encore structurante.";
    case "résistance civique":
      return "Une résistance civique organise son vocabulaire autour de la question algorithmique.";
    default:
      return "La méfiance envers l'IA reste diffuse, peu organisée, difficile à mobiliser.";
  }
}

function getDecorativeQuote(block: Block, year: number): string | null {
  const aiRelation = getAiRelation(block);
  const socialState = getSocialState(block);
  const climate = getPoliticalClimate(block);

  if (aiRelation === "confiance excessive") {
    return pickVariant(
      [
        '« L\'algorithme propose, le gouvernement dispose », assure un porte-parole officiel.',
        '« La coordination est devenue notre méthode. Ce n\'est pas une dépendance, c\'est une efficacité », affirme un responsable technique.',
      ],
      block,
      year,
    );
  }

  if (aiRelation === "résistance civique") {
    return pickVariant(
      [
        '« La stabilité n\'est pas le silence », prévient une universitaire.',
        '« Nous ne refusons pas l\'outil. Nous refusons qu\'il décide à notre place », déclare un collectif citoyen.',
      ],
      block,
      year,
    );
  }

  if (climate === "autoritaire" || block.stats.liberte <= 40) {
    return '« Les canaux restent ouverts ; c\'est leur usage qui se raréfie », note un observateur indépendant.';
  }

  if (socialState === "polarisé" || block.stats.tensionSociale >= 68) {
    return pickVariant(
      [
        '« La fracture ne date pas d\'hier. Elle a seulement cessé d\'être discrète », constate un sociologue.',
        '« Les deux camps ont raison sur des choses différentes. C\'est ce qui rend la médiation si difficile », observe un diplomate.',
      ],
      block,
      year,
    );
  }

  if (aiRelation === "dépendance fonctionnelle" && block.stats.liberte <= 50) {
    return '« Nous ne parlons pas de dépendance, mais de coordination renforcée », affirme un ministre.';
  }

  return null;
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

export function getDominantDirection(
  block: Block,
  relations: InterBlockRelation[] = [],
  previousBlock?: Block,
): string {
  const risk = getDominantRisk(block, relations);
  const trends = getBlockTrends(previousBlock, block);
  const trustTrend = trends.find((trend) => trend.stat === "confianceIA");
  const tensionTrend = trends.find((trend) => trend.stat === "tensionSociale");
  const libertyTrend = trends.find((trend) => trend.stat === "liberte");

  if (risk === "militarisation") return "Course à la sécurité";
  if (risk === "capture privée") return "Capture privée";
  if (risk === "alignement algorithmique") return "Alignement algorithmique";
  if (risk === "révolte") return "Fragmentation sociale";
  if (risk === "effondrement climatique") return "Mobilisation écologique contrainte";
  if (trustTrend?.direction === "up" && block.stats.confianceIA >= 58) return "Dépendance fonctionnelle à l'IA";
  if (tensionTrend?.direction === "up" && block.stats.tensionSociale >= 54) return "Tension latente";
  if (libertyTrend?.direction === "down" && block.stats.stabilite >= 58) return "Pacification administrative";
  if (block.stats.confianceIA >= 62 && block.stats.stabilite >= 60) return "Stabilisation technocratique";
  if (block.stats.education >= 62 && block.stats.liberte >= 55) return "Réveil critique";
  if (block.stats.liberte <= 42) return "Glissement autoritaire";
  if (block.stats.stabilite >= 64 && block.stats.tensionSociale <= 45) return "Pacification par le confort";
  if (block.stats.stabilite <= 45) return "Blocage institutionnel";
  return "Dépendance fonctionnelle à l'IA";
}

function getTrendReading(block: Block, previousBlock: Block | undefined, year: number): string {
  const trends = getBlockTrends(previousBlock, block);
  const strongestTrend = trends[0];
  const phase = getHistoricalPhase(year);

  if (strongestTrend) {
    return `${strongestTrend.label} ${strongestTrend.direction === "up" ? "monte" : "recule"} : le mouvement reste ${Math.abs(strongestTrend.delta) >= 4 ? "net" : "mesuré"}.`;
  }

  if (phase === "early") {
    return "Les signaux restent prudents ; les institutions décrivent encore la situation comme réversible.";
  }

  if (phase === "middle") {
    return "La continuité devient un fait politique : même sans rupture visible, les habitudes se déplacent.";
  }

  return "L'absence de bascule brutale ne suffit plus à parler de stabilité ; les routines ont déjà produit leur histoire.";
}

function getSummary(block: Block, previousBlock: Block | undefined, relations: InterBlockRelation[], year: number): string {
  const report = generateBlockReport(block, previousBlock, relations);
  const aiRelation = getAiRelation(block);
  const climate = getPoliticalClimate(block);
  const trendReading = getTrendReading(block, previousBlock, year);
  const aiPhrase = formatAiRelationPhrase(aiRelation);

  const contextualNote = pickVariant(
    [
      "Les observateurs internes notent moins un choc qu'une habitude nouvelle.",
      "La ligne officielle reste calme, mais les arbitrages deviennent plus visibles.",
      "Les institutions décrivent encore la situation comme maîtrisée.",
    ],
    block,
    year,
  );

  const climateClause =
    climate === "autoritaire"
      ? `Le bloc est politiquement ${climate} : la stabilité visible repose sur une liberté restreinte.`
      : climate === "fragmenté" || climate === "tendu"
        ? `Le bloc traverse une période ${climate === "fragmenté" ? "de fragmentation croissante" : "de tensions perceptibles"}.`
        : `Le bloc présente un climat politique ${climate}.`;

  const quote = getDecorativeQuote(block, year);
  const quotePart = quote ? ` ${quote}` : "";

  return `${climateClause} ${aiPhrase} ${trendReading} ${contextualNote} ${report.strategicReading}${quotePart}`;
}

function getBriefs(block: Block, previousBlock: Block | undefined, relations: InterBlockRelation[], year: number): BlockBrief[] {
  const report = generateBlockReport(block, previousBlock, relations);
  const trends = getBlockTrends(previousBlock, block);
  const relatedRelations = getRelatedRelations(block.id, relations);
  const tenseRelation = [...relatedRelations].sort((left, right) => right.tension - left.tension)[0];
  const mainTrend = trends[0];
  const phase = getHistoricalPhase(year);

  const institutionalText =
    block.stats.confianceIA >= 68
      ? pickVariant(
          [
            "les administrations confient aux systèmes prédictifs une part croissante du tri des urgences.",
            "un rapport public vante la simplicité des décisions préclassées.",
            "les services centraux annoncent que l'aide algorithmique réduit les délais, sans préciser ce qu'elle écarte.",
          ],
          block,
          year,
        )
      : block.stats.liberte <= 45 && block.stats.stabilite >= 58
        ? pickVariant(
            [
              "un comité de contrôle annonce des restrictions provisoires, reconduites sans calendrier clair.",
              "les autorités défendent une pacification civique présentée comme strictement technique.",
              "plusieurs juristes notent que les exceptions deviennent plus faciles à prolonger qu'à justifier.",
            ],
            block,
            year,
          )
        : phase === "late"
          ? "les institutions publient une note de continuité ; personne ne la lit comme une vraie nouvelle."
          : "les institutions publient une note prudente sur la coordination des décisions publiques.";

  const socialText = mainTrend
    ? `${mainTrend.label} ${mainTrend.direction === "up" ? "progresse" : "recule"} nettement depuis le dernier tour.`
    : report.socialMood.summary;

  const localText =
    block.stats.education <= 45 && block.stats.confianceIA >= 55
      ? pickVariant(
          [
            "un éditorial demande si comprendre reste nécessaire lorsque les tableaux de bord répondent avant les citoyens.",
            "un quotidien titre : « La décision est claire ; l'explication suivra peut-être. »",
            "des enseignants signalent que les élèves savent interpréter les scores, moins les raisons.",
          ],
          block,
          year,
        )
      : block.stats.tensionSociale >= 60
        ? pickVariant(
            [
              "plusieurs collectifs contestent une optimisation jugée efficace, mais sans visage.",
              "des syndicats dénoncent une automatisation sans débat public.",
              "la presse locale compte les files d'attente, puis les raisons de la colère.",
            ],
            block,
            year,
          )
        : block.stats.liberte >= 58 && block.stats.education >= 58
          ? "un débat public attire plus de monde que prévu ; les organisateurs s'en félicitent avec prudence."
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
    direction: getDominantDirection(block, relations, previousBlock),
    summary: getSummary(block, previousBlock, relations, year),
    indicators: [
      { label: "Climat politique", value: getPoliticalClimate(block) },
      { label: "Rapport à l'IA", value: getAiRelation(block) },
      { label: "Péril dominant", value: getDominantRisk(block, relations) },
      { label: "Climat social", value: getSocialState(block) },
    ],
    briefs: getBriefs(block, previousBlock, relations, year),
  };
}
