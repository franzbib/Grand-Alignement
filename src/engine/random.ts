/**
 * Variance contrôlée — passe "Rythme et variance".
 *
 * Le déterminisme du moteur est un atout de test et une partie de l'identité
 * du prototype. La variance introduite ici est donc strictement bornée :
 *
 * 1. Elle est pilotée par un seed de partie, fixé à la création de l'état et
 *    injectable par les simulations — deux parties au même seed et aux mêmes
 *    choix restent identiques au point près.
 * 2. Elle ne porte que sur des CHOIX NARRATIFS entre options déjà éligibles
 *    (quel événement systémique parmi ceux dont les conditions sont réunies,
 *    quelle voix parmi les plus fortes) — jamais sur des amplitudes d'effets,
 *    des seuils ou des jets de réussite.
 *
 * Générateur : mulberry32, suffisant et reproductible partout.
 */

function mulberry32(seed: number): () => number {
  let internalState = seed >>> 0;

  return () => {
    internalState = (internalState + 0x6d2b79f5) >>> 0;
    let t = internalState;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Nombre pseudo-aléatoire [0, 1) déterminé par (seed, salt). */
export function seededFraction(seed: number, salt: number): number {
  return mulberry32(Math.imul(seed ^ 0x9e3779b9, 2654435761) + salt)();
}

/** Choix déterministe d'un élément parmi une liste, salé par le tour. */
export function seededPick<T>(items: T[], seed: number, salt: number): T | null {
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(seededFraction(seed, salt) * items.length);
  return items[Math.min(index, items.length - 1)];
}

/** Seed de partie par défaut : dérivé de l'horloge à la création. */
export function generateGameSeed(): number {
  return (Date.now() % 2147483647) || 1;
}
