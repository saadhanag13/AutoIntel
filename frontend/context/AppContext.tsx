"use client";

import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from "react";
import type { TrainResponse, AppPhase } from "../types/api";

// Common names for target / label columns — used for smart default selection
const TARGET_HINTS = [
  "target", "label", "class", "output", "y",
  "is_fraud", "is_churn", "is_default", "is_spam",
  "churn", "fraud", "default", "spam",
  "price", "salary", "revenue", "sales", "cost",
  "survived", "outcome", "result", "diagnosis",
];

function pickSmartTarget(cols: string[]): string {
  if (cols.length === 0) return "";

  // 1. Exact match (case-insensitive) against common names
  const lower = cols.map((c) => c.toLowerCase());
  for (const hint of TARGET_HINTS) {
    const idx = lower.indexOf(hint);
    if (idx !== -1) return cols[idx];
  }

  // 2. Column starts with is_ / has_
  const prefixed = cols.find((c) =>
    c.toLowerCase().startsWith("is_") || c.toLowerCase().startsWith("has_")
  );
  if (prefixed) return prefixed;

  // 3. Fall back to the last column (conventional CSV layout)
  return cols[cols.length - 1];
}

interface AppState {
  phase: AppPhase;
  columns: string[];
  targetColumn: string;
  fileName: string;
  rowCount: number;
  report: TrainResponse | null;
  trainError: string | null;
  trainProgress: string[];       // per-model progress messages
  // actions
  setColumns: (cols: string[], fileName: string, rows: number) => void;
  setTargetColumn: (col: string) => void;
  setReport: (r: TrainResponse) => void;
  setPhase: (p: AppPhase) => void;
  setTrainError: (e: string | null) => void;
  addProgress: (msg: string) => void;
  clearProgress: () => void;
  reset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AppPhase>("empty");
  const [columns, setColumnsState] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(0);
  const [report, setReportState] = useState<TrainResponse | null>(null);
  const [trainError, setTrainError] = useState<string | null>(null);
  const [trainProgress, setTrainProgress] = useState<string[]>([]);

  const setColumns = useCallback(
    (cols: string[], name: string, rows: number) => {
      setColumnsState(cols);
      setTargetColumn(pickSmartTarget(cols));   // ← smart auto-select
      setFileName(name);
      setRowCount(rows);
      setReportState(null);     // clear old report when a new file is uploaded
      setTrainError(null);
      setTrainProgress([]);
      setPhase("uploaded");
    },
    []
  );

  const setReport = useCallback((r: TrainResponse) => {
    setReportState(r);
    setPhase("trained");
    setTrainError(null);
    setTrainProgress([]);
  }, []);

  const addProgress = useCallback((msg: string) => {
    setTrainProgress((prev) => [...prev, msg]);
  }, []);

  const clearProgress = useCallback(() => {
    setTrainProgress([]);
  }, []);

  const reset = useCallback(() => {
    setPhase("empty");
    setColumnsState([]);
    setTargetColumn("");
    setFileName("");
    setRowCount(0);
    setReportState(null);
    setTrainError(null);
    setTrainProgress([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        phase, columns, targetColumn, fileName, rowCount,
        report, trainError, trainProgress,
        setColumns, setTargetColumn, setReport,
        setPhase, setTrainError, addProgress, clearProgress, reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
