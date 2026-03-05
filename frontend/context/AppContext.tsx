"use client";

import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from "react";
import type { TrainResponse, AppPhase } from "../types/api";

interface AppState {
  phase:         AppPhase;
  columns:       string[];           // from /ml/upload
  targetColumn:  string;
  fileName:      string;
  rowCount:      number;
  report:        TrainResponse | null; // from /ml/train
  trainError:    string | null;
  // actions
  setColumns:       (cols: string[], fileName: string, rows: number) => void;
  setTargetColumn:  (col: string) => void;
  setReport:        (r: TrainResponse) => void;
  setPhase:         (p: AppPhase) => void;
  setTrainError:    (e: string | null) => void;
  reset:            () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [phase,        setPhase]        = useState<AppPhase>("empty");
  const [columns,      setColumnsState] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [fileName,     setFileName]     = useState<string>("");
  const [rowCount,     setRowCount]     = useState<number>(0);
  const [report,       setReportState]  = useState<TrainResponse | null>(null);
  const [trainError,   setTrainError]   = useState<string | null>(null);

  const setColumns = useCallback(
    (cols: string[], name: string, rows: number) => {
      setColumnsState(cols);
      setTargetColumn(cols[0] ?? "");
      setFileName(name);
      setRowCount(rows);
      setReportState(null);
      setTrainError(null);
      setPhase("uploaded");
    },
    []
  );

  const setReport = useCallback((r: TrainResponse) => {
    setReportState(r);
    setPhase("trained");
    setTrainError(null);
  }, []);

  const reset = useCallback(() => {
    setPhase("empty");
    setColumnsState([]);
    setTargetColumn("");
    setFileName("");
    setRowCount(0);
    setReportState(null);
    setTrainError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        phase, columns, targetColumn, fileName, rowCount,
        report, trainError,
        setColumns, setTargetColumn, setReport,
        setPhase, setTrainError, reset,
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
