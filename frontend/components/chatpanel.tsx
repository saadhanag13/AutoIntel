"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ragQuery } from "@/lib/api";

interface Message {
  role: "ai" | "user";
  text: string;
}

interface ChatPanelProps {
  fileName: string;
}

// ── Lightweight markdown → HTML renderer ─────────────────────────────────────
// Handles: **bold**, *italic*, `code`, numbered lists, bullet lists, headings
function renderMarkdown(text: string): string {
  if (typeof text !== "string") {
    try {
      text = JSON.stringify(text, null, 2);
    } catch {
      text = String(text);
    }
  }

  const lines = text.split("\n");
  const out: string[] = [];
  let inList: "ol" | "ul" | null = null;

  const closeList = () => {
    if (inList === "ol") { out.push("</ol>"); inList = null; }
    else if (inList === "ul") { out.push("</ul>"); inList = null; }
  };

  const inlineFormat = (str: string) =>
    str
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Blank line
    if (!line.trim()) { closeList(); out.push("<br/>"); continue; }

    // Headings
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h3) { closeList(); out.push(`<h3>${inlineFormat(h3[1])}</h3>`); continue; }
    if (h2) { closeList(); out.push(`<h2>${inlineFormat(h2[1])}</h2>`); continue; }
    if (h1) { closeList(); out.push(`<h1>${inlineFormat(h1[1])}</h1>`); continue; }

    // Numbered list  "1. item"
    const olMatch = line.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (inList !== "ol") { closeList(); out.push("<ol>"); inList = "ol"; }
      out.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // Bullet list  "- item" or "* item"
    const ulMatch = line.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      if (inList !== "ul") { closeList(); out.push("<ul>"); inList = "ul"; }
      out.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Plain paragraph
    closeList();
    out.push(`<p>${inlineFormat(line)}</p>`);
  }
  closeList();
  return out.join("");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatPanel({ fileName }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `I've analysed **"${fileName}"**. Ask me anything about the model results, feature importance, predictions, or how to improve performance.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await ragQuery(text);
      setMessages((prev) => [...prev, { role: "ai", text: res.answer }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "RAG service unavailable";
      setMessages((prev) => [...prev, {
        role: "ai",
        text: `⚠ Could not reach RAG service: ${msg}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Markdown styles scoped to chat ── */}
      <style>{`
        .md-bubble h1, .md-bubble h2, .md-bubble h3 {
          font-family: var(--font-syne);
          font-weight: 700;
          color: var(--color-txt);
          margin: 10px 0 4px;
          line-height: 1.3;
        }
        .md-bubble h1 { font-size: 15px; }
        .md-bubble h2 { font-size: 14px; }
        .md-bubble h3 {
          font-size: 13px;
          color: var(--color-accent2);
          letter-spacing: 0.2px;
        }
        .md-bubble p {
          margin: 4px 0;
          line-height: 1.7;
        }
        .md-bubble br { display: block; margin: 2px 0; content: ""; }
        .md-bubble strong {
          font-weight: 600;
          color: var(--color-txt);
        }
        .md-bubble em {
          font-style: italic;
          color: rgba(232,234,240,0.85);
        }
        .md-bubble code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          background: rgba(108,99,255,0.18);
          border: 1px solid rgba(108,99,255,0.25);
          color: var(--color-accent2);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .md-bubble ol, .md-bubble ul {
          margin: 6px 0 6px 6px;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .md-bubble ol { list-style: decimal; }
        .md-bubble ul { list-style: disc; }
        .md-bubble li {
          line-height: 1.65;
          color: rgba(232,234,240,0.82);
          padding-left: 2px;
        }
        .md-bubble li strong { color: var(--color-txt); }
      `}</style>

      <div
        className="rounded-[18px] overflow-hidden mb-5"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-[22px] py-[18px]"
          style={{ background: "rgba(108,99,255,0.06)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="w-[34px] h-[34px] rounded-full grid place-items-center text-base shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-accent1), var(--color-accent2))" }}>
            🤖
          </div>
          <div>
            <p className="text-[14px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              Dataset AI · {fileName}
            </p>
            <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>
              Ask a business question about your data
            </p>
          </div>
          <div className="ml-auto flex items-center gap-[6px]">
            <div
              className="w-[6px] h-[6px] rounded-full animate-pulse-dot"
              style={{ background: loading ? "var(--color-amber)" : "var(--color-accent2)" }}
            />
            <span className="text-[11px]"
              style={{ color: loading ? "var(--color-amber)" : "var(--color-accent2)", fontFamily: "var(--font-mono)" }}>
              {loading ? "thinking" : "live"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="px-[22px] py-[22px] flex flex-col gap-5 min-h-[220px] max-h-[480px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-[10px] ${msg.role === "user" ? "self-end flex-row-reverse max-w-[72%]" : "max-w-[92%]"}`}
            >
              {/* Avatar */}
              <div
                className="w-[28px] h-[28px] rounded-full grid place-items-center text-[13px] shrink-0 self-start mt-[18px]"
                style={{
                  background: msg.role === "ai"
                    ? "linear-gradient(135deg, var(--color-accent1), var(--color-accent2))"
                    : "rgba(255,255,255,0.07)",
                  border: msg.role === "user" ? "1px solid var(--color-border)" : "none",
                }}
              >
                {msg.role === "ai" ? "⚡" : "👤"}
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                {/* Role tag */}
                <p
                  className={`text-[10px] font-semibold tracking-[1px] uppercase ${msg.role === "user" ? "text-right" : ""}`}
                  style={{ color: msg.role === "ai" ? "var(--color-accent1)" : "var(--color-accent2)", fontFamily: "var(--font-mono)" }}
                >
                  {msg.role === "ai" ? "AI" : "You"}
                </p>

                {/* Bubble */}
                {msg.role === "ai" ? (
                  // AI: render markdown
                  <div
                    className="md-bubble px-4 py-3 rounded-[14px] rounded-tl-[4px] text-[13.5px]"
                    style={{
                      background: "rgba(108,99,255,0.09)",
                      border: "1px solid rgba(108,99,255,0.18)",
                      color: "rgba(232,234,240,0.82)",
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                  />
                ) : (
                  // User: plain text
                  <div
                    className="px-4 py-3 rounded-[14px] rounded-tr-[4px] text-[13.5px] leading-[1.65] text-right"
                    style={{
                      background: "rgba(0,212,170,0.09)",
                      border: "1px solid rgba(0,212,170,0.18)",
                      color: "var(--color-txt)",
                    }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {loading && (
            <div className="flex gap-[10px] max-w-[92%]">
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center text-[13px] shrink-0 self-start mt-[18px]"
                style={{ background: "linear-gradient(135deg, var(--color-accent1), var(--color-accent2))" }}>
                ⚡
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold tracking-[1px] uppercase"
                  style={{ color: "var(--color-accent1)", fontFamily: "var(--font-mono)" }}>AI</p>
                <div className="px-4 py-3 rounded-[14px] rounded-tl-[4px]"
                  style={{
                    background: "rgba(108,99,255,0.09)",
                    border: "1px solid rgba(108,99,255,0.18)",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                  }}>
                  <span style={{ animation: "pulse-dot 1s infinite", display: "inline-block" }}>●</span>
                  <span style={{ animation: "pulse-dot 1s 0.2s infinite", display: "inline-block", margin: "0 3px" }}>●</span>
                  <span style={{ animation: "pulse-dot 1s 0.4s infinite", display: "inline-block" }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3 px-[22px] py-4"
          style={{ borderTop: "1px solid var(--color-border)", background: "rgba(0,0,0,0.14)" }}>
          <input
            className="flex-1 px-4 py-[11px] rounded-[10px] text-[13.5px] outline-none transition-all"
            placeholder="Ask a business question about your data…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border)",
              color: "var(--color-txt)",
              fontFamily: "var(--font-dm)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(108,99,255,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="px-5 py-[11px] rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--color-accent1), var(--color-accent2))",
              color: "#fff",
              fontFamily: "var(--font-syne)",
            }}
          >
            Send ↑
          </button>
        </div>
      </div>
    </>
  );
}