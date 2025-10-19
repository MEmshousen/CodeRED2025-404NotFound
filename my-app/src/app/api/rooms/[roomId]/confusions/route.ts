// src/app/api/rooms/[roomId]/confusions/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFUSIONS_FILE = path.join(DATA_DIR, "confusions.json");

type Confusion = {
  id: string;
  roomId: string;
  topic: string;
  details?: string;
  timestamp: number;
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(CONFUSIONS_FILE)) fs.writeFileSync(CONFUSIONS_FILE, "[]", "utf8");
}

function readAll(): Confusion[] {
  ensureFile();
  const raw = fs.readFileSync(CONFUSIONS_FILE, "utf8") || "[]";
  try {
    return JSON.parse(raw) as Confusion[];
  } catch {
    return [];
  }
}

function writeAll(items: Confusion[]) {
  ensureFile();
  fs.writeFileSync(CONFUSIONS_FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function GET(_req: Request, { params }: { params: { roomId: string } }) {
  try {
    const all = readAll();
    const confusions = all
      .filter((c) => c.roomId === params.roomId)
      .sort((a, b) => b.timestamp - a.timestamp);
    return NextResponse.json({ confusions });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to read" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  try {
    const { topic, details } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const all = readAll();
    const newConfusion: Confusion = {
      id: crypto.randomUUID(),
      roomId: params.roomId,
      topic: topic.trim(),
      details: (details ?? "").toString().trim() || undefined,
      timestamp: Date.now(),
    };
    all.push(newConfusion);
    writeAll(all);

    // IMPORTANT: return JSON, not 204
    return NextResponse.json({ confusion: newConfusion }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 500 });
  }
}
