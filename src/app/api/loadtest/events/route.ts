import { NextResponse } from "next/server";
import { getAllEventsAction } from "@/features/events/event-actions";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

export async function GET() {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const events = await getAllEventsAction();
    return NextResponse.json({ success: true, events });
  } catch (e) {
    return errorResponse(e);
  }
}
