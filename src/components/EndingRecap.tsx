import { computeTrajectoryScores, getCollidingTrajectories, getDominantTrajectory, trajectoryLabels } from "../engine/trajectories";
import type { GameState, TrajectoryScores } from "../types/game";

type EndingRecapProps = {
  gameState: GameState;
};

/**
 * Bilan de fin de partie — passe "Crises et bilan".
 *
 * La fin du Grand Alignement est un diagnostic, pas un score. Cet écran le
 * rend mérité : les huit lectures politiques du monde construit, classées,
 * la dominante mise en avant, puis les moments clés de la partie relus dans
 * l'ordre — c'est la sédimentation des choix que la vision promet.
 */
export function EndingRecap({ gameState }: EndingRecapProps) {
  const scores = computeTrajectoryScores(gameState);
  const dominantLabel = getDominantTrajectory(scores);
  const collisions = getCollidingTrajectories(scores);

  const sortedTrajectories = (Object.keys(trajectoryLabels) as Array<keyof TrajectoryScores>).sort(
    (left, right) => scores[right] - scores[left],
  );

  // Moments clés : tout ce qui n'est pas le compte rendu d'opération du tour
  // (événements systémiques, crises, voix de personnages), relu en ordre
  // chronologique. Le journal conserve 40 entrées : la partie entière ou presque.
  const keyMoments = [...gameState.journal]
    .filter((event) => event.sourceId && event.sourceId !== "turn-plan")
    .sort((left, right) => left.turn - right.turn);

  return (
    <div className="ending-recap">
      <div className="ending-recap__section">
        <h3>Le monde que vous avez construit</h3>
        <p className="ending-recap__dominant">
          Lecture dominante : <strong>{dominantLabel}</strong>
          {collisions.length > 0 ? <> — en collision avec {collisions.join(", ")}</> : null}
        </p>
        <ul className="trajectory-list">
          {sortedTrajectories.map((trajectoryId) => {
            const label = trajectoryLabels[trajectoryId];
            const score = scores[trajectoryId];
            const isDominant = label === dominantLabel;

            return (
              <li className={`trajectory-list__item${isDominant ? " trajectory-list__item--dominant" : ""}`} key={trajectoryId}>
                <span className="trajectory-list__label">{label}</span>
                <span className="trajectory-list__bar" aria-hidden="true">
                  <span className="trajectory-list__fill" style={{ width: `${score}%` }} />
                </span>
                <span className="trajectory-list__score">{score}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {keyMoments.length > 0 && (
        <div className="ending-recap__section">
          <h3>Les moments qui ont compté</h3>
          <ol className="key-moments">
            {keyMoments.map((event) => (
              <li className="key-moments__item" key={event.id}>
                <span className="key-moments__turn">Tour {event.turn}</span>
                <div>
                  <p className="key-moments__title">{event.title}</p>
                  <p className="key-moments__text">{event.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
