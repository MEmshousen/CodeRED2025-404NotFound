import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const ROOMS_FILE = path.join(DATA_DIR, "rooms.json");

type Room = { id: string; name: string; teacherName?: string; createdAt: number };
type RoomsShape = Record<string, Room>;

// naive in-process mutex to avoid concurrent writes
let writing = Promise.resolve();

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(ROOMS_FILE)) fs.writeFileSync(ROOMS_FILE, "{}");
}

function readRooms(): RoomsShape {
  ensureFiles();
  const raw = fs.readFileSync(ROOMS_FILE, "utf8");
  try {
    return JSON.parse(raw || "{}") as RoomsShape;
  } catch {
    return {};
  }
}

async function writeRooms(next: RoomsShape) {
  ensureFiles();
  // serialize writes
  writing = writing.then(() =>
    fs.promises.writeFile(ROOMS_FILE, JSON.stringify(next, null, 2), "utf8")
  );
  return writing;
}

export function getRoom(id: string): Room | null {
  const rooms = readRooms();
  return rooms[id] ?? null;
}

export async function createRoom(id: string, name: string, teacherName?: string) {
  const rooms = readRooms();
  if (rooms[id]) throw new Error("Room ID already exists");
  rooms[id] = { id, name, teacherName, createdAt: Date.now() };
  await writeRooms(rooms);
  return rooms[id];
}
