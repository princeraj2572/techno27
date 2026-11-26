import type { ReactNode } from "react";

export default function FunctionalityLayout({ children }: { children: ReactNode }) {
  return (
    // The root layout already pads 4rem for the fixed navbar, so a full screen here would always overflow by 4rem.
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-background via-background to-black/80">
      {children}
    </div>
  );
}
