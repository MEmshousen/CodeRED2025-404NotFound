import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  try {
    const p = path.join("/tmp", "probe.txt");
    fs.mkdirSync("/tmp", { recursive: true });
    fs.writeFileSync(p, String(Date.now()), "utf8");
    const readBack = fs.readFileSync(p, "utf8");
    return NextResponse.json({ ok: true, path: p, readBack });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
