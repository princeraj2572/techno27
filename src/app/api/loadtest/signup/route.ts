import { NextRequest, NextResponse } from "next/server";
import { userSignup } from "@/actions/user-actions";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const data = await req.json();
    const user = await userSignup(data);
    return NextResponse.json({ success: true, user });
  } catch (e) {
    return errorResponse(e);
  }
}
