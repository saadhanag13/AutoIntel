"use client";

import type { TrainResponse } from "@/types/api";

interface ChartsProps {
  report: TrainResponse;
}

export default function Charts({ report }: ChartsProps) {
  // ── Model Comparison ─────────────────────────────────────────────────────
const metric = report.primary_metric;

  const modelRows = Object.entries(report.model_comparison)
    .map(([name, scores]) => ({
      name,
      score: scores[metric] ?? Object.values(scores)[0] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  const bestScore  = modelRows[0]?.score ?? 1;
  const bestModel  = report.best_model;

  // ── Feature Importance ───────────────────────────────────────────────────
  const features  = (report.feature_importance ?? []).slice(0, 12);
  const maxFi     = features[0]?.importance ?? 1;

  return (
    <div className="grid grid-cols-2 gap-5 mb-7">

      {/* ── Model Comparison ── */}
      <div className="rounded-[18px] p-[22px]"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-[15px] font-bold mb-5" style={{ fontFamily: "var(--font-syne)" }}>
          Model Comparison{" "}
          <span className="text-[11px] font-normal" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            {metric} score
          </span>
        </h3>

        {modelRows.length === 0 ? (
          <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No model comparison data.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {modelRows.map((m) => {
              const pct    = (m.score / bestScore) * 100;
              const isBest = m.name === bestModel;
              return (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="text-[12px] shrink-0" style={{ width: "160px", fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-txt)" }}>{m.name}</span>
                    {isBest && (
                      <span className="ml-2 text-[9px] font-semibold px-[7px] py-[1px] rounded-full border"
                        style={{ background: "rgba(0,212,170,0.12)", borderColor: "rgba(0,212,170,0.28)", color: "var(--color-accent2)" }}>
                        BEST
                      </span>
                    )}
                  </div>
                  <div className="flex-1 h-[10px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full animate-bar"
                      style={{
                        width:      `${pct}%`,
                        background: isBest
                          ? "linear-gradient(90deg, var(--color-accent1), var(--color-accent2))"
                          : "rgba(108,99,255,0.38)",
                        boxShadow:  isBest ? "0 0 10px rgba(108,99,255,0.35)" : "none",
                      }}
                    />
                  </div>
                  <span className="text-[11px]" style={{ width: "52px", textAlign: "right", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                    {m.score.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Feature Importance ── */}
      <div className="rounded-[18px] p-[22px]"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-[15px] font-bold mb-5" style={{ fontFamily: "var(--font-syne)" }}>
          Feature Importance{" "}
          <span className="text-[11px] font-normal" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            weight
          </span>
        </h3>

        {features.length === 0 ? (
          <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
            Feature importance not available for this model.
          </p>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {features.map((f, i) => {
              const pct = (f.importance / maxFi) * 100;
              return (
                <div key={f.feature} className="flex items-center gap-[10px]">
                  <div className="text-[12px] shrink-0 text-right" style={{ width: "140px", fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                    {f.feature}
                  </div>
                  <div className="flex-1 h-[8px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full animate-bar"
                      style={{
                        width:      `${pct}%`,
                        background: i === 0
                          ? "linear-gradient(90deg, var(--color-accent2), #00f5c4)"
                          : i === 1
                          ? "linear-gradient(90deg, var(--color-accent1), #a78bfa)"
                          : "rgba(108,99,255,0.38)",
                      }}
                    />
                  </div>
                  <span className="text-[11px]" style={{ width: "48px", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                    {f.importance.toFixed(3)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
