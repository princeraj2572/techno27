import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUserRole } from "@/actions/user-actions";

export async function POST(req: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { targetUserId, newRole, reason } = await req.json();
  if (!targetUserId || !newRole) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await updateUserRole(targetUserId, newRole, currentUser._id as unknown as string, reason);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
