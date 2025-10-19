// app/gemini-test/page.tsx
'use client';

import { useState } from "react";

const SAMPLE_TEXT = `
Clarity is a real-time classroom tool where students can anonymously post confusion points.
Teachers see aggregate themes and AI summaries to decide what to revisit.
It works well for large lectures and hybrid classes.
`;

export default function GeminiTestPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  async function runSummarize() {
    try {
      setLoading(true);
      setSummary(null);

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLE_TEXT }),
      });

      const data = await res.json();
      console.log("Gemini summary:", data); // <-- logs the API response
      if (data.summary) setSummary(data.summary);
    } catch (e) {
      console.error("Request failed:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-4">Gemini summarize demo</h1>
      <p className="text-sm mb-2">Sample text:</p>
      <pre className="p-3 rounded-md bg-gray-100 text-sm whitespace-pre-wrap mb-4">
        {SAMPLE_TEXT}
      </pre>

      <button
        className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        onClick={runSummarize}
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <>
          <h2 className="text-xl font-medium mt-6 mb-2">Summary</h2>
          <div className="p-3 rounded-md bg-gray-50 text-sm whitespace-pre-wrap">
            {summary}
          </div>
        </>
      )}
    </main>
  );
}
