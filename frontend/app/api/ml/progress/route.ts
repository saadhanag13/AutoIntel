import { NextResponse } from "next/server";

const FASTAPI = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

export async function GET() {
    try {
        const upstream = await fetch(`${FASTAPI}/ml/progress`, {
            signal: AbortSignal.timeout(5_000),
        });
        const body = await upstream.text();
        return new NextResponse(body, {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return NextResponse.json({ messages: [], done: false, error: null });
    }
}
