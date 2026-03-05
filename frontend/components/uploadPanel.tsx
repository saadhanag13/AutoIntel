"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useApp } from "@/context/AppContext";
import { uploadDataset } from "@/lib/api";

// Parse the first N rows of a CSV string client-side for preview
function parseCsvPreview(text: string, maxRows = 5): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { result.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1, maxRows + 1).map(parseRow);
  return { headers, rows };
}

// Max file size accepted (keep in sync with nginx client_max_body_size)
const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200 MB
const PREVIEW_SLICE = 16 * 1024;          // first 16 KB — enough for 5 rows

export default function UploadPanel() {
  const { setColumns, reset } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{ fileName: string; rows: number; columns: string[] } | null>(null);


  const processFile = async (file: File) => {
    setError(null);

    // ── Size guard ────────────────────────────────────────────────────────
    if (file.size > MAX_FILE_BYTES) {
      setError(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_BYTES / 1024 / 1024} MB.`
      );
      return;
    }

    setUploading(true);

    // ── Preview: read only the first 16 KB, not the whole file ───────────
    // file.text() on a large CSV loads everything into JS memory and can
    // crash the tab or block the thread. slice() is non-blocking and fast.
    try {
      const sliceText = await file.slice(0, PREVIEW_SLICE).text();
      setPreview(parseCsvPreview(sliceText, 5));
    } catch {
      // Preview is non-critical — silently skip it
      setPreview(null);
    }

    // ── Upload the full file to FastAPI via the Next.js proxy ─────────────
    try {
      const result = await uploadDataset(file);
      const meta = { fileName: file.name, rows: result.rows, columns: result.columns };
      setUploadMeta(meta);
      setColumns(result.columns, file.name, result.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleReset = () => {
    setUploadMeta(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    reset();
  };

  return (
    <div
      className="rounded-[18px] p-[26px] mb-7 relative overflow-hidden"
      style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
    >
      {/* Top gradient rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, var(--color-accent1), var(--color-accent2), transparent)" }}
      />

      {/* ── Drop zone ── */}
      {!uploadMeta && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className="rounded-[12px] p-8 text-center transition-all duration-200"
          style={{
            border: `1.5px dashed ${dragging ? "var(--color-accent1)" : "rgba(108,99,255,0.4)"}`,
            background: dragging ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.04)",
            cursor: uploading ? "wait" : "pointer",
          }}
        >
          <div className="text-4xl mb-3 opacity-60" style={{ animation: uploading ? "spin 1s linear infinite" : "none" }}>
            {uploading ? "⚙" : "☁"}
          </div>
          <p className="text-[15px] font-medium mb-1">
            {uploading ? "Uploading & parsing…" : "Drop your CSV here"}
          </p>
          <p className="text-[13px] mb-4" style={{ color: "var(--color-muted)" }}>
            {uploading ? "Sending to backend, please wait" : "Supports .csv — drag & drop or click to browse"}
          </p>
          {!uploading && (
            <button className="px-[22px] py-[9px] rounded-[8px] text-[13px] font-medium text-white pointer-events-none"
              style={{ background: "var(--color-accent1)" }}>
              Choose File
            </button>
          )}
          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={onChange} />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-[12px] px-[18px] py-[14px]"
          style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>
          <span className="text-xl">✕</span>
          <div className="flex-1">
            <p className="text-[14px] font-medium" style={{ color: "var(--color-accent3)" }}>Upload failed</p>
            <p className="text-[12px] mt-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>{error}</p>
          </div>
          <button onClick={() => { setError(null); inputRef.current?.click(); }}
            className="text-[12px] px-3 py-1 rounded-md"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)", background: "none", cursor: "pointer" }}>
            retry
          </button>
        </div>
      )}

      {/* ── Success + preview ── */}
      {uploadMeta && (
        <>
          {/* Success bar */}
          <div className="flex items-center gap-4 rounded-[12px] px-[18px] py-[14px] mb-5"
            style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)" }}>
            <span className="text-2xl">✓</span>
            <div className="flex-1">
              <p className="text-[14px] font-medium" style={{ color: "var(--color-accent2)" }}>
                {uploadMeta.fileName}
              </p>
              <p className="text-[12px] mt-[2px]" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                {uploadMeta.rows.toLocaleString()} rows · {uploadMeta.columns.length} columns · uploaded ✓
              </p>
            </div>
            <button onClick={handleReset}
              className="text-[12px] px-3 py-1 rounded-md transition-all hover:opacity-70"
              style={{ color: "var(--color-muted)", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontFamily: "var(--font-mono)" }}>
              replace
            </button>
          </div>

          {/* Dataset preview table */}
          {preview && preview.headers.length > 0 && (
            <div>
              <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between px-4 py-[10px]"
                  style={{ background: "rgba(108,99,255,0.09)", borderBottom: "1px solid var(--color-border)" }}>
                  <span className="text-[11px]" style={{ color: "var(--color-accent1)", fontFamily: "var(--font-mono)" }}>
                    preview · first 5 rows
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                    {uploadMeta.rows.toLocaleString()} × {uploadMeta.columns.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "rgba(108,99,255,0.06)" }}>
                        <th className="px-4 py-[10px] text-left whitespace-nowrap"
                          style={{ color: "var(--color-accent1)", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.5px" }}>
                          #
                        </th>
                        {preview.headers.map((h) => (
                          <th key={h} className="px-4 py-[10px] text-left whitespace-nowrap"
                            style={{ color: "var(--color-accent1)", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.5px" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, ri) => (
                        <tr key={ri} className="transition-colors hover:bg-white/[0.02]"
                          style={{ borderTop: "1px solid var(--color-border)" }}>
                          <td className="px-4 py-[9px]"
                            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                            {ri + 1}
                          </td>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-[9px] whitespace-nowrap"
                              style={{
                                color: ci === 0 ? "var(--color-txt)" : "var(--color-muted)",
                                fontFamily: "var(--font-mono)",
                              }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
