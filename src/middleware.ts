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

// Behind Nginx, request.url's host is the internal localhost:3000 (Next ignores Host / X-Forwarded-Host when
// building it), so redirects built from it send visitors to localhost. Build them from the address the visitor
// actually used: Nginx forwards Host, and X-Forwarded-Proto once HTTPS is on. (Next rejects relative Locations.)
function redirectTo(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) {
    url.host = host;
    if (!/:\d+$/.test(host)) url.port = ""; // a Host without a port means the default one, not Next's internal :3000
  }
  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "http" || proto === "https") url.protocol = `${proto}:`;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return redirectTo(request, "/auth/login");
  }

  let payload: { userId?: string; email?: string; role?: string };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: decoded } = await jwtVerify(token, secret);
    payload = decoded as typeof payload;
  } catch {
    return redirectTo(request, "/auth/login");
  }

  const role = payload.role;

  // DEV_ADMIN routes
  if (pathname.startsWith("/dev") && role !== "DEV_ADMIN") {
    return redirectTo(request, "/dashboard");
  }

  // Management admin routes
  if (
    pathname.startsWith("/admin") &&
    !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(role || "")
  ) {
    return redirectTo(request, "/dashboard");
  }

  // Event manager routes: event managers only (Dev admin for support). Management admins
  // run check-in and participants from their own /admin pages, not from this area.
  if (
    pathname.startsWith("/event-manager") &&
    !["DEV_ADMIN", "EVENT_MANAGER"].includes(role || "")
  ) {
    return redirectTo(request, "/dashboard");
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
