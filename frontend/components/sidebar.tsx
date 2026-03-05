"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { trainModel } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "⬡", label: "Dashboard", accent: "#6c63ff" },
  { href: "/insights", icon: "◈", label: "Insights", accent: "#00d4aa" },
  { href: "/agents", icon: "◉", label: "Agents", accent: "#ff4d4d" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const {
    phase, columns, targetColumn, trainProgress,
    setTargetColumn, setPhase, setReport, setTrainError, addProgress, clearProgress,
  } = useApp();

  const isTraining = phase === "training";
  const isTrained = phase === "trained";
  const canTrain = columns.length > 0 && !isTraining;

  // ── Poll /ml/progress during training ──────────────────────────────────────
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTraining) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/ml/progress");
          if (!res.ok) return;
          const data: { messages: string[]; done: boolean; error: string | null } =
            await res.json();
          if (data.messages?.length) {
            // Replace progress state with the latest snapshot from the server 
            clearProgress();
            data.messages.forEach(addProgress);
          }
        } catch {
          /* network glitch — ignore */
        }
      }, 1000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [isTraining]);

  // ── Train handler ───────────────────────────────────────────────────────────
  const handleTrain = async () => {
    if (!canTrain) return;
    setPhase("training");
    setTrainError(null);
    clearProgress();
    try {
      const report = await trainModel(targetColumn);
      setReport(report);
    } catch (err) {
      // Strip the HTTP status prefix to show a cleaner message
      const raw = err instanceof Error ? err.message : "Training failed";
      const clean = raw.replace(/^Training failed \(\d+\):\s*/, "");
      setTrainError(clean);
      setPhase("uploaded");
    }
  };

  return (
    <aside
      className="w-[240px] shrink-0 flex flex-col sticky top-0 h-screen z-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.98) 0%, rgba(8,8,16,0.99) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#6c63ff]/15 blur-[60px] pointer-events-none" />

      <div className="flex flex-col h-full px-5 py-7 relative z-10">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-9 h-9 rounded-[11px] grid place-items-center text-base shadow-[0_0_20px_rgba(108,99,255,0.5)] shrink-0"
            style={{ background: "linear-gradient(135deg, #6c63ff, #8b5cf6)" }}
          >
            ⚡
          </div>
          <div>
            <span
              className="text-[16px] font-extrabold tracking-tight text-white leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Auto<span className="text-[#6c63ff]">Intel</span>
            </span>
            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500 font-medium mt-[2px]">
              ML Platform
            </p>
          </div>
        </div>

        {/* ── Nav section label ── */}
        <p
          className="text-[9.5px] font-bold uppercase tracking-[0.2em] mb-2 px-1"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
        >
          Navigation
        </p>

        {/* ── Nav items ── */}
        <nav className="flex flex-col gap-[3px] mb-8">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-[13.5px] font-medium transition-all duration-250 relative overflow-hidden"
                style={{
                  background: active ? `${item.accent}18` : "transparent",
                  color: active ? item.accent : "rgba(255,255,255,0.45)",
                  border: active ? `1px solid ${item.accent}30` : "1px solid transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }}
                  />
                )}
                <span
                  className="w-7 h-7 rounded-[8px] grid place-items-center text-[14px] shrink-0 transition-all duration-250"
                  style={{
                    background: active ? `${item.accent}22` : "rgba(255,255,255,0.04)",
                    color: active ? item.accent : "rgba(255,255,255,0.3)",
                  }}
                >
                  {item.icon}
                </span>
                <span className="transition-colors duration-250 group-hover:text-white">
                  {item.label}
                </span>
                {!active && (
                  <span
                    className="absolute inset-0 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Status chip ── */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] mb-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="relative flex h-[7px] w-[7px] shrink-0">
            {isTraining ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-amber-400" />
              </>
            ) : isTrained ? (
              <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#00d4aa] shadow-[0_0_6px_#00d4aa]" />
            ) : columns.length > 0 ? (
              <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-blue-400" />
            ) : (
              <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-gray-600" />
            )}
          </span>
          <span
            className="text-[11px] font-medium truncate"
            style={{
              color: isTraining
                ? "#F59E0B"
                : isTrained
                  ? "#00d4aa"
                  : columns.length > 0
                    ? "#60a5fa"
                    : "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {isTraining
              ? "Training…"
              : isTrained
                ? "Model Ready"
                : columns.length > 0
                  ? "Dataset Loaded"
                  : "Awaiting Data"}
          </span>
        </div>

        {/* ── Live training progress ── */}
        {isTraining && trainProgress.length > 0 && (
          <div
            className="mb-3 px-3 py-2 rounded-[10px] flex flex-col gap-[3px]"
            style={{
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
          >
            {trainProgress.map((msg, i) => (
              <p
                key={i}
                className="text-[10.5px] leading-snug"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: msg.startsWith("✅")
                    ? "#00d4aa"
                    : msg.startsWith("⚠")
                      ? "#f87171"
                      : "rgba(255,255,255,0.55)",
                }}
              >
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* ── Model config ── */}
        <div className="mt-auto">
          {columns.length > 0 ? (
            <>
              {/* Label */}
              <p
                className="text-[9.5px] font-bold uppercase tracking-[0.2em] mb-3 px-1"
                style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
              >
                // target column
              </p>

              {/* Select */}
              <div className="relative mb-3">
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  disabled={isTraining}
                  className="w-full appearance-none px-3 pr-8 py-[10px] rounded-[10px] text-[12.5px] outline-none cursor-pointer transition-all duration-200 focus:ring-1"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "var(--font-dm)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {columns.map((col) => (
                    <option key={col} value={col} style={{ background: "#111" }}>
                      {col}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                  ▾
                </span>
              </div>

              {/* Train button */}
              <button
                onClick={handleTrain}
                disabled={!canTrain}
                className="w-full py-[11px] rounded-[11px] text-[13px] font-bold tracking-[0.4px] transition-all duration-300 hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 relative overflow-hidden group"
                style={{
                  background: isTraining
                    ? "linear-gradient(135deg, #78716c, #57534e)"
                    : "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                  color: "#fff",
                  fontFamily: "var(--font-syne)",
                  boxShadow: isTraining
                    ? "none"
                    : "0 4px 24px rgba(108,99,255,0.4), 0 1px 0 rgba(255,255,255,0.1) inset",
                }}
              >
                {!isTraining && (
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                )}
                {isTraining ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                    Training…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>▶</span> Train Model
                  </span>
                )}
              </button>
            </>
          ) : (
            <div
              className="p-4 rounded-[12px] text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-2xl mb-2 opacity-30">📂</div>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}
              >
                Upload a dataset to configure the model
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 flex items-center gap-2 px-1">
          <div className="text-[9.5px] uppercase tracking-[0.15em] text-gray-700 font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            AutoIntel v1.0
          </div>
        </div>

      </div>
    </aside>
  );
}
