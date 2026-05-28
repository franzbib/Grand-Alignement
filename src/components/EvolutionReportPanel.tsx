import type { EvolutionReport } from "../types/game";

type EvolutionReportPanelProps = {
  report: EvolutionReport | null;
};

export function EvolutionReportPanel({ report }: EvolutionReportPanelProps) {
  const immediateInterventions = report?.immediateInterventions ?? [];
  const preparedOperations = report?.preparedOperations ?? [];
  const unlockedOperations = report?.unlockedOperations ?? [];
  const affectedBlocks = report?.affectedBlocks ?? [];
  const socialSignals = report?.socialSignals ?? [];
  const worldSignals = report?.worldSignals ?? [];
  const relationChanges = report?.relationChanges ?? [];
  const weakSignals = report?.weakSignals ?? [];

  return (
    <section className="panel evolution-report" aria-labelledby="evolution-report-title">
      <p className="eyebrow">Après déploiement</p>
      <h2 id="evolution-report-title">Rapport d'évolution</h2>
      {!report ? (
        <p className="panel-help">Aucune opération n'a encore été déployée.</p>
      ) : (
        <>
          <p>
            <strong>Tour {report.turn}.</strong> {report.operationSummary}
          </p>
          <p>{report.synthesis ?? "Synthèse indisponible pour ce tour."}</p>
          <div className="report-grid">
            <div>
              <h3>Interventions immédiates</h3>
              <ul>
                {immediateInterventions.length > 0 ? (
                  immediateInterventions.map((intervention) => <li key={intervention}>{intervention}</li>)
                ) : (
                  <li>Aucune intervention immédiate dominante.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Préparations</h3>
              <ul>
                {preparedOperations.length > 0 ? (
                  preparedOperations.map((operation) => <li key={operation}>{operation}</li>)
                ) : (
                  <li>Aucune opération préparée ce tour.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Débloqué pour la suite</h3>
              <ul>
                {unlockedOperations.length > 0 ? (
                  unlockedOperations.map((operation) => <li key={operation}>{operation}</li>)
                ) : (
                  <li>Aucune opération nouvelle.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Changements globaux</h3>
              <ul>
                {report.globalChanges.length > 0 ? (
                  report.globalChanges.map((change) => <li key={change}>{change}</li>)
                ) : (
                  <li>Aucun changement global dominant.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Blocs affectés</h3>
              <ul>
                {affectedBlocks.length > 0 ? (
                  affectedBlocks.map((block) => <li key={block}>{block}</li>)
                ) : (
                  <li>Aucun bloc ne se détache nettement.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Groupes sociaux</h3>
              <ul>
                {socialSignals.length > 0 ? (
                  socialSignals.map((signal) => <li key={signal}>{signal}</li>)
                ) : (
                  <li>Signal social encore diffus.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Dynamique autonome</h3>
              <ul>
                {worldSignals.length > 0 ? (
                  worldSignals.map((signal) => <li key={signal}>{signal}</li>)
                ) : (
                  <li>Le monde ne signale pas de mouvement autonome majeur.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Relations inter-blocs</h3>
              <ul>
                {relationChanges.length > 0 ? (
                  relationChanges.map((change) => <li key={change}>{change}</li>)
                ) : (
                  <li>Aucune relation suivie ne change fortement.</li>
                )}
              </ul>
            </div>
            <div>
              <h3>Hausse de tension</h3>
              <p>{report.relationTensionIncrease ?? "Aucune hausse relationnelle dominante."}</p>
            </div>
            <div>
              <h3>Apaisement</h3>
              <p>{report.relationTensionDecrease ?? "Aucun apaisement relationnel dominant."}</p>
            </div>
            <div>
              <h3>Bloc le plus affecté</h3>
              <p>{report.mostAffectedBlock}</p>
            </div>
            <div>
              <h3>Tension principale</h3>
              <p>{report.mainTension}</p>
            </div>
            <div>
              <h3>Événement</h3>
              <p>{report.systemicEventTitle ?? "Aucun événement systémique déclenché."}</p>
            </div>
            <div>
              <h3>Signaux faibles</h3>
              <ul>
                {weakSignals.length > 0 ? (
                  weakSignals.map((signal) => <li key={signal}>{signal}</li>)
                ) : (
                  <li>Aucun signal faible prioritaire.</li>
                )}
              </ul>
            </div>
          </div>
          {report.suspicionNote && <p className="report-suspicion">{report.suspicionNote}</p>}
        </>
      )}
    </section>
  );
}
