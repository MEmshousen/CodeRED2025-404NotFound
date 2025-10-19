import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

function extractText(resp: any): string {
  // New SDK helper (if present)
  if (resp && typeof resp.text === "function") {
    const t = resp.text();
    if (typeof t === "string" && t.trim()) return t;
  }
  // Fallbacks for different response shapes
  const cand = resp?.candidates?.[0];
  const parts = cand?.content?.parts;
  if (Array.isArray(parts)) {
    const joined = parts
      .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();
    if (joined) return joined;
  }
  // Last resort
  return JSON.stringify(resp, null, 2);
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing `text`" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const summary = extractText(resp);

    // ✅ Always return a string
    return NextResponse.json({ summary: String(summary) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Summarization failed" }, { status: 500 });
  }
}
