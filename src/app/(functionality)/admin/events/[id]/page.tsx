export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Types } from "mongoose";
import { CalendarDays, ChevronLeft, ChevronRight, Crown, MapPin, Users } from "lucide-react";
import { display } from "@/components/indie";
import { CARD_UI, INSET, TicketTitle } from "@/components/indie/gold-poster";
import { getEvent as getFestEvent } from "@/features/events/data/all-events";
import { getEventByIdAction } from "@/features/events/event-actions";
import { statusChip } from "@/features/events/status-ui";
import { Team } from "@/features/teams/team.model";
import { User } from "@/features/users/user.model";
import { getUser } from "@/features/users/user-actions";
import { connectToDatabase } from "@/lib/mongodb";

const PAGE_SIZE = 25;
type Person = { email: string; fullName?: string; role?: string; participantId?: string; enrollmentNumber?: string };

export default async function AdminEventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const viewer = await getUser();
  if (!viewer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(viewer.role)) redirect("/dashboard");

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) notFound();
  const page = Math.max(1, parseInt((await searchParams).page ?? "1") || 1);

  const event = await getEventByIdAction(id);
  if (!event) notFound();

  await connectToDatabase();
  // Counts over every team; member details only for the teams on this page.
  const [allTeams, teams] = await Promise.all([
    Team.find({ event: id }).select("members").lean<{ members: string[] }[]>(),
    Team.find({ event: id }).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean<{ _id: Types.ObjectId; leader: string; members: string[]; size?: number }[]>(),
  ]);
  const everyone = [...new Set(allTeams.flatMap((t) => t.members))];
  const people = (await User.find({ email: { $in: everyone } }).select("fullName email role participantId enrollmentNumber").lean<Person[]>()) as Person[];
  const byEmail = new Map(people.map((p) => [p.email, p]));
  const internal = people.filter((p) => p.role === "INTERNAL_USER").length;
  const external = people.filter((p) => p.role === "EXTERNAL_USER").length;
  const teamCount = allTeams.length;
  const totalPages = Math.max(1, Math.ceil(teamCount / PAGE_SIZE));

  const fest = event.mainEvent ? getFestEvent(event.mainEvent) : undefined;
  const title = fest && event.name.startsWith(fest.name + ": ") ? event.name.slice(fest.name.length + 2) : event.name;
  const st = statusChip(String(event.status));
  const maxTeam = Number(event.teamSize ?? 1);
  const rules = String(event.rules ?? "").split("\n").map((r) => r.trim()).filter(Boolean);

  const tiles = [
    { label: "Teams", value: teamCount, sub: maxTeam > 1 ? `up to ${maxTeam} each` : "solo entries", cls: "bg-[#0f6b63] text-white" },
    { label: "Participants", value: everyone.length, sub: event.maxParticipants ? `limit ${event.maxParticipants}` : "no limit", cls: "bg-[#1c1812] text-white" },
    { label: "OPJU", value: internal, sub: "internal", cls: "bg-[#f5c928] text-[#1c1812]" },
    { label: "External", value: external, sub: "outside colleges", cls: "bg-[#c8421f] text-white" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-7 px-4 py-8">
      {/* Header */}
      <div className="flex items-start flex-wrap justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <Link href="/admin/events" className="mb-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0f6b63] tap-target">
            <ChevronLeft className="h-3.5 w-3.5" /> {fest ? fest.name : "Events"}
          </Link>
          <TicketTitle className="mb-2 break-words text-3xl leading-[1.1] sm:text-5xl">{title}</TicketTitle>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${st.cls}`}>{st.text}</span>
            {event.category && <span className="text-xs font-bold uppercase tracking-widest text-[#a33517]">{event.category}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {viewer.role === "DEV_ADMIN" && (
            <Link href={`/dev/events/${id}`} className="text-xs font-bold uppercase text-[#0f6b63] hover:underline tap-target">Manage</Link>
          )}
        </div>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className={`rounded-2xl border-[3px] border-[#1c1812] p-4 shadow-[0_4px_0_#1c1812] ${t.cls}`}>
            <p className="text-sm font-semibold">{t.label}</p>
            <p className={`mt-2 text-4xl leading-none tabular-nums ${display.className}`}>{t.value}</p>
            <p className="mt-2 text-xs font-medium">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <section className={`${CARD_UI} p-5`}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {[
            ["Team size", maxTeam > 1 ? `Up to ${maxTeam}` : "Solo"],
            ["OPJU fee", `₹${event.internalFee ?? 0}`],
            ["External fee", `₹${event.externalFee ?? 0}`],
            ["Prize", event.prizeMoney ? `₹${event.prizeMoney.toLocaleString("en-IN")}` : "To be announced"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-bold uppercase tracking-wider text-black/55">{k}</dt>
              <dd className="mt-0.5 font-bold text-[#1c1812]">{v}</dd>
            </div>
          ))}
        </dl>
        {(event.schedule || event.venue) && (
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/70">
            {event.schedule && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {[...new Set(String(event.schedule).split(" · "))].join(" · ")}</span>}
            {event.venue && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.venue}</span>}
          </p>
        )}
        {rules.length > 0 && (
          <details className={`${INSET} mt-4 px-4 py-3`}>
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-wider text-[#1c1812]">Rules ({rules.length})</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-black/75">
              {rules.map((r) => <li key={r}>{r}</li>)}
            </ol>
          </details>
        )}
      </section>

      {/* Teams */}
      <section className={`${CARD_UI} overflow-hidden`}>
        <header className="flex items-center gap-2 border-b-2 border-dashed border-black/15 px-5 py-4">
          <Users className="h-5 w-5 text-[#1c1812]" />
          <h2 className={`text-xl text-[#1c1812] ${display.className}`}>Registered teams</h2>
          <span className="text-sm text-black/50">({teamCount})</span>
        </header>
        {teams.length === 0 ? (
          <p className="py-12 text-center text-black/55">No registrations yet.</p>
        ) : (
          <ul className="divide-y divide-black/10">
            {teams.map((t) => {
              const lead = byEmail.get(t.leader);
              return (
                <li key={String(t._id)} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Crown className="h-4 w-4 shrink-0 text-[#e9a11a]" aria-label="Leader" />
                    <p className="font-bold text-[#1c1812]">{lead?.fullName ?? t.leader}</p>
                    <p className="text-xs text-black/55">{t.leader}</p>
                    <span className="ml-auto text-xs font-bold uppercase text-black/60">
                      {t.members.length}{maxTeam > 1 ? ` / ${maxTeam}` : ""} {t.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
                    {t.members.map((m) => {
                      const p = byEmail.get(m);
                      const ext = p?.role === "EXTERNAL_USER";
                      return (
                        <span key={m} title={m} className="inline-flex items-center gap-1.5 rounded-full bg-[#f6efdf] px-2.5 py-1 text-xs text-[#1c1812]">
                          {p?.fullName ?? m}
                          <span className={`rounded-full px-1.5 text-[10px] font-bold uppercase ${ext ? "bg-[#c8421f] text-white" : "bg-[#f5c928] text-[#1c1812]"}`}>{ext ? "Ext" : "OPJU"}</span>
                          {(p?.participantId || p?.enrollmentNumber) && <span className="font-mono text-[10px] text-black/50">{p.participantId || p.enrollmentNumber}</span>}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t-2 border-dashed border-black/15 px-5 py-3 text-sm">
            <span className="text-black/60">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, teamCount)} of {teamCount}</span>
            <div className="flex items-center gap-2">
              {page > 1 && <Link href={`/admin/events/${id}?page=${page - 1}`} className="rounded-full border-2 border-[#1c1812] px-3 py-1 font-bold">← Prev</Link>}
              <span className="text-black/60">{page} / {totalPages}</span>
              {page < totalPages && <Link href={`/admin/events/${id}?page=${page + 1}`} className="inline-flex items-center rounded-full border-2 border-[#1c1812] px-3 py-1 font-bold">Next <ChevronRight className="h-4 w-4" /></Link>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
