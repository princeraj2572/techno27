import { NextRequest, NextResponse } from "next/server";
import { userLogin } from "@/features/users/user-actions";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { email, password } = await req.json();
    const result = await userLogin({ email, password });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: result.user, token: result.token });
  } catch (e) {
    return errorResponse(e);
  }
}
