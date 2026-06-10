import type { EvolutionReport } from "../types/game";

type EvolutionReportPanelProps = {
  report: EvolutionReport | null;
};

/**
 * Rapport d'évolution — passe "Rapport lisible".
 *
 * L'ancien rapport étalait quatorze rubriques (~280 mots) à chaque tour.
 * Nouvelle règle : l'essentiel d'abord, le détail à un clic.
 *
 * - Toujours visibles : le tour et l'opération, la synthèse, la note de
 *   soupçon (remontée du pied de page : elle est stratégique), l'alerte
 *   d'événement systémique et les signaux du monde (crises, motifs).
 * - Le reste vit dans quatre tiroirs <details> dont l'intitulé porte déjà
 *   l'information clé (compteurs, trajectoire dominante) : le rapport fermé
 *   renseigne, le rapport ouvert détaille. Aucune information n'est perdue.
 */
export function EvolutionReportPanel({ report }: EvolutionReportPanelProps) {
  if (!report) {
    return (
      <section className="panel evolution-report" aria-labelledby="evolution-report-title">
        <p className="eyebrow">Après déploiement</p>
        <h2 id="evolution-report-title">Rapport d'évolution</h2>
        <p className="panel-help">Le monde attend. Aucune opération n'a encore été déployée.</p>
      </section>
    );
  }

  const immediateInterventions = report.immediateInterventions ?? [];
  const preparedOperations = report.preparedOperations ?? [];
  const unlockedOperations = report.unlockedOperations ?? [];
  const globalChanges = report.globalChanges ?? [];
  const affectedBlocks = report.affectedBlocks ?? [];
  const socialSignals = report.socialSignals ?? [];
  const worldSignals = report.worldSignals ?? [];
  const relationChanges = report.relationChanges ?? [];
  const weakSignals = report.weakSignals ?? [];
  const secondaryTrajectories = report.secondaryTrajectories ?? [];
  const collidingTrajectories = report.collidingTrajectories ?? [];
  const trajectorySignals = [...collidingTrajectories, ...secondaryTrajectories].slice(0, 2);

  // Filtres anti-bruit (inchangés) : valeurs neutres et signaux par défaut.
  const mostAffectedBlock =
    report.mostAffectedBlock && report.mostAffectedBlock !== "Aucun bloc nettement affecté"
      ? report.mostAffectedBlock
      : null;
  const mainTension =
    report.mainTension && report.mainTension !== "Aucune tension principale détectée." ? report.mainTension : null;
  const filteredSocialSignals = socialSignals.filter((signal) => {
    const parts = signal.split(" : ");
    if (parts.length < 2) return true;
    return affectedBlocks.some((affected) => affected.startsWith(parts[0]));
  });
  const filteredWeakSignals = weakSignals.filter((signal) => !signal.includes("Équilibre encore lisible"));

  const playerGlobalChanges = report.playerGlobalChanges ?? [];
  const worldGlobalChanges = report.worldGlobalChanges ?? [];
  const hasAttribution = playerGlobalChanges.length > 0 || worldGlobalChanges.length > 0;

  const operationCount = immediateInterventions.length;
  const worldItemCount = globalChanges.length + affectedBlocks.length + filteredSocialSignals.length;
  const relationCount = relationChanges.length;

  const hasOperations = operationCount > 0 || preparedOperations.length > 0 || unlockedOperations.length > 0;
  const hasWorldDetail = worldItemCount > 0 || Boolean(mostAffectedBlock);
  const hasRelations = relationCount > 0 || Boolean(mainTension);
  const hasTrajectoryInsight = Boolean(report.dominantTrajectory) || trajectorySignals.length > 0;
  const hasWeakSignals = filteredWeakSignals.length > 0;
  const hasEvent = Boolean(report.systemicEventTitle);
  const hasAnythingNotable =
    hasOperations || hasWorldDetail || hasRelations || hasTrajectoryInsight || hasWeakSignals || hasEvent || worldSignals.length > 0;

  return (
    <section className="panel evolution-report" aria-labelledby="evolution-report-title">
      <p className="eyebrow">Après déploiement</p>
      <h2 id="evolution-report-title">Rapport d'évolution</h2>

      {/* --- L'essentiel, toujours visible --- */}
      <p className="report-summary">
        <strong>Tour {report.turn} ·</strong> {report.operationSummary}
      </p>
      <p className="report-synthesis">{report.synthesis ?? "Synthèse indisponible pour ce tour."}</p>

      {hasAttribution && (
        <p className="report-attribution">
          <strong>Vous :</strong> {playerGlobalChanges.length > 0 ? playerGlobalChanges.slice(0, 3).join(" · ") : "silence"}
          {"  —  "}
          <strong>Le monde :</strong> {worldGlobalChanges.length > 0 ? worldGlobalChanges.slice(0, 3).join(" · ") : "rien de notable"}
        </p>
      )}

      {report.suspicionNote && <p className="report-suspicion">{report.suspicionNote}</p>}

      {hasEvent && (
        <div className="report-event-alert" aria-live="polite">
          <span className="eyebrow">Événement systémique</span>
          <h3>{report.systemicEventTitle}</h3>
          <p>Le journal et les blocs concernés en mesurent la portée.</p>
        </div>
      )}

      {worldSignals.length > 0 && (
        <ul className="report-world-signals">
          {worldSignals.slice(0, 3).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      {/* --- Le détail, replié : l'intitulé porte déjà l'information clé --- */}
      <div className="report-folds">
        {hasOperations && (
          <details className="report-fold" open={unlockedOperations.length > 0}>
            <summary>
              Vos opérations
              <span className="report-fold__meta">
                {operationCount > 0 && `${operationCount} immédiate${operationCount > 1 ? "s" : ""}`}
                {preparedOperations.length > 0 && ` · ${preparedOperations.length} en préparation`}
                {unlockedOperations.length > 0 && ` · ${unlockedOperations.length} débloquée${unlockedOperations.length > 1 ? "s" : ""}`}
              </span>
            </summary>
            {immediateInterventions.length > 0 && <ReportList title="Interventions" items={immediateInterventions} />}
            {preparedOperations.length > 0 && <ReportList title="En préparation" items={preparedOperations} />}
            {unlockedOperations.length > 0 && <ReportList title="Nouvelles opérations disponibles" items={unlockedOperations} />}
          </details>
        )}

        {hasWorldDetail && (
          <details className="report-fold">
            <summary>
              Jauges et blocs
              <span className="report-fold__meta">
                {globalChanges.length > 0 && `${globalChanges.length} jauge${globalChanges.length > 1 ? "s" : ""}`}
                {affectedBlocks.length > 0 && ` · ${affectedBlocks.length} bloc${affectedBlocks.length > 1 ? "s" : ""}`}
                {mostAffectedBlock && ` · ${mostAffectedBlock}`}
              </span>
            </summary>
            {playerGlobalChanges.length > 0 && <ReportList title="Vos opérations" items={playerGlobalChanges} />}
            {worldGlobalChanges.length > 0 && <ReportList title="Le monde seul" items={worldGlobalChanges} />}
            {!hasAttribution && globalChanges.length > 0 && <ReportList title="Jauges globales" items={globalChanges} />}
            {affectedBlocks.length > 0 && <ReportList title="Évolutions locales" items={affectedBlocks} />}
            {filteredSocialSignals.length > 0 && <ReportList title="Climat social" items={filteredSocialSignals} />}
          </details>
        )}

        {hasRelations && (
          <details className="report-fold">
            <summary>
              Relations entre blocs
              <span className="report-fold__meta">
                {relationCount > 0 && `${relationCount} mouvement${relationCount > 1 ? "s" : ""}`}
                {mainTension && relationCount > 0 && " · tension en tête"}
              </span>
            </summary>
            {relationChanges.length > 0 && <ReportList title="Ce qui a bougé" items={relationChanges} />}
            {mainTension && (
              <div className="report-sub-section">
                <h4>Tension principale</h4>
                <p>{mainTension}</p>
              </div>
            )}
          </details>
        )}

        {hasTrajectoryInsight && (
          <details className="report-fold">
            <summary>
              Lecture historique
              {report.dominantTrajectory && <span className="report-fold__meta">{report.dominantTrajectory}</span>}
            </summary>
            <p className="report-muted">Indication provisoire — à confronter à la carte et aux blocs avant d'agir.</p>
            {trajectorySignals.length > 0 && <ReportList title="Orientations secondaires" items={trajectorySignals} />}
          </details>
        )}

        {hasWeakSignals && (
          <details className="report-fold">
            <summary>
              Signaux faibles
              <span className="report-fold__meta">{filteredWeakSignals.length}</span>
            </summary>
            <p className="report-muted">Rien ne se déclenche encore. Ceci commence à se déplacer.</p>
            <ul>
              {filteredWeakSignals.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {!hasAnythingNotable && (
        <p className="report-muted">
          Aucun mouvement notable ce tour. Le monde maintient son inertie — ce qui n'est ni une garantie ni un repos.
        </p>
      )}
    </section>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="report-sub-section">
      <h4>{title}</h4>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
