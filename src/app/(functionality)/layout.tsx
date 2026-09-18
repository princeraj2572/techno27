import type { ReactNode } from "react";

export default function FunctionalityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-black/80">
      {children}
    </div>
  );
}
