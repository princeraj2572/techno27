export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { Barlow_Condensed, Dela_Gothic_One } from "next/font/google";
import { getUser } from "@/features/users/user-actions";
import { getEventsWithRegistrationCountsAction } from "@/features/events/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import {
  Users, CalendarDays, Hotel,
  CheckSquare, UsersRound, ShieldCheck, BarChart2,
  ArrowRight, LifeBuoy, Contact,
} from "lucide-react";
import Link from "next/link";
import { CARD_UI, GoldBackdrop, INK, TicketTitle } from "@/components/indie/gold-poster";

// Retro "indie" look inspired by Rendezvous IITD.
const display = Dela_Gothic_One({ weight: "400", subsets: ["latin"] });
const body = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"] });

const CARD = CARD_UI;

const NAV_GROUPS = [
  {
    title: "People",
    items: [
      { label: "Participants",    href: "/admin/participants",    icon: Users,       desc: "View and search registrants",     color: "bg-[#f5c928]" },
      { label: "Teams",           href: "/admin/teams",           icon: UsersRound,  desc: "All registered teams",             color: "bg-[#ff6a00]" },
      { label: "Event Managers",  href: "/admin/event-managers",  icon: ShieldCheck, desc: "Assign event manager access",      color: "bg-[#c8421f]" },
      { label: "Fest Team",       href: "/admin/team",            icon: Contact,     desc: "Conveners & co-conveners",         color: "bg-[#ffb10f]" },
    ],
  },
  {
    title: "Fest Operations",
    items: [
      { label: "Events",          href: "/admin/events",          icon: CalendarDays,desc: "Monitor event registrations",      color: "bg-[#ff6a00]" },
      { label: "Check-In",        href: "/admin/checkin",         icon: CheckSquare, desc: "Manage event check-in",            color: "bg-[#f5c928]" },
      { label: "Accommodation",   href: "/admin/accommodation",   icon: Hotel,       desc: "Accommodation applications",       color: "bg-[#c8421f]" },
    ],
  },
  {
    title: "Reports & help",
    items: [
      { label: "Reports",         href: "/admin/reports",         icon: BarChart2,   desc: "Export data and reports",          color: "bg-[#ff6a00]" },
      { label: "Help desk",       href: "/admin/helpdesk",        icon: LifeBuoy,    desc: "Answer participant questions",     color: "bg-[#f5c928]" },
    ],
  },
];

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-800", bg: "bg-emerald-200" },
  EVENT_LIVE:          { text: "Live",       color: "text-white",       bg: "bg-[#ff6a00]"   },
  COMPLETED:           { text: "Completed",  color: "text-stone-600",   bg: "bg-stone-200"   },
  CANCELLED:           { text: "Cancelled",  color: "text-red-800",     bg: "bg-red-200"     },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-900",   bg: "bg-amber-200"   },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-900",  bg: "bg-orange-200"  },
  DRAFT:               { text: "Draft",      color: "text-stone-600",   bg: "bg-stone-200"   },
  UPCOMING:            { text: "Upcoming",   color: "text-[#1c1812]",    bg: "bg-[#fde9a8]"    },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-600",
  EVENT_LIVE:          "border-l-[#ff6a00]",
  COMPLETED:           "border-l-stone-400",
  CANCELLED:           "border-l-red-600",
  REGISTRATION_CLOSED: "border-l-amber-500",
  TEMPORARILY_CLOSED:  "border-l-orange-500",
};

const OVERVIEW_ROWS = 8;
const STATUS_RANK = (s: string) => ["EVENT_LIVE", "REGISTRATION_OPEN", "TEMPORARILY_CLOSED", "REGISTRATION_CLOSED", "UPCOMING"].indexOf(s) >>> 0;

async function getParticipantCounts() {
  await connectToDatabase();
  const [total, internal, external] = await Promise.all([
    User.countDocuments({ role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } }),
    User.countDocuments({ role: "INTERNAL_USER" }),
    User.countDocuments({ role: "EXTERNAL_USER" }),
  ]);
  return { total, internal, external };
}

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const [{ eventsWithCounts: events }, participantCounts] = await Promise.all([
    getEventsWithRegistrationCountsAction().catch(() => ({ eventsWithCounts: [] })) as Promise<{
      eventsWithCounts: Array<{ _id: string; name: string; status: string; category?: string; teamCount: number; participantCount: number; internalCount: number; externalCount: number }>;
    }>,
    getParticipantCounts().catch(() => ({ total: 0, internal: 0, external: 0 })),
  ]);

  const openCount  = events.filter((e) => e.status === "REGISTRATION_OPEN").length;
  const liveCount  = events.filter((e) => e.status === "EVENT_LIVE").length;
  const totalCount = events.length;
  const firstName  = user.fullName.split(" ")[0];

  const stats = [
    { label: "Total events",       value: totalCount,                 sub: "all events",        bg: "bg-[#0f6b63]", href: "/admin/events", light: true },
    { label: "Open now",           value: openCount,                  sub: "registration open", bg: "bg-[#f5c928]" },
    { label: "Live now",           value: liveCount,                  sub: "events running",    bg: "bg-[#c8421f]", light: true },
    { label: "Total participants", value: participantCounts.total,    sub: "registered",        bg: "bg-[#1c1812]", href: "/admin/participants", light: true },
    { label: "OPJU",               value: participantCounts.internal, sub: "@opju.ac.in",       bg: "bg-[#f5c928]" },
    { label: "External",           value: participantCounts.external, sub: "outside colleges",  bg: "bg-[#c8421f]", light: true },
  ];

  return (
    <div className={`text-[#1a0505] ${body.className}`}>
      <style>{`
        @keyframes indie-spin { to { transform: rotate(360deg); } }
        @keyframes indie-marquee { to { transform: translateX(-50%); } }
        @keyframes indie-wobble { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(-3deg); } }
        @media (prefers-reduced-motion: reduce) {
          .indie-anim { animation: none !important; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Gold header banner (same look as the participant dashboard) */}
        <div className="relative overflow-hidden rounded-3xl border-[3px] px-5 py-6 sm:px-8 sm:py-7" style={{ borderColor: INK, boxShadow: `0 5px 0 ${INK}` }}>
          <GoldBackdrop at="90% 130%" sparkles={false} />
          <div className="relative flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] sm:text-sm" style={{ color: INK }}>Management console</p>
              <TicketTitle className="text-4xl leading-[1.05] sm:text-6xl">Management</TicketTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border-2 bg-[#c8421f] px-3 py-1 text-[10px] font-extrabold uppercase text-white sm:text-xs" style={{ borderColor: INK }}>{user.role.replace(/_/g, " ")}</span>
                <span className="rounded-full border-2 px-3 py-1 text-[10px] font-extrabold uppercase text-[#f3e8cf] sm:text-xs" style={{ borderColor: INK, background: INK }}>Techno-aiMBiAtion 2027</span>
              </div>
            </div>
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] bg-[#f3e8cf] text-2xl ${display.className}`} style={{ borderColor: INK, color: INK, boxShadow: `0 4px 0 ${INK}` }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => {
            const tile = (
              <div className={`relative ${s.bg} ${s.light ? "text-white" : "text-[#1c1812]"} h-full rounded-2xl border-[3px] border-[#1c1812] p-4 shadow-[0_4px_0_#1c1812] ${s.href ? "card-lift" : ""}`}>
                {s.label === "Live now" && s.value > 0 && (
                  <span
                    className="indie-anim absolute -top-3 -right-2 bg-[#f5c928] text-black text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-black rounded-full"
                    style={{ animation: "indie-wobble 2s ease-in-out infinite" }}
                  >
                    ● On air
                  </span>
                )}
                <p className="mb-2 text-sm font-semibold">{s.label}</p>
                <p className={`text-3xl sm:text-5xl tabular-nums leading-none ${display.className}`}>{s.value}</p>
                <p className="mt-2 text-xs font-medium">{s.sub}</p>
              </div>
            );
            return s.href
              ? <Link key={s.label} href={s.href}>{tile}</Link>
              : <div key={s.label}>{tile}</div>;
          })}
        </div>

        {/* Navigation grid */}
        <div className=" space-y-5">
          <p className={`text-xl text-[#1c1812] ${display.className}`}>Manage</p>
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <span className="inline-block bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-widest px-3 py-0.5 border-2 border-black -rotate-1 mb-3">
                {group.title}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href + item.label} href={item.href} className="group">
                      <div className={`${CARD} card-lift px-4 py-4 h-full flex flex-col gap-3`}>
                        <div className={`w-9 h-9 rounded-full ${item.color} border-2 border-black flex items-center justify-center shrink-0`}>
                          <Icon className="h-4 w-4 text-black" />
                        </div>
                        <div>
                          <p className="text-lg font-bold uppercase leading-tight tracking-wide">{item.label}</p>
                          <p className="text-sm text-[#1a0505]/65 mt-0.5 leading-snug hidden sm:block">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Events overview */}
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xl text-[#1c1812] ${display.className}`}>Events overview <span className="text-sm text-black/50">{Math.min(events.length, OVERVIEW_ROWS)} of {events.length}</span></p>
            <Link
              href="/admin/events"
              className="tap-target text-sm font-bold uppercase tracking-wider text-[#0e5b57] hover:text-[#a33517] transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#1c1812]/30 bg-white/60 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-[#a33517]" />
              <p className="text-lg font-semibold uppercase tracking-wide text-black/60">No events yet</p>
            </div>
          ) : (
            <div className={`${CARD} overflow-hidden divide-y-2 divide-dashed divide-black/15`}>
              {/* Live and open events first; the full list is on the Events page. */}
              {[...events].sort((a, b) => STATUS_RANK(a.status) - STATUS_RANK(b.status)).slice(0, OVERVIEW_ROWS).map((event) => {
                const border = STATUS_BORDER[event.status] ?? "border-l-stone-400";
                const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-stone-600", bg: "bg-stone-200" };
                return (
                  <Link
                    key={event._id}
                    href={`/admin/events/${event._id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 border-l-8 ${border} hover:bg-[#f5c928]/30 transition-colors`}
                  >
                    <div className="min-w-0">
                      <p className="text-lg font-bold uppercase tracking-wide truncate leading-tight">{event.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap text-sm">
                        {event.category && (
                          <span className="text-[#1a0505]/60 uppercase tracking-wide">{event.category}</span>
                        )}
                        {event.participantCount > 0 && (
                          <>
                            {event.category && <span className="text-[#1a0505]/30">·</span>}
                            <span className="font-semibold">{event.participantCount} registered</span>
                            {event.internalCount > 0 && (
                              <span className="text-xs bg-sky-200 text-[#0f6b63] font-bold px-1.5 py-0.5 rounded-full border border-black/30">{event.internalCount} OPJU</span>
                            )}
                            {event.externalCount > 0 && (
                              <span className="text-xs bg-[#fbe3d9] text-[#a33517] font-bold px-1.5 py-0.5 rounded-full border border-black/30">{event.externalCount} ext</span>
                            )}
                          </>
                        )}
                        {event.participantCount === 0 && (
                          <span className="text-[#1a0505]/50">No registrations yet</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border-2 border-black ${label.bg} ${label.color}`}>{label.text}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket-stub footer */}
        <div className="relative bg-[#f5c928] text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl flex items-stretch overflow-hidden">
          <span aria-hidden className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#f6efdf] border-2 border-black" />
          <span aria-hidden className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#f6efdf] border-2 border-black" />
          <div className="flex-1 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Admit one · Management</p>
            <p className={`text-xl sm:text-2xl leading-tight mt-1 ${display.className}`}>Techno-aiMBiAtion 2027</p>
            <p className="text-sm font-semibold uppercase tracking-wide mt-1">
              {totalCount} events · {participantCounts.total} participants · {openCount} open · {liveCount} live
            </p>
          </div>
          <div className="border-l-2 border-dashed border-black px-5 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Admin</p>
            <p className={`text-2xl ${display.className}`}>{firstName[0]?.toUpperCase()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
