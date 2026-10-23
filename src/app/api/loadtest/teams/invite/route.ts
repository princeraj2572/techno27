import { NextRequest, NextResponse } from "next/server";
import { sendTeamInviteAction } from "@/features/teams/invite-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { token, teamId, inviteeEmail } = await req.json();
    await impersonate(token);
    const result = await sendTeamInviteAction({ teamId, inviteeEmail });
    return NextResponse.json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
