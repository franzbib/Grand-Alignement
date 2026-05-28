type StatGaugeProps = {
  label: string;
  value: number;
  tone?: "calm" | "warning" | "danger";
};

export function StatGauge({ label, value, tone = "calm" }: StatGaugeProps) {
  return (
    <div className="stat-gauge">
      <div className="stat-gauge__header">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="stat-gauge__track">
        <div className={`stat-gauge__fill stat-gauge__fill--${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
