import type { ReactNode } from "react";
import AreaLayout from "@/components/layout/area-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AreaLayout area="event-manager">{children}</AreaLayout>;
}
