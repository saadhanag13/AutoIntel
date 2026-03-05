export default function InsightsPage() {
  return (
    <main className="flex-1 px-6 sm:px-8 py-16 relative z-10 flex flex-col items-center">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-[#00d4aa]/10 blur-[120px] -z-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16 relative animate-fade-in-up">

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#00d4aa] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(0,212,170,0.15)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4aa]"></span>
          </span>
          Intelligence Active
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-[#00d4aa] drop-shadow-sm leading-tight"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          AI Insights<br />Engine
        </h1>

        <p className="text-lg leading-relaxed text-gray-400 font-light max-w-2xl mx-auto">
          Elevate your data from raw metrics to strategic mastery. Our Insights Engine acts as the supreme analytical brain—meticulously dissecting model outputs, unraveling performance layers, and delivering high-caliber tactical narratives natively.
        </p>
      </div>

      {/* TWO COLUMN CAPABILITIES */}
      <section className="w-full max-w-5xl grid md:grid-cols-2 gap-8 mb-16">
        <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[28px] border border-white/5 hover:border-[#00d4aa]/40 transition-all duration-500 shadow-2xl overflow-hidden hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center mb-8 border border-[#00d4aa]/20 text-3xl shadow-[0_0_15px_rgba(0,212,170,0.1)]">
            📊
          </div>
          <h3 className="text-2xl font-bold mb-5 text-white" style={{ fontFamily: "var(--font-syne)" }}>Performance Assessment</h3>
          <ul className="space-y-4 text-[14.5px] text-gray-400">
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Unerring selection of the globally optimal model</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Ruthless metric evaluation (Accuracy, F1, RMSE, AUC)</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Deep-dive capability into overfitting and generalization</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Intelligent algorithmic cross-comparison</span>
            </li>
          </ul>
        </div>

        <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[28px] border border-white/5 hover:border-[#00d4aa]/40 transition-all duration-500 shadow-2xl overflow-hidden hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center mb-8 border border-[#00d4aa]/20 text-3xl shadow-[0_0_15px_rgba(0,212,170,0.1)]">
            🔍
          </div>
          <h3 className="text-2xl font-bold mb-5 text-white" style={{ fontFamily: "var(--font-syne)" }}>Feature Intelligence</h3>
          <ul className="space-y-4 text-[14.5px] text-gray-400">
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Absolute ranking of variable predictive dominance</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Direct translation of technical coefficients to business impact</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Subtle driver-variable relationship interpretation</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#00d4aa] mt-1 text-[10px]">◆</span>
              <span>Granular detection of algorithmic risk and hidden bias</span>
            </li>
          </ul>
        </div>
      </section>

      {/* BUSINESS LAYER PANEL */}
      <section className="w-full max-w-5xl relative bg-gradient-to-br from-[#0c1a17] to-[#0a0a0a] p-10 sm:p-14 rounded-[32px] border border-[#00d4aa]/10 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,212,170,0.15)] mb-16 flex flex-col items-center text-center hover:border-[#00d4aa]/30 transition-all duration-700">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00d4aa]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#6c63ff]/10 rounded-full blur-[100px]" />

        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-8 border border-white/10 text-4xl shadow-2xl z-10 backdrop-blur-md">
          💡
        </div>
        <h3 className="text-3xl font-extrabold mb-6 z-10 text-white tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
          The Executive Translation Layer
        </h3>
        <p className="text-base text-gray-400 leading-relaxed max-w-3xl z-10 font-light">
          Transcend the jargon. Our AI synthesizes complex mathematical outputs—matrices, logits, and tree densities—into brilliantly structured executive summaries. Driven by LLM contextual reasoning, we ensure every prediction and statistical anomaly is immediately actionable by stakeholders, product owners, and the C-suite.
        </p>
      </section>

      {/* ROADMAP PILLS */}
      <section className="w-full max-w-5xl flex flex-col items-center">
        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">⚙️ The Autonomic Pipeline</h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            "1. Tensor Ingestion",
            "2. Feature Architecting",
            "3. Neural Convergence",
            "4. Parametric Extraction",
            "5. Strategic Synthesis"
          ].map((item, i) => (
            <div key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[13.5px] font-medium text-gray-300 shadow-sm backdrop-blur-md hover:bg-white/10 hover:border-[#00d4aa]/30 hover:text-white transition-all cursor-default hover:-translate-y-[2px]">
              {item}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}