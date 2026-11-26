import type { ReactNode } from "react";
import { getUser } from "@/features/users/user-actions";
import RailFrame, { type Area } from "./rail-frame";

/** Server wrapper for every logged-in area's layout: loads the signed-in user once and renders the shared rail. */
export default async function AreaLayout({ area, children }: { area: Area; children: ReactNode }) {
  const user = await getUser();
  // Middleware already redirects signed-out visitors; this only guards against a deleted/expired account.
  const rail = {
    name: user?.fullName?.split(" ")[0] ?? "Guest",
    role: user?.role ?? "",
    participantId: user?.participantId || undefined,
  };
  return <RailFrame area={area} user={rail}>{children}</RailFrame>;
}
