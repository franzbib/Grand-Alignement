import type { Action, StatDelta, BlockStats } from "../types/game";

/**
 * Paliers de soupçon — passe "Le monde répond" (v0.2 gameplay).
 *
 * Avant cette passe, le soupçon IA était purement narratif : aucune jauge à 100
 * ne produisait la moindre conséquence mécanique, ce qui vidait la prémisse
 * clandestine de son enjeu (cf. docs/audits/audit-jouabilite-interet-v0-2.md).
 *
 * Désormais :
 * - < 30 : bruit de fond. Rien ne change.
 * - 30–59 : perceptible. Purement narratif (comme avant).
 * - 60–79 : vigilance. La confiance IA s'érode d'elle-même dans tous les blocs.
 * - 80–95 : enquête. Érosion plus forte + les opérations à forte signature
 *   (suspicionEffect >= 4) sont suspendues : l'IA doit réduire son empreinte.
 * - >= 96 : exposition. Fin de partie immédiate, même avant le tour minimal.
 *
 * En contrepartie, la discrétion est récompensée : un tour dont la signature
 * cumulée est très faible fait retomber le soupçon (le motif se dissout dans
 * le bruit). Et la répétition d'un même motif d'influence devient détectable :
 * efficacité décroissante et soupçon supplémentaire.
 */

export const SUSPICION_PERCEPTIBLE_THRESHOLD = 30;
export const SUSPICION_VIGILANCE_THRESHOLD = 60;
export const SUSPICION_INVESTIGATION_THRESHOLD = 80;
export const SUSPICION_EXPOSURE_THRESHOLD = 96;

/** suspicionEffect à partir duquel une action est jugée "à forte signature". */
export const HIGH_SIGNATURE_THRESHOLD = 4;

/** Signature cumulée d'un tour en dessous de laquelle le soupçon retombe. */
export const DISCRETION_SIGNATURE_LIMIT = 2;
export const DISCRETION_SUSPICION_DECAY = -3;

/**
 * Tour d'observation : l'IA ne déploie rien, le monde continue sans elle.
 * Le silence total fait retomber le soupçon plus vite que la discrétion —
 * mais coûte un tour entier de tempo, fait vieillir les fenêtres des
 * opérations préparées, et laisse les crises courir vers leur échéance.
 */
export const OBSERVATION_SUSPICION_DECAY = -4;

/** Fenêtre (en tours) sur laquelle un motif répété reste détectable. */
export const PATTERN_MEMORY_TURNS = 2;
/** Soupçon ajouté par répétition récente d'une même action. */
export const PATTERN_SUSPICION_PER_REPEAT = 2;
/** Efficacité multipliée par ce facteur à chaque répétition récente. */
export const PATTERN_EFFICIENCY_FACTOR = 0.65;
export const PATTERN_EFFICIENCY_FLOOR = 0.35;

export type SuspicionTier = "background" | "perceptible" | "vigilance" | "investigation" | "exposure";

export function getSuspicionTier(soupconIA: number): SuspicionTier {
  if (soupconIA >= SUSPICION_EXPOSURE_THRESHOLD) return "exposure";
  if (soupconIA >= SUSPICION_INVESTIGATION_THRESHOLD) return "investigation";
  if (soupconIA >= SUSPICION_VIGILANCE_THRESHOLD) return "vigilance";
  if (soupconIA >= SUSPICION_PERCEPTIBLE_THRESHOLD) return "perceptible";
  return "background";
}

export function getSuspicionTierLabel(soupconIA: number): string {
  switch (getSuspicionTier(soupconIA)) {
    case "exposure":
      return "exposition";
    case "investigation":
      return "enquête";
    case "vigilance":
      return "vigilance";
    case "perceptible":
      return "perceptible";
    default:
      return "bruit de fond";
  }
}

/** En zone d'enquête, les opérations à forte signature sont suspendues. */
export function isActionSuspendedBySuspicion(action: Action, soupconIA: number): boolean {
  return soupconIA >= SUSPICION_INVESTIGATION_THRESHOLD && action.suspicionEffect >= HIGH_SIGNATURE_THRESHOLD;
}

/** Érosion automatique de la confiance IA des blocs selon le palier. */
export function getSuspicionTrustErosion(soupconIA: number): StatDelta<BlockStats> {
  if (soupconIA >= SUSPICION_INVESTIGATION_THRESHOLD) {
    return { confianceIA: -3 };
  }

  if (soupconIA >= SUSPICION_VIGILANCE_THRESHOLD) {
    return { confianceIA: -2 };
  }

  return {};
}

/** Multiplicateur d'efficacité d'une action répétée `repeats` fois récemment. */
export function getPatternEfficiencyMultiplier(repeats: number): number {
  if (repeats <= 0) {
    return 1;
  }

  return Math.max(PATTERN_EFFICIENCY_FLOOR, PATTERN_EFFICIENCY_FACTOR ** repeats);
}

/** Nombre d'occurrences récentes de chaque action sur la fenêtre mémorisée. */
export function countRecentActionUses(recentTurnActionIds: string[][]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const turnActionIds of recentTurnActionIds) {
    for (const actionId of turnActionIds) {
      counts.set(actionId, (counts.get(actionId) ?? 0) + 1);
    }
  }

  return counts;
}
