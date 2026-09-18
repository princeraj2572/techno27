import type { DashboardPayload } from "@/lib/dashboard-types";
import type { ReactElement } from "react";

interface DashboardShellProps {
  payload: DashboardPayload;
}

export function DashboardShell({ payload }: DashboardShellProps): ReactElement {
  return (
    <section className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6 shadow-glow backdrop-blur-xl lg:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-500/90">
          {payload.eyebrow}
        </span>
        <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs font-medium text-[var(--app-text-soft)]">
          {payload.role === "dev-management" ? "Dev admin surface" : "Participant surface"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-5xl">{payload.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--app-text-soft)] sm:text-lg">{payload.subtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {payload.metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 shadow-sm">
                <p className="text-sm text-[var(--app-text-muted)]">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--app-text)]">{metric.value}</p>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">{metric.hint}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {payload.sections.map((section) => (
              <article key={section.title} className="rounded-[24px] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-[var(--app-text)]">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--app-text-soft)]">{section.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--app-text-soft)]">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-aurora-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="rounded-[24px] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Important notice</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--app-text-soft)]">{payload.notice.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--app-text-soft)]">{payload.notice.description}</p>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-panel)] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Next actions</h2>
            <div className="mt-4 space-y-3">
              {payload.actions.map((action) => (
                <a key={action.label} href={action.href} className="block rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 transition hover:border-sky-500/60 hover:bg-[var(--app-card-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                  <h3 className="font-medium text-[var(--app-text)]">{action.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--app-text-soft)]">{action.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-panel)] p-5 shadow-sm" id="timeline">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Timeline</h2>
            <div className="mt-4 space-y-3">
              {payload.timeline.map((entry) => (
                <article key={entry.label} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-amber-500/80">{entry.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--app-text-soft)]">{entry.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-panel)] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Quick links</h2>
            <div className="mt-4 grid gap-2">
              {payload.links.map((link) => (
                <a key={link.label} href={link.href} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 transition hover:border-white/30 hover:bg-[var(--app-card-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[var(--app-text)]">{link.label}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Open</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">{link.note}</p>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default DashboardShell;