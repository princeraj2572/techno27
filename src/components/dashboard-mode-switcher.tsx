"use client";

import { useState, useTransition } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";

import type { DashboardRole } from "@/lib/dashboard-types";
import ThemeToggle from "@/components/theme-toggle";

interface DashboardModeSwitcherProps {
  initialRole: DashboardRole;
}

export function DashboardModeSwitcher({ initialRole }: DashboardModeSwitcherProps): ReactElement {
  const [role, setRole] = useState<DashboardRole>(initialRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const switchRole = (nextRole: DashboardRole): void => {
    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ role: nextRole })
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { role: DashboardRole };
        setRole(data.role);
        router.refresh();
      })();
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-glow backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-500/80">Dashboard mode</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--app-text)]">{role === "dev-management" ? "Development operations" : "Participant view"}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => switchRole("user")}
          aria-pressed={role === "user"}
          disabled={isPending}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
            role === "user" ? "border-sky-500 bg-sky-500/10 text-[var(--app-text)]" : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-soft)] hover:bg-[var(--app-card-strong)]"
          }`}
        >
          User dashboard
        </button>
        <button
          type="button"
          onClick={() => switchRole("dev-management")}
          aria-pressed={role === "dev-management"}
          disabled={isPending}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
            role === "dev-management" ? "border-amber-500 bg-amber-500/10 text-[var(--app-text)]" : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-soft)] hover:bg-[var(--app-card-strong)]"
          }`}
        >
          Dev management
        </button>
      </div>
    </div>
  );
}

export default DashboardModeSwitcher;