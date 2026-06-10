import { describeCrisisRequirement, getCrisisDefinition } from "../engine/crises";
import type { ActiveCrisis, GlobalStats } from "../types/game";

type CrisisBannerProps = {
  activeCrisis: ActiveCrisis;
  globalStats: GlobalStats;
  turn: number;
};

/**
 * Bandeau de crise à échéance — passe "Crises et bilan".
 *
 * L'ultimatum doit être impossible à manquer : titre, exigence chiffrée,
 * valeur courante et compte à rebours. Le reste du récit vit dans le journal.
 */
export function CrisisBanner({ activeCrisis, globalStats, turn }: CrisisBannerProps) {
  const definition = getCrisisDefinition(activeCrisis.definitionId);

  if (!definition) {
    return null;
  }

  const currentValue = globalStats[definition.stat];
  const turnsLeft = Math.max(0, activeCrisis.deadlineTurn - turn + 1);
  const isLastTurn = turnsLeft <= 1;

  return (
    <section className={`crisis-banner${isLastTurn ? " crisis-banner--urgent" : ""}`} aria-live="polite">
      <p className="eyebrow">Crise en cours</p>
      <h2>{definition.title}</h2>
      <p className="crisis-banner__requirement">
        {describeCrisisRequirement(activeCrisis)} Valeur actuelle : <strong>{currentValue}</strong>.
      </p>
      <p className="crisis-banner__countdown">
        {isLastTurn
          ? "Dernier tour avant l'échéance."
          : `${turnsLeft} tours restants avant l'échéance.`}
      </p>
    </section>
  );
}
