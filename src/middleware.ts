import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = [
  "/dashboard",
  "/events-selection",
  "/team-details",
  "/admin",
  "/event-manager",
  "/dev",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  let payload: { userId?: string; email?: string; role?: string };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: decoded } = await jwtVerify(token, secret);
    payload = decoded as typeof payload;
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = payload.role;

  // DEV_ADMIN routes
  if (pathname.startsWith("/dev") && role !== "DEV_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Management admin routes
  if (
    pathname.startsWith("/admin") &&
    !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(role || "")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Event manager routes
  if (
    pathname.startsWith("/event-manager") &&
    !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(role || "")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events-selection/:path*",
    "/team-details/:path*",
    "/admin/:path*",
    "/event-manager/:path*",
    "/dev/:path*",
  ],
};
