import { NextRequest, NextResponse } from "next/server";
import { acceptInviteAction } from "@/features/teams/invite-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../../../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { token, inviteId } = await req.json();
    await impersonate(token);
    const result = await acceptInviteAction(inviteId);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return errorResponse(e);
  }
}
