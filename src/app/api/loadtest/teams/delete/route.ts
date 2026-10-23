import { NextRequest, NextResponse } from "next/server";
import { deleteTeamAction } from "@/features/teams/team-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { token, teamId } = await req.json();
    await impersonate(token);
    const result = await deleteTeamAction(teamId);
    return NextResponse.json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
