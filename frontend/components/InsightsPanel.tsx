import type { Insights } from "@/types/api";

interface InsightsPanelProps {
  insights: Insights;
}

const BLOCKS = [
  { key: "model_summary"          as const, icon: "◈", title: "Model Summary"          },
  { key: "feature_impact_summary" as const, icon: "◉", title: "Feature Impact"          },
  { key: "performance_assessment" as const, icon: "◎", title: "Performance Assessment"  },
  { key: "recommendation"         as const, icon: "◇", title: "Recommendation"          },
];

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div
      className="rounded-[18px] p-[26px] mb-7 relative overflow-hidden"
      style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
    >
      {/* Top gradient rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, var(--color-accent2), var(--color-accent1), transparent)" }}
      />

      {Object.values(insights).every((v) => !v) ? (
        <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
          No AI insights available — check that HF_TOKEN is set in your .env file.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {BLOCKS.map((block, i) => (
            <div
              key={block.key}
              className="rounded-[12px] p-[18px] animate-fade-up"
              style={{
                background:     "rgba(255,255,255,0.03)",
                border:         "1px solid var(--color-border)",
                animationDelay: `${i * 80}ms`,
                opacity:        0,
              }}
            >
              <h4 className="text-[13px] font-bold mb-[10px] flex items-center gap-2"
                style={{ color: "var(--color-accent2)", fontFamily: "var(--font-syne)" }}>
                <span className="text-[15px]">{block.icon}</span>
                {block.title}
              </h4>
              <p className="text-[13px] leading-[1.75]"
                style={{ color: "rgba(232,234,240,0.75)" }}>
                {insights[block.key] || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
