// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing `text`" }, { status: 400 });
  }

  // Prefer GEMINI_API_KEY; fall back to GOOGLE_API_KEY if you use that name
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey }); // SDK client
    const prompt = `Summarize the following text in 3-5 bullet points, be concise:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return NextResponse.json({ summary: response.text });
  } catch (err: any) {
    // You can also catch ApiError with status/message if you want
    console.error("Gemini summarize error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to summarize" },
      { status: 500 }
    );
  }
}
