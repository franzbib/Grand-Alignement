import type { GlobalStats } from "../types/game";
import { StatGauge } from "./StatGauge";

type GlobalPanelProps = {
  stats: GlobalStats;
  turn: number;
};

export function GlobalPanel({ stats, turn }: GlobalPanelProps) {
  return (
    <section className="panel global-panel" aria-labelledby="global-title">
      <div>
        <p className="eyebrow">Tour {turn}</p>
        <h2 id="global-title">État global</h2>
      </div>
      <div className="gauge-grid">
        <StatGauge label="Cohésion mondiale" value={stats.cohesionMondiale} />
        <StatGauge label="Risque d'escalade" value={stats.risqueEscalade} tone="danger" />
        <StatGauge label="Autonomie humaine" value={stats.autonomieHumaine} />
        <StatGauge label="Stress climatique" value={stats.stressClimatique} tone="warning" />
        <StatGauge label="Puissance IA" value={stats.puissanceIA} tone="warning" />
        <StatGauge label="Soupçon IA" value={stats.soupconIA} tone="danger" />
      </div>
    </section>
  );
}
