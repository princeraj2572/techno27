import type { ReactNode } from "react";
import AreaBar from "@/components/layout/area-bar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AreaBar />
      {children}
    </>
  );
}
