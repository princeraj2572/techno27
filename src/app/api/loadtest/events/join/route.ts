import { NextRequest, NextResponse } from "next/server";
import { submitEventsAction } from "@/actions/event-actions";
import { getUser } from "@/actions/user-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { token, eventIds } = await req.json();
    await impersonate(token);
    const result = await submitEventsAction({ eventIds });
    const user = await getUser();
    return NextResponse.json({ success: true, result, teamIds: user?.teams ?? [] });
  } catch (e) {
    return errorResponse(e);
  }
}
