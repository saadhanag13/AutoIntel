export default function AgentsPage() {
  return (
    <main className="flex-1 px-6 sm:px-8 py-16 relative z-10 flex flex-col items-center">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-[#ff4d4d]/10 blur-[120px] -z-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16 relative animate-fade-in-up">

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#ff4d4d] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(255,77,77,0.15)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4d4d]"></span>
          </span>
          System Orchestration Active
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-[#ff4d4d] drop-shadow-sm leading-tight"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Autonomous<br />AI Agents
        </h1>

        <p className="text-lg leading-relaxed text-gray-400 font-light max-w-2xl mx-auto">
          Experience the pinnacle of automation. Our modular multi-agent architecture operates tirelessly to conquer complex workflows, proactively neutralize model drift, and orchestrate zero-touch retraining cycles.
        </p>
      </div>

      {/* TWO COLUMN CAPABILITIES */}
      <section className="w-full max-w-5xl grid md:grid-cols-2 gap-8 mb-16">
        <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[28px] border border-white/5 hover:border-[#ff4d4d]/40 transition-all duration-500 shadow-2xl overflow-hidden hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-[#ff4d4d]/10 flex items-center justify-center mb-8 border border-[#ff4d4d]/20 text-3xl shadow-[0_0_15px_rgba(255,77,77,0.1)]">
            🤖
          </div>
          <h3 className="text-2xl font-bold mb-5 text-white" style={{ fontFamily: "var(--font-syne)" }}>Why Agents?</h3>
          <ul className="space-y-4 text-[14.5px] text-gray-400">
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span>Annihilate repetitive analytical bottlenecks instantly</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span>Autonomously govern end-to-end model lifecycles</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span>Detect and instantly repair microscopic model drift</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span>Relentless 24/7 telemetry and performance surveillance</span>
            </li>
          </ul>
        </div>

        <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[28px] border border-white/5 hover:border-[#ff4d4d]/40 transition-all duration-500 shadow-2xl overflow-hidden hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-[#ff4d4d]/10 flex items-center justify-center mb-8 border border-[#ff4d4d]/20 text-3xl shadow-[0_0_15px_rgba(255,77,77,0.1)]">
            🧠
          </div>
          <h3 className="text-2xl font-bold mb-5 text-white" style={{ fontFamily: "var(--font-syne)" }}>Agent Hierarchy</h3>
          <ul className="space-y-4 text-[14.5px] text-gray-400">
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span><strong className="text-gray-200 font-semibold">Sanitization Agent:</strong> Deep data cleaning & enrichment</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span><strong className="text-gray-200 font-semibold">Architect Agent:</strong> Dynamic feature engineering</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span><strong className="text-gray-200 font-semibold">Training Agent:</strong> Hyper-optimized model generation</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span><strong className="text-gray-200 font-semibold">Insight Agent:</strong> Granular analytical breakdown</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#ff4d4d] mt-1 text-[10px]">◆</span>
              <span><strong className="text-gray-200 font-semibold">Oracle Agent:</strong> RAG-driven contextual intelligence</span>
            </li>
          </ul>
        </div>
      </section>

      {/* MASTER ORCHESTRATION PANEL */}
      <section className="w-full max-w-5xl relative bg-gradient-to-br from-[#12121c] to-[#0a0a0a] p-10 sm:p-14 rounded-[32px] border border-[#ff4d4d]/10 overflow-hidden shadow-[0_20px_60px_-15px_rgba(255,77,77,0.15)] mb-16 flex flex-col items-center text-center hover:border-[#ff4d4d]/30 transition-all duration-700">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ff4d4d]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-8 border border-white/10 text-4xl shadow-2xl z-10 backdrop-blur-md">
          🚀
        </div>
        <h3 className="text-3xl font-extrabold mb-6 z-10 text-white tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
          Enterprise-Grade Orchestration
        </h3>
        <p className="text-base text-gray-400 leading-relaxed max-w-3xl z-10 font-light">
          Our agents do not operate in isolation. They are governed by an omniscient master orchestrator that seamlessly synchronizes task execution, rigorously resolves complex dependencies, and guarantees absolute reproducibility. This forms the indestructible backbone for deploying massive, high-velocity AI operations natively in production.
        </p>
      </section>

      {/* ROADMAP PILLS */}
      <section className="w-full max-w-5xl flex flex-col items-center">
        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">🔮 Unlocking Future Capabilities</h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            "Autonomous Re-training Triggers",
            "Scheduled Intelligence Reports",
            "Zero-Day Anomaly Detection",
            "Multi-Variant Neural Synergy"
          ].map((item, i) => (
            <div key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[13.5px] font-medium text-gray-300 shadow-sm backdrop-blur-md hover:bg-white/10 hover:border-[#ff4d4d]/30 hover:text-white transition-all cursor-default hover:-translate-y-[2px]">
              {item}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}