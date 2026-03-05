import type { TrainResponse } from "@/types/api";

interface KPICardsProps {
  report: TrainResponse;
}

export default function KPICards({ report }: KPICardsProps) {
  const cards = [
    {
      label: "Best Model",
      value: report.best_model,
      sub:   "selected by AutoML",
      icon:  "🏆",
      color: "var(--color-accent1)",
      bar:   "linear-gradient(90deg, var(--color-accent1), transparent)",
    },
    {
      label: "Score",
      value: report.best_score.toFixed(4),
      sub:   `${report.primary_metric} on test split`,
      icon:  "📈",
      color: "var(--color-accent2)",
      bar:   "linear-gradient(90deg, var(--color-accent2), transparent)",
    },
    {
      label: "Problem Type",
      value: report.problem_type.charAt(0).toUpperCase() + report.problem_type.slice(1),
      sub:   "auto-detected",
      icon:  "🧩",
      color: "var(--color-amber)",
      bar:   "linear-gradient(90deg, var(--color-amber), transparent)",
    },
    {
      label: "Primary Metric",
      value: report.primary_metric,
      sub:   "optimisation target",
      icon:  "🎯",
      color: "var(--color-accent3)",
      bar:   "linear-gradient(90deg, var(--color-accent3), transparent)",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-7">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="rounded-[16px] p-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-[2px] animate-fade-up"
          style={{
            background:      "var(--color-card)",
            border:          "1px solid var(--color-border)",
            animationDelay:  `${i * 80}ms`,
            opacity:         0,
          }}
        >
          {/* Bottom accent stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: card.bar }} />
          {/* Watermark icon */}
          <span className="absolute top-4 right-4 text-2xl opacity-20">{card.icon}</span>
          <p className="text-[11px] font-medium uppercase tracking-[0.8px] mb-[10px]"
            style={{ color: "var(--color-muted)" }}>
            {card.label}
          </p>
          <p className="text-[20px] font-bold leading-tight"
            style={{ color: card.color, fontFamily: "var(--font-syne)" }}>
            {card.value}
          </p>
          <p className="text-[11.5px] mt-[6px]"
            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
