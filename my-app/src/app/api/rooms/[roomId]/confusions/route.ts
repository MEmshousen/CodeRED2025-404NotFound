import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFUSIONS_FILE = path.join(DATA_DIR, "confusions.json");

type Confusion = {
  id: string;
  roomId: string;
  topic: string;
  details: string;
  timestamp: number;
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(CONFUSIONS_FILE)) fs.writeFileSync(CONFUSIONS_FILE, "[]");
}

function readConfusions(): Confusion[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(CONFUSIONS_FILE, "utf8") || "[]");
}

export async function GET(
  _req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const all = readConfusions();
    const filtered = all.filter((c) => c.roomId === params.roomId);
    return NextResponse.json({ confusions: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
