import { NextRequest, NextResponse } from "next/server";
import { userLogin } from "@/actions/user-actions";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { email, password } = await req.json();
    const { user, token } = await userLogin({ email, password });
    return NextResponse.json({ success: true, user, token });
  } catch (e) {
    return errorResponse(e);
  }
}
