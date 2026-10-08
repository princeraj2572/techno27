export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { Barlow_Condensed, Dela_Gothic_One } from "next/font/google";
import { getUser } from "@/actions/user-actions";
import { getEventsWithRegistrationCountsAction } from "@/actions/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import {
  Users, CalendarDays, CreditCard, Hotel,
  CheckSquare, UsersRound, ShieldCheck, BarChart2,
  ArrowRight, Megaphone, Contact,
} from "lucide-react";
import Link from "next/link";

// Retro "indie" look inspired by Rendezvous IITD.
const display = Dela_Gothic_One({ weight: "400", subsets: ["latin"] });
const body = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"] });

const CARD = "bg-[#f5edd8] border-2 border-black shadow-[4px_4px_0_0_#000]";

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
    title: "Money & Communication",
    items: [
      { label: "Payments",        href: "/admin/payments",        icon: CreditCard,  desc: "Review payment submissions",       color: "bg-[#ffb10f]" },
      { label: "Reports",         href: "/admin/reports",         icon: BarChart2,   desc: "Export data and reports",          color: "bg-[#ff6a00]" },
      { label: "Announcements",   href: "/admin/announcements",   icon: Megaphone,   desc: "Post fest announcements",          color: "bg-[#f5c928]" },
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
  UPCOMING:            { text: "Upcoming",   color: "text-blue-900",    bg: "bg-blue-200"    },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-600",
  EVENT_LIVE:          "border-l-[#ff6a00]",
  COMPLETED:           "border-l-stone-400",
  CANCELLED:           "border-l-red-600",
  REGISTRATION_CLOSED: "border-l-amber-500",
  TEMPORARILY_CLOSED:  "border-l-orange-500",
};

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
    { label: "Total events",       value: totalCount,                 sub: "all events",        bg: "bg-[#f5c928]", href: "/admin/events" },
    { label: "Open now",           value: openCount,                  sub: "registration open", bg: "bg-[#ff6a00]" },
    { label: "Live now",           value: liveCount,                  sub: "events running",    bg: "bg-[#c8421f]", light: true },
    { label: "Total participants", value: participantCounts.total,    sub: "registered",        bg: "bg-[#f5c928]", href: "/admin/participants" },
    { label: "Internal",           value: participantCounts.internal, sub: "@opju.ac.in",       bg: "bg-[#f5edd8]" },
    { label: "External",           value: participantCounts.external, sub: "outside colleges",  bg: "bg-[#ffb10f]" },
  ];

  return (
    <div
      className={`min-h-screen bg-[#4a0e0e] text-[#1a0505] ${body.className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(245,237,216,0.07) 1px, transparent 1px), linear-gradient(180deg, #3a0808 0%, #4a0e0e 40%, #5a1212 100%)",
        backgroundSize: "6px 6px, 100% 100%",
      }}
    >
      <style>{`
        @keyframes indie-spin { to { transform: rotate(360deg); } }
        @keyframes indie-marquee { to { transform: translateX(-50%); } }
        @keyframes indie-wobble { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(-3deg); } }
        @media (prefers-reduced-motion: reduce) {
          .indie-anim { animation: none !important; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="relative flex items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          {/* Spinning vinyl */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="indie-anim pointer-events-none absolute -top-6 right-16 sm:right-24 w-28 h-28 sm:w-36 sm:h-36 opacity-40"
            style={{ animation: "indie-spin 12s linear infinite" }}
          >
            <circle cx="50" cy="50" r="48" fill="#1a0505" stroke="#000" strokeWidth="2" />
            {[40, 34, 28, 22].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#7a1c1c" strokeWidth="0.8" />
            ))}
            <circle cx="50" cy="50" r="15" fill="#f5c928" stroke="#000" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="3" fill="#4a0e0e" />
          </svg>
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.25em] text-[#f5edd8]/60 mb-1">Management console</p>
            <h1 className={`text-4xl sm:text-5xl text-[#f5c928] leading-none ${display.className}`} style={{ textShadow: "3px 3px 0 #7a1c1c" }}>
              Management
            </h1>
            <p className="text-sm uppercase tracking-widest text-[#f5edd8]/70 mt-2">Techno-aiMBiAtion 2027</p>
          </div>
          <div className="relative flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest border-2 border-[#f5edd8]/70 text-[#f5edd8] px-2.5 py-1 rounded-full">
              {user.role.replace(/_/g, " ")}
            </span>
            <div className="w-11 h-11 rounded-full bg-[#f5c928] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center text-black text-lg font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tape banners */}
        <div className="-mx-4 py-3 overflow-hidden animate-slide-up" style={{ animationDelay: "0.03s" }}>
          <div className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-lg py-1.5 -rotate-1 border-y-2 border-black overflow-hidden">
            <div className="indie-anim flex w-max whitespace-nowrap" style={{ animation: "indie-marquee 30s linear infinite" }}>
              {[0, 1].map((n) => (
                <span key={n} className="pr-8">
                  {"Join the riot ✦ Dive into the world of culture ✦ ".repeat(4)}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-xs py-1 rotate-1 -mt-1 border-y-2 border-black overflow-hidden">
            <div className="indie-anim flex w-max whitespace-nowrap" style={{ animation: "indie-marquee 45s linear infinite reverse" }}>
              {[0, 1].map((n) => (
                <span key={n} className="pr-8">
                  {"Registrations ● Check-In ● Payments ● Accommodation ● Teams ● ".repeat(4)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {stats.map((s) => {
            const tile = (
              <div className={`relative ${s.bg} ${s.light ? "text-[#f5edd8]" : "text-black"} border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-4 h-full transition-transform hover:-translate-y-0.5`}>
                {s.label === "Live now" && s.value > 0 && (
                  <span
                    className="indie-anim absolute -top-3 -right-2 bg-[#f5c928] text-black text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-black rounded-full"
                    style={{ animation: "indie-wobble 2s ease-in-out infinite" }}
                  >
                    ● On air
                  </span>
                )}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 opacity-80">{s.label}</p>
                <p className={`text-3xl sm:text-5xl tabular-nums leading-none ${display.className}`}>{s.value}</p>
                <p className="text-xs sm:text-sm uppercase tracking-wide mt-2 opacity-70">{s.sub}</p>
              </div>
            );
            return s.href
              ? <Link key={s.label} href={s.href}>{tile}</Link>
              : <div key={s.label}>{tile}</div>;
          })}
        </div>

        {/* Navigation grid */}
        <div className="animate-slide-up space-y-5" style={{ animationDelay: "0.1s" }}>
          <p className={`text-xl text-[#f5edd8] ${display.className}`}>Manage</p>
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
                      <div className={`${CARD} hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] rounded-xl px-4 py-4 transition-all h-full flex flex-col gap-3`}>
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
        <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xl text-[#f5edd8] ${display.className}`}>Events overview</p>
            <Link
              href="/admin/events"
              className="text-sm font-bold uppercase tracking-wider text-[#f5c928] hover:text-[#ff6a00] transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#f5edd8]/50 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-[#f5edd8]/50" />
              <p className="text-lg font-semibold uppercase tracking-wide text-[#f5edd8]/70">No events yet</p>
            </div>
          ) : (
            <div className={`${CARD} rounded-xl overflow-hidden divide-y-2 divide-dashed divide-black/25`}>
              {events.map((event) => {
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
                              <span className="text-xs bg-sky-200 text-sky-900 font-bold px-1.5 py-0.5 rounded-full border border-black/30">{event.internalCount} OPJU</span>
                            )}
                            {event.externalCount > 0 && (
                              <span className="text-xs bg-violet-200 text-violet-900 font-bold px-1.5 py-0.5 rounded-full border border-black/30">{event.externalCount} ext</span>
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
        <div className="relative bg-[#f5c928] text-black border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl flex items-stretch overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <span aria-hidden className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#4a0e0e] border-2 border-black" />
          <span aria-hidden className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#4a0e0e] border-2 border-black" />
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
