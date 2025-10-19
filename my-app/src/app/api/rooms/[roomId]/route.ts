import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/lib/fileStore";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;
  const room = getRoom(roomId);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  return NextResponse.json({ room });
}
