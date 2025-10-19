import { NextResponse } from "next/server";
import { getRoom } from "@/lib/fileStore";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { roomId: string } }) {
  const room = getRoom(params.roomId);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  return NextResponse.json({ room });
}
