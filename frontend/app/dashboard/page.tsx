"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import SectionLabel from "@/components/SectionLabel";
import UploadPanel from "@/components/uploadPanel";
import KPICards from "@/components/KPIcard";
import Charts from "@/components/Modelcompchart";
import InsightsPanel from "@/components/InsightsPanel";
import ChatPanel from "@/components/chatpanel";

export default function DashboardPage() {
  const { phase, fileName, report, trainError, trainProgress } = useApp();

  const isTrained = phase === "trained";
  const isTraining = phase === "training";
  const isUploaded = phase === "uploaded";

  // When training completes, scroll the content pane back to the top so the
  // user lands on "Global Architecture Results" (step 02) rather than wherever
  // the browser left off during the training spinner.
  // scrollIntoView is unreliable here because the scrollable ancestor is the
  // #main-scroll div (overflow-y-auto), not window — so we target it directly.
  // requestAnimationFrame defers until after the browser has painted the new
  // results block; without it the scroll fires before layout is done.
  useEffect(() => {
    if (isTrained && report) {
      requestAnimationFrame(() => {
        document.getElementById("main-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }, [isTrained, report]);

  return (
    <main className="flex-1 px-6 sm:px-8 py-16 relative z-10 flex flex-col items-center w-full">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-[#6c63ff]/10 blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-6xl flex flex-col items-center">

        {/* ── Page header ── */}
        <div className="text-center mb-16 relative animate-fade-in-up flex flex-col items-center">

          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-md">
            {isTrained ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4aa]"></span>
                </span>
                <span className="text-[#00d4aa]">Model Ready</span>
              </>
            ) : isTraining ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-500">Neural Convergence Active</span>
              </>
            ) : isUploaded ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                </span>
                <span className="text-blue-400">Dataset Loaded</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                </span>
                <span>System Idle</span>
              </>
            )}
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-[#6c63ff] drop-shadow-sm leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Omniscient<br />Intelligence Hub
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl font-light">
            AutoML Pipeline Architecture · <strong className="text-gray-300 font-medium">{isTrained || isUploaded ? fileName : "Awaiting Data Ingestion"}</strong>
          </p>
        </div>

        <div className="w-full space-y-12">
          {/* ── 01 Upload ── */}
          <section className="w-full">
            <div className="mb-4">
              <SectionLabel step="01" label="Tensor Ingestion" />
            </div>
            <UploadPanel />
          </section>

          {/* ── Training spinner overlay ── */}
          {isTraining && (
            <div className="w-full relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 rounded-[28px] border border-amber-500/30 text-center shadow-[0_0_40px_rgba(245,158,11,0.1)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <div className="text-5xl mb-5 text-amber-500" style={{ animation: "spin 2s linear infinite", display: "inline-block" }}>⚙</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
                Synthesizing Neural Pathways…
              </h3>
              <p className="text-[15px] text-gray-400 font-light max-w-md mx-auto mb-5">
                AutoML is evaluating model architectures. This may take 30–60 seconds.
              </p>
              {/* Live per-model progress */}
              {trainProgress.length > 0 && (
                <div className="mt-4 text-left max-w-xs mx-auto space-y-1">
                  {trainProgress.map((msg, i) => (
                    <p
                      key={i}
                      className="text-[11px] font-mono"
                      style={{
                        color: msg.startsWith("✅")
                          ? "#00d4aa"
                          : msg.startsWith("⚠")
                            ? "#f87171"
                            : "rgba(245,158,11,0.85)",
                      }}
                    >
                      {msg}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Training error ── */}
          {trainError && (
            <div className="w-full bg-[#ff4d4d]/10 backdrop-blur-xl p-8 rounded-[24px] border border-[#ff4d4d]/30 flex items-start gap-6 shadow-[0_0_30px_rgba(255,77,77,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#ff4d4d]/20 flex items-center justify-center text-2xl text-[#ff4d4d] border border-[#ff4d4d]/30 shrink-0">
                ✕
              </div>
              <div className="flex-1 mt-1">
                <h3 className="text-xl font-bold mb-2 text-[#ff4d4d] tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>Training Failed</h3>
                <p className="text-[13px] text-gray-300 bg-black/20 p-4 rounded-xl border border-[#ff4d4d]/10 font-mono">
                  {trainError}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  You can adjust the target column and try again.
                </p>
              </div>
            </div>
          )}

          {/* ── Ready-to-train nudge ── */}
          {isUploaded && !isTraining && (
            <div className="w-full bg-gradient-to-br from-[#12121c] to-[#0a0a0a] backdrop-blur-2xl p-12 rounded-[28px] border border-[#6c63ff]/20 text-center shadow-[0_20px_60px_-15px_rgba(108,99,255,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#6c63ff] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500 text-blue-400">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
                Data Matrices Primed
              </h3>
              <p className="text-[15px] text-gray-400 font-light max-w-lg mx-auto">
                Target variable resolution required. Select your optimization target in the left command center and initialize <strong className="text-[#6c63ff] font-semibold">Train Model</strong> to ignite the AutoML core.
              </p>
            </div>
          )}

          {/* ── Empty state ── */}
          {phase === "empty" && (
            <div className="w-full bg-[#0a0a0a]/50 backdrop-blur-xl p-12 rounded-[28px] border border-dashed border-gray-700/60 text-center">
              <div className="text-4xl mb-5 opacity-20">📁</div>
              <p className="text-[15px] text-gray-500 font-light">
                Awaiting flat-file ingestion. Upload a valid CSV above to commence operations.
              </p>
            </div>
          )}

          {/* ── Full results — only when trained ── */}
          {isTrained && report && (
            <div className="space-y-16 animate-fade-in-up">

              <section className="w-full">
                <div className="mb-6 flex justify-center">
                  <SectionLabel step="02" label="Global Architecture Results" />
                </div>
                <KPICards report={report} />
              </section>

              <section className="w-full">
                <div className="mb-6 flex justify-center">
                  <SectionLabel step="03" label="Performance Telemetry" />
                </div>
                <div className="bg-[#0a0a0a] rounded-[24px] border border-white/5 p-2 shadow-2xl">
                  <Charts report={report} />
                </div>
              </section>

              <section className="w-full">
                <div className="mb-6 flex justify-center">
                  <SectionLabel step="04" label="Strategic Analytics Translation" />
                </div>
                <InsightsPanel insights={report.insights} />
              </section>

              <section className="w-full pb-10">
                <div className="mb-6 flex justify-center">
                  <SectionLabel step="05" label="Chat Interface" />
                </div>
                <div className="w-full max-w-4xl mx-auto shadow-2xl">
                  <ChatPanel fileName={fileName} />
                </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}

