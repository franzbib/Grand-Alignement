import type { EvolutionReport } from "../types/game";

type EvolutionReportPanelProps = {
  report: EvolutionReport | null;
};

export function EvolutionReportPanel({ report }: EvolutionReportPanelProps) {
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
          <div className="report-grid">
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
          </div>
          <p className="report-suspicion">{report.suspicionNote}</p>
        </>
      )}
    </section>
  );
}
