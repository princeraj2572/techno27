export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { display } from "@/components/indie";
import { CARD_UI, TicketTitle } from "@/components/indie/gold-poster";
import { ALL_EVENTS } from "@/features/events/data/all-events";
import { getEventsWithRegistrationCountsAction } from "@/features/events/event-actions";
import { statusChip } from "@/features/events/status-ui";
import { getUser } from "@/features/users/user-actions";

type Row = {
  _id: string; name: string; status: string; category?: string; mainEvent?: string; teamSize?: number;
  teamCount: number; participantCount: number; internalCount: number; externalCount: number;
};

const TILES = [
  { key: "participants", label: "Participants", sub: "across all events", cls: "bg-[#0f6b63] text-white" },
  { key: "teams",        label: "Teams",        sub: "registered",        cls: "bg-[#1c1812] text-white" },
  { key: "internal",     label: "OPJU",         sub: "internal",          cls: "bg-[#f5c928] text-[#1c1812]" },
  { key: "external",     label: "External",     sub: "outside colleges",  cls: "bg-[#c8421f] text-white" },
] as const;

export default async function AdminEventsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const data = (await getEventsWithRegistrationCountsAction().catch(() => null)) as
    | { eventsWithCounts: Row[]; totalParticipants: number; totalInternal: number; totalExternal: number; totalTeams: number }
    | null;
  const events = data?.eventsWithCounts ?? [];
  const totals = { participants: data?.totalParticipants ?? 0, teams: data?.totalTeams ?? 0, internal: data?.totalInternal ?? 0, external: data?.totalExternal ?? 0 };

  // One group per fest event, in website order; hand-made events without a fest go last.
  const groups = [
    ...ALL_EVENTS.map((f) => ({ key: f.slug, name: f.name, category: f.category, rows: events.filter((e) => e.mainEvent === f.slug) })),
    ...events.filter((e) => !ALL_EVENTS.some((f) => f.slug === e.mainEvent)).map((e) => ({ key: e._id, name: e.name, category: e.category, rows: [e] })),
  ].filter((g) => g.rows.length);
  const openCount = events.filter((e) => e.status === "REGISTRATION_OPEN").length;

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-8">
      {/* Header */}
      <div className="flex items-start flex-wrap justify-between gap-x-4 gap-y-3">
        <div>
          <TicketTitle className="mb-2 text-3xl leading-[1.1] sm:text-5xl">Events</TicketTitle>
          <p className="text-sm text-slate-500">
            {groups.length} fest events · {events.length} competitions · {openCount} open for registration
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {user.role === "DEV_ADMIN" && (
            <Link href="/dev/events" className="text-xs font-bold uppercase text-[#0f6b63] hover:underline tap-target">Registration controls</Link>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TILES.map((t) => (
          <div key={t.key} className={`rounded-2xl border-[3px] border-[#1c1812] p-4 shadow-[0_4px_0_#1c1812] ${t.cls}`}>
            <p className="text-sm font-semibold">{t.label}</p>
            <p className={`mt-2 text-4xl leading-none tabular-nums ${display.className}`}>{totals[t.key]}</p>
            <p className="mt-2 text-xs font-medium">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Fest events with their competitions */}
      {groups.length === 0 ? (
        <p className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 bg-white/60 py-14 text-center text-black/60">No events yet.</p>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => {
            const people = g.rows.reduce((n, r) => n + r.participantCount, 0);
            const teams = g.rows.reduce((n, r) => n + r.teamCount, 0);
            const single = g.rows.length === 1 && g.rows[0].name === g.name;
            return (
              <section key={g.key} className={`${CARD_UI} overflow-hidden`}>
                <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-dashed border-black/15 px-5 py-4">
                  <h2 className={`text-2xl text-[#1c1812] ${display.className}`}>{g.name}</h2>
                  {g.category && <span className="text-xs font-bold uppercase tracking-widest text-[#a33517]">{g.category}</span>}
                  <span className="text-xs text-black/50">{single ? "Single event" : `${g.rows.length} competitions`}</span>
                  <span className="ml-auto text-sm text-[#1c1812]">
                    <b className="tabular-nums">{people}</b> participants · <b className="tabular-nums">{teams}</b> teams
                  </span>
                </header>

                {/* column labels (desktop) */}
                <div className="hidden grid-cols-[1fr_6rem_4.5rem_4.5rem_4.5rem_5rem] gap-3 bg-[#f6efdf] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-black/55 md:grid">
                  <span>Competition</span><span>Status</span><span className="text-right">People</span><span className="text-right">Teams</span><span className="text-right">OPJU / Ext</span><span />
                </div>
                <ul className="divide-y divide-black/10">
                  {g.rows.map((r) => {
                    const st = statusChip(r.status);
                    const name = r.name.startsWith(g.name + ": ") ? r.name.slice(g.name.length + 2) : r.name;
                    return (
                      <li key={r._id}>
                        <Link
                          href={`/admin/events/${r._id}`}
                          className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-5 py-3 transition-colors hover:bg-[#fff6cc] md:grid-cols-[1fr_6rem_4.5rem_4.5rem_4.5rem_5rem]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-bold text-[#1c1812]">{name}</span>
                            <span className="text-xs text-black/55">{(r.teamSize ?? 1) > 1 ? `Team of up to ${r.teamSize}` : "Solo"}</span>
                          </span>
                          <span className={`justify-self-end rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase md:justify-self-start ${st.cls}`}>{st.text}</span>
                          <span className="col-span-2 text-xs text-black/60 md:hidden">
                            {r.participantCount} people · {r.teamCount} teams · {r.internalCount} OPJU / {r.externalCount} ext
                          </span>
                          <span className="hidden text-right font-bold tabular-nums text-[#1c1812] md:block">{r.participantCount}</span>
                          <span className="hidden text-right tabular-nums text-[#1c1812] md:block">{r.teamCount}</span>
                          <span className="hidden text-right tabular-nums text-black/70 md:block">{r.internalCount} / {r.externalCount}</span>
                          <span className="hidden items-center justify-end gap-1 text-xs font-bold uppercase text-[#0f6b63] md:flex">
                            View <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
