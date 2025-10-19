import { NextResponse } from "next/server";
import { createRoom } from "@/lib/fileStore";

export const runtime = "nodejs"; // required to use fs

export async function POST(req: Request) {
  try {
    const { roomId, roomName, teacherName } = await req.json();

    if (!roomId || !roomName) {
      return NextResponse.json({ error: "roomId and roomName are required" }, { status: 400 });
    }

    const room = await createRoom(String(roomId).trim(), String(roomName).trim(), teacherName?.trim());
    return NextResponse.json({ room });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create room" }, { status: 400 });
  }
}

export async function GET() {
  // optional ping
  return NextResponse.json({ ok: true });
}
