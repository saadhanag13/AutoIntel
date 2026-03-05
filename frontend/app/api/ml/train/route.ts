import { NextRequest, NextResponse } from "next/server";

const FASTAPI = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

// This is a custom API route that proxies the training request to FastAPI.
// We can NOT use next.config.ts rewrites for this because Next.js rewrites
// have a hard 30-second proxy timeout that kills long-running requests.
// Training a model on a large dataset can take 30-120+ seconds.
export async function POST(req: NextRequest) {
    const targetColumn = req.nextUrl.searchParams.get("target_column") ?? "";

    try {
        const upstream = await fetch(
            `${FASTAPI}/ml/train?target_column=${encodeURIComponent(targetColumn)}`,
            {
                method: "POST",
                // No timeout — wait as long as FastAPI needs
                signal: AbortSignal.timeout(300_000), // 5 min safety cap
            }
        );

        const body = await upstream.text();
        return new NextResponse(body, {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Proxy error";
        return NextResponse.json({ detail: message }, { status: 502 });
    }
}
