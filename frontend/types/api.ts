// ── POST /ml/upload → { rows, columns } ──────────────────────────────────────
export interface UploadResponse {
  rows:    number;
  columns: string[];
}

// ── POST /ml/train → full report ─────────────────────────────────────────────
// model_comparison: { "LinearRegression": { "R2": 0.99 }, "Ridge": { ... } }
export type ModelComparison = Record<string, Record<string, number>>;

export interface FeatureImportance {
  feature:    string;
  importance: number;
}

export interface Insights {
  model_summary:          string;
  performance_assessment: string;
  feature_impact_summary: string;
  recommendation:         string;
}

export interface TrainResponse {
  best_model:         string;
  best_score:         number;
  problem_type:       string;
  primary_metric:     string;
  model_comparison:   ModelComparison;
  feature_importance: FeatureImportance[];
  insights:           Insights;
}

// ── POST /rag/query → { answer } ─────────────────────────────────────────────
export interface RagResponse {
  answer: string;
}

// ── App-level phase ───────────────────────────────────────────────────────────
export type AppPhase = "empty" | "uploaded" | "training" | "trained" | "error";
