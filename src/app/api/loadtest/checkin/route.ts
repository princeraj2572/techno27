import { NextRequest, NextResponse } from "next/server";
import { checkInByQRAction } from "@/features/checkin/checkin-actions";
import { getUser } from "@/features/users/user-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { staffToken, scannedUserId, eventId } = await req.json();
    await impersonate(staffToken);
    const staff = await getUser();
    if (!staff) throw new Error("Staff token did not resolve to a user");

    const result = await checkInByQRAction(scannedUserId, eventId, String(staff._id));
    return NextResponse.json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
