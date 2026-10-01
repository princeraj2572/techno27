import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth";

/**
 * Load-test routes exist only to give k6/Artillery plain JSON endpoints for
 * Server Actions (which use a build-specific Next-Action protocol). They are
 * disabled unless ALLOW_LOADTEST=true, and must never be enabled in prod.
 */
export function assertLoadtestEnabled(): NextResponse | null {
  if (process.env.ALLOW_LOADTEST !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

// Lets a VU impersonate a given user by token, independent of browser cookie
// jars, so one k6 iteration can drive multiple synthetic users (leader +
// invitee + staff) without losing session state between requests.
export async function impersonate(token?: string) {
  if (!token) return;
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, authCookieOptions());
}

export function errorResponse(e: unknown) {
  return NextResponse.json({ error: (e as Error).message }, { status: 400 });
}
