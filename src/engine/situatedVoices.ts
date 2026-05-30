import type { Block, BlockId, InterBlockRelation } from "../types/game";
import { getRelationStatus } from "./relations";

export type SituatedVoice = {
  speaker: string;
  quote: string;
  context: string;
};

type BlockVoiceProfile = {
  speaker: string;
  location: string;
};

const blockVoiceProfiles: Record<BlockId, BlockVoiceProfile[]> = {
  "north-america": [
    { speaker: "un responsable de plateforme nord-américain", location: "côte ouest" },
    { speaker: "une éditorialiste canadienne", location: "Toronto" },
  ],
  europe: [
    { speaker: "une ministre allemande", location: "Berlin" },
    { speaker: "une universitaire française", location: "Paris" },
  ],
  "russia-eurasia": [
    { speaker: "un conseiller sécuritaire eurasien", location: "Moscou" },
    { speaker: "un analyste militaire", location: "Astana" },
  ],
  "industrial-asia": [
    { speaker: "un général coréen", location: "Séoul" },
    { speaker: "une industrielle japonaise", location: "Osaka" },
  ],
  "emerging-south": [
    { speaker: "un diplomate indien", location: "New Delhi" },
    { speaker: "une maire côtière", location: "Lagos" },
  ],
  "latin-america": [
    { speaker: "une éditorialiste brésilienne", location: "São Paulo" },
    { speaker: "un syndicaliste portuaire", location: "Valparaíso" },
  ],
};

function pickProfile(block: Block, seed: number): BlockVoiceProfile {
  const profiles = blockVoiceProfiles[block.id];
  return profiles[Math.abs(seed) % profiles.length];
}

function getRelatedRelations(blockId: BlockId, relations: InterBlockRelation[]): InterBlockRelation[] {
  return relations.filter((relation) => relation.from === blockId || relation.to === blockId);
}

export function getSituatedVoiceForBlock(block: Block, relations: InterBlockRelation[], seed = 0): SituatedVoice {
  const relatedRelations = getRelatedRelations(block.id, relations);
  const strongestRelation = [...relatedRelations].sort((left, right) => right.tension - left.tension)[0];
  const profile = pickProfile(block, seed + block.stats.tensionSociale + block.stats.confianceIA);

  if (block.stats.liberte <= 42) {
    return {
      speaker: `${profile.speaker}, ${profile.location}`,
      quote: "La rapidité d'une décision ne dit rien de sa légitimité.",
      context: "Liberté basse",
    };
  }

  if (block.stats.confianceIA >= 68) {
    return {
      speaker: `${profile.speaker}, ${profile.location}`,
      quote: "Nous ne parlons pas de dépendance, mais de coordination renforcée.",
      context: "Confiance IA élevée",
    };
  }

  if (block.stats.tensionSociale >= 60) {
    return {
      speaker: `${profile.speaker}, ${profile.location}`,
      quote: "Les indicateurs promettent le calme ; les citoyens demandent encore qui signe les décisions.",
      context: "Tension sociale",
    };
  }

  if (strongestRelation && strongestRelation.dependence >= 65) {
    return {
      speaker: `${profile.speaker}, ${profile.location}`,
      quote: "La dépendance devient politique lorsqu'elle n'a plus besoin d'être négociée.",
      context: "Dépendance extérieure",
    };
  }

  return {
    speaker: `${profile.speaker}, ${profile.location}`,
    quote: "La situation paraît stable surtout parce que chacun repousse la même question à plus tard.",
    context: "Observation locale",
  };
}

export function getSituatedVoiceForRelation(
  relation: InterBlockRelation | undefined,
  blocks: Block[],
): SituatedVoice | null {
  if (!relation) return null;

  const status = getRelationStatus(relation);
  const involvedBlocks = blocks.filter((block) => block.id === relation.from || block.id === relation.to);
  const firstBlock = involvedBlocks[0];
  const profile = firstBlock ? pickProfile(firstBlock, relation.tension + relation.cooperation) : null;

  if (relation.domain === "climate" && relation.tension >= 55) {
    return {
      speaker: "un diplomate indien",
      quote: "La coopération climatique ne peut pas devenir une nouvelle forme de tutelle.",
      context: relation.label,
    };
  }

  if (relation.domain === "security" && relation.tension >= 60) {
    return {
      speaker: "un général coréen",
      quote: "La désescalade existe encore. Elle demande seulement plus de courage que la préparation militaire.",
      context: relation.label,
    };
  }

  if ((relation.domain === "technology" || relation.domain === "information") && relation.dependence >= 60) {
    return {
      speaker: "un responsable de plateforme nord-américain",
      quote: "Nous ne gouvernons pas les sociétés ; nous les rendons fonctionnelles.",
      context: relation.label,
    };
  }

  if (relation.domain === "trade" || relation.domain === "resources") {
    return {
      speaker: "un syndicaliste portuaire",
      quote: "Quand les chaînes logistiques se taisent, c'est souvent que quelqu'un a cessé d'écouter les travailleurs.",
      context: relation.label,
    };
  }

  if (status === "critique" || status === "tendue") {
    return {
      speaker: profile ? `${profile.speaker}, ${profile.location}` : "une diplomate régionale",
      quote: "La coopération ne vaut que si chacun peut encore refuser.",
      context: relation.label,
    };
  }

  return null;
}
