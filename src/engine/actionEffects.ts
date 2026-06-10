import type { Action, BlockStats, GlobalStats, StatDelta } from "../types/game";

/**
 * Pastilles d'effets — passe "Cause et effet".
 *
 * Doctrine : le flou légitime du jeu porte sur les conséquences de second
 * ordre (ce que le monde fait du geste) ; jamais sur l'effet de premier ordre.
 * Chaque carte d'action affiche donc la DIRECTION des jauges qu'elle pousse —
 * pas les amplitudes exactes ni les modificateurs, qui restent le territoire
 * du brouillard. Règle de charte associée : aucune information mécanique ne
 * doit avoir le texte pour seul véhicule.
 *
 * Pas de coloration morale : pousser une jauge dans un sens est une politique,
 * pas une faute. Seul le soupçon — la ressource de survie du joueur — est
 * sémantiquement coloré, et affiché en valeur nette exacte.
 */

export type EffectBadge = {
  label: string;
  /** "up" | "down", doublé si l'amplitude est forte (>= 4). */
  direction: "up" | "down";
  strong: boolean;
};

const GLOBAL_LABELS: Record<keyof GlobalStats, string> = {
  cohesionMondiale: "Cohésion",
  risqueEscalade: "Escalade",
  autonomieHumaine: "Autonomie",
  stressClimatique: "Climat",
  puissanceIA: "Puissance IA",
  soupconIA: "Soupçon",
};

const BLOCK_LABELS: Record<keyof BlockStats, string> = {
  tensionSociale: "tension",
  confianceIA: "confiance",
  stabilite: "stabilité",
  richesse: "richesse",
  liberte: "liberté",
  education: "éducation",
};

function toBadges<TStats extends Record<string, number>>(
  delta: StatDelta<TStats>,
  labels: Record<keyof TStats, string>,
  skip?: keyof TStats,
): EffectBadge[] {
  const badges: EffectBadge[] = [];

  for (const key of Object.keys(delta) as Array<keyof TStats>) {
    const value = delta[key] ?? 0;

    if (value === 0 || key === skip) {
      continue;
    }

    badges.push({ label: labels[key], direction: value > 0 ? "up" : "down", strong: Math.abs(value) >= 4 });
  }

  return badges;
}

/** Pastilles des jauges globales (hors soupçon, traité à part). */
export function getGlobalEffectBadges(action: Action): EffectBadge[] {
  return toBadges(action.globalEffects, GLOBAL_LABELS, "soupconIA");
}

/** Pastilles des effets de bloc (ligne secondaire, plus discrète). */
export function getBlockEffectBadges(action: Action): EffectBadge[] {
  return toBadges(action.blockEffects, BLOCK_LABELS);
}

/** Signature nette de soupçon : la seule valeur affichée exactement. */
export function getNetSuspicionEffect(action: Action): number {
  return action.suspicionEffect + (action.globalEffects.soupconIA ?? 0);
}

/** Vrai si l'action pousse cette jauge globale (dans un sens ou l'autre). */
export function actionTouchesGauge(action: Action, gauge: keyof GlobalStats): boolean {
  if (gauge === "soupconIA") {
    return getNetSuspicionEffect(action) < 0;
  }

  return (action.globalEffects[gauge] ?? 0) !== 0;
}

export { GLOBAL_LABELS };
