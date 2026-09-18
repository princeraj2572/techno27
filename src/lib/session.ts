import { cookies } from "next/headers";

import type { DashboardRole } from "@/lib/dashboard-types";

const ROLE_COOKIE_NAME = "techno27-dashboard-role";

export const getDashboardRole = async (): Promise<DashboardRole> => {
  const cookieStore = await cookies();
  const role = cookieStore.get(ROLE_COOKIE_NAME)?.value;

  if (role === "dev-management") {
    return "dev-management";
  }

  if (role === "management-admin") {
    return "management-admin";
  }

  return "user";
};

export const getRoleCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
});

export const ROLE_COOKIE = ROLE_COOKIE_NAME;