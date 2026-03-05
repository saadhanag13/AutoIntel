import type { UploadResponse, TrainResponse, RagResponse } from "@/types/api";

// Empty string = relative URL → requests go to Next.js (current origin).
// Next.js rewrites in next.config.ts then proxy them to FastAPI on port 8000.
// Override with NEXT_PUBLIC_API_URL for custom setups (e.g. Nginx on port 80).
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── POST /ml/upload ───────────────────────────────────────────────────────────
export async function uploadDataset(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/ml/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  return res.json();
}

// ── POST /api/ml/train?target_column=xxx ──────────────────────────────────────
// Uses a custom Next.js API route (app/api/ml/train/route.ts) instead of the
// rewrite proxy. Next.js rewrites have a hard 30s timeout that kills long
// training requests. Our API route has a 5-minute timeout.
export async function trainModel(targetColumn: string): Promise<TrainResponse> {
  const res = await fetch(
    `${API_BASE}/api/ml/train?target_column=${encodeURIComponent(targetColumn)}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(`Training failed (${res.status}): ${await res.text()}`);
  return res.json();
}

// ── POST /rag/query ───────────────────────────────────────────────────────────
export async function ragQuery(query: string): Promise<RagResponse> {
  const res = await fetch(`${API_BASE}/rag/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`RAG error (${res.status}): ${await res.text()}`);
  return res.json();
}
