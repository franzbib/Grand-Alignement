import type { EvolutionReport } from "../types/game";

type EvolutionReportPanelProps = {
  report: EvolutionReport | null;
};

export function EvolutionReportPanel({ report }: EvolutionReportPanelProps) {
  if (!report) {
    return (
      <section className="panel evolution-report" aria-labelledby="evolution-report-title">
        <p className="eyebrow">Après déploiement</p>
        <h2 id="evolution-report-title">Rapport d'évolution</h2>
        <p className="panel-help">Aucune opération n'a encore été déployée.</p>
      </section>
    );
  }

  const immediateInterventions = report.immediateInterventions ?? [];
  const preparedOperations = report.preparedOperations ?? [];
  const unlockedOperations = report.unlockedOperations ?? [];
  const affectedBlocks = report.affectedBlocks ?? [];
  const socialSignals = report.socialSignals ?? [];
  const worldSignals = report.worldSignals ?? [];
  const relationChanges = report.relationChanges ?? [];
  const weakSignals = report.weakSignals ?? [];
  const secondaryTrajectories = report.secondaryTrajectories ?? [];
  const collidingTrajectories = report.collidingTrajectories ?? [];
  const trajectorySignals = [...collidingTrajectories, ...secondaryTrajectories].slice(0, 2);
  const hasTrajectoryInsight = Boolean(report.dominantTrajectory) || trajectorySignals.length > 0;

  // Filter out neutral values to avoid noise
  const mostAffectedBlock = report.mostAffectedBlock && report.mostAffectedBlock !== "Aucun bloc nettement affecté"
    ? report.mostAffectedBlock
    : null;

  const mainTension = report.mainTension && report.mainTension !== "Aucune tension principale détectée."
    ? report.mainTension
    : null;

  // Filter social signals: show only for blocks that had actual changes
  const filteredSocialSignals = socialSignals.filter(signal => {
    const parts = signal.split(" : ");
    if (parts.length < 2) return true;
    const blockName = parts[0];
    return affectedBlocks.some(affected => affected.startsWith(blockName));
  });

  // Filter weak signals: hide default neutral risks
  const filteredWeakSignals = weakSignals.filter(
    (signal) => !signal.includes("Équilibre encore lisible")
  );

  // Determine section visibility based on actual changes
  const hasEvent = Boolean(report.systemicEventTitle);

  const hasEffetsMajeurs = immediateInterventions.length > 0 || 
                           report.globalChanges.length > 0 || 
                           worldSignals.length > 0;

  const hasBlocsAffectes = affectedBlocks.length > 0 || 
                           filteredSocialSignals.length > 0 || 
                           Boolean(mostAffectedBlock);

  const hasRelations = relationChanges.length > 0 || 
                       Boolean(mainTension);

  const hasPlanification = preparedOperations.length > 0 || 
                           unlockedOperations.length > 0;

  const hasWeakSignals = filteredWeakSignals.length > 0;

  const hasAnyNotableChange = hasEffetsMajeurs || 
                              hasBlocsAffectes || 
                              hasRelations || 
                              hasPlanification || 
                              hasEvent || 
                              hasWeakSignals ||
                              hasTrajectoryInsight;

  return (
    <section className="panel evolution-report" aria-labelledby="evolution-report-title">
      <p className="eyebrow">Après déploiement</p>
      <h2 id="evolution-report-title">Rapport d'évolution</h2>

      <p className="report-summary">
        <strong>Tour {report.turn} ·</strong> {report.operationSummary}
      </p>
      <p className="report-synthesis">{report.synthesis ?? "Synthèse indisponible pour ce tour."}</p>

      <div className="report-grid">
        {hasEffetsMajeurs && (
          <div>
            <h3>Effets majeurs</h3>
            
            {immediateInterventions.length > 0 && (
              <div className="report-sub-section">
                <h4>Interventions</h4>
                <ul>
                  {immediateInterventions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {report.globalChanges.length > 0 && (
              <div className="report-sub-section">
                <h4>Indicateurs</h4>
                <ul>
                  {report.globalChanges.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {worldSignals.length > 0 && (
              <div className="report-sub-section">
                <h4>Tendances globales</h4>
                <ul>
                  {worldSignals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasBlocsAffectes && (
          <div>
            <h3>Blocs affectés</h3>
            
            {affectedBlocks.length > 0 && (
              <div className="report-sub-section">
                <h4>Variations</h4>
                <ul>
                  {affectedBlocks.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {filteredSocialSignals.length > 0 && (
              <div className="report-sub-section">
                <h4>Sociétés</h4>
                <ul>
                  {filteredSocialSignals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {mostAffectedBlock && (
              <div className="report-sub-section">
                <h4>Focus</h4>
                <p>{mostAffectedBlock}</p>
              </div>
            )}
          </div>
        )}

        {hasRelations && (
          <div>
            <h3>Relations inter-blocs</h3>
            
            {relationChanges.length > 0 && (
              <div className="report-sub-section">
                <h4>Frictions & Évolutions</h4>
                <ul>
                  {relationChanges.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {mainTension && (
              <div className="report-sub-section">
                <h4>Point chaud</h4>
                <p>{mainTension}</p>
              </div>
            )}
          </div>
        )}

        {hasTrajectoryInsight && (
          <div className="trajectory-diagnostic">
            <h3>Lecture de trajectoire</h3>
            {report.dominantTrajectory && <p>Dominante : {report.dominantTrajectory}</p>}
            {trajectorySignals.length > 0 && (
              <div className="report-sub-section">
                <h4>Signaux secondaires</h4>
                <ul>
                  {trajectorySignals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasPlanification && (
          <div>
            <h3>Opérations préparées</h3>
            
            {preparedOperations.length > 0 && (
              <div className="report-sub-section">
                <h4>En cours</h4>
                <ul>
                  {preparedOperations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {unlockedOperations.length > 0 && (
              <div className="report-sub-section">
                <h4>Débloquées</h4>
                <ul>
                  {unlockedOperations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasEvent && (
          <div className="report-event-alert" aria-live="polite" style={{ gridColumn: "1 / -1" }}>
            <span className="eyebrow">Événement Systémique</span>
            <h3>{report.systemicEventTitle}</h3>
            <p>Une réaction majeure a secoué les équilibres mondiaux. Consultez le journal des conséquences ou les blocs concernés pour en mesurer les impacts.</p>
          </div>
        )}

        {hasWeakSignals && (
          <div>
            <h3>Signaux faibles</h3>
            <ul>
              {filteredWeakSignals.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasAnyNotableChange && (
          <div style={{ gridColumn: "1 / -1" }}>
            <h3>Statut général</h3>
            <p>Aucun changement notable ce tour-ci.</p>
          </div>
        )}
      </div>

      {report.suspicionNote && <p className="report-suspicion">{report.suspicionNote}</p>}
    </section>
  );
}
