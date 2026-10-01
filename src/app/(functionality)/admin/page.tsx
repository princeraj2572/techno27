export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventsWithRegistrationCountsAction } from "@/actions/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import {
  Users, CalendarDays, CreditCard, Hotel,
  CheckSquare, UsersRound, ShieldCheck, BarChart2,
  ArrowRight, Megaphone, UserCog,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Participants",    href: "/admin/participants",    icon: Users,       desc: "View and search registrants",     color: "bg-teal-600" },
  { label: "Events",          href: "/admin/events",          icon: CalendarDays,desc: "Monitor event registrations",      color: "bg-sky-600" },
  { label: "Payments",        href: "/admin/payments",        icon: CreditCard,  desc: "Review payment submissions",       color: "bg-violet-600" },
  { label: "Accommodation",   href: "/admin/accommodation",   icon: Hotel,       desc: "Accommodation applications",       color: "bg-amber-500" },
  { label: "Check-In",        href: "/admin/checkin",         icon: CheckSquare, desc: "Manage event check-in",            color: "bg-emerald-600" },
  { label: "Teams",           href: "/admin/teams",           icon: UsersRound,  desc: "All registered teams",             color: "bg-rose-500" },
  { label: "Event Managers",  href: "/admin/event-managers",  icon: ShieldCheck, desc: "Assign event manager access",      color: "bg-orange-500" },
  { label: "Reports",         href: "/admin/reports",         icon: BarChart2,   desc: "Export data and reports",          color: "bg-indigo-600" },
  { label: "Announcements",   href: "/admin/announcements",   icon: Megaphone,   desc: "Post fest announcements",          color: "bg-pink-500" },
  { label: "User Management", href: "/admin/participants",    icon: UserCog,     desc: "Roles and account management",     color: "bg-cyan-600" },
];

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-100" },
  EVENT_LIVE:          { text: "Live",       color: "text-teal-700",    bg: "bg-teal-100"    },
  COMPLETED:           { text: "Completed",  color: "text-slate-500",   bg: "bg-slate-100"   },
  CANCELLED:           { text: "Cancelled",  color: "text-red-700",     bg: "bg-red-100"     },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-700",   bg: "bg-amber-100"   },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-700",  bg: "bg-orange-100"  },
  DRAFT:               { text: "Draft",      color: "text-slate-500",   bg: "bg-slate-100"   },
  UPCOMING:            { text: "Upcoming",   color: "text-blue-700",    bg: "bg-blue-100"    },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-teal-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Management console</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Techno-aiMBiAtion 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-xs border-teal-200 text-teal-700 bg-teal-50"
            >
              {user.role.replace(/_/g, " ")}
            </Badge>
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          <Link href="/admin/events">
            <div className="bg-teal-600 hover:bg-teal-700 transition-colors rounded-2xl p-4 cursor-pointer">
              <p className="text-xs font-medium text-teal-200 mb-3">Total events</p>
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums leading-none">{totalCount}</p>
              <p className="text-xs text-teal-300 mt-2">all events</p>
            </div>
          </Link>

          <div className="rounded-2xl p-4 bg-emerald-500 hover:bg-emerald-600 transition-colors">
            <p className="text-xs font-medium mb-3 text-emerald-100">Open now</p>
            <p className="text-xl sm:text-3xl md:text-4xl font-bold tabular-nums leading-none text-white">{openCount}</p>
            <p className="text-xs mt-2 text-emerald-200">registration open</p>
          </div>

          <div className="rounded-2xl p-4 bg-amber-500 hover:bg-amber-600 transition-colors">
            <p className="text-xs font-medium mb-3 text-amber-100">Live now</p>
            <p className="text-xl sm:text-3xl md:text-4xl font-bold tabular-nums leading-none text-white">{liveCount}</p>
            <p className="text-xs mt-2 text-amber-200">events running</p>
          </div>
        </div>

        {/* Participant stats */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.07s" }}
        >
          <Link href="/admin/participants">
            <div className="bg-teal-600 hover:bg-teal-700 transition-colors rounded-2xl p-4 cursor-pointer">
              <p className="text-xs font-medium text-teal-200 mb-3">Total participants</p>
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums leading-none">{participantCounts.total}</p>
              <p className="text-xs text-teal-300 mt-2">registered</p>
            </div>
          </Link>

          <div className="rounded-2xl p-4 bg-sky-500">
            <p className="text-xs font-medium mb-3 text-sky-100">Internal</p>
            <p className="text-xl sm:text-3xl md:text-4xl font-bold tabular-nums leading-none text-white">{participantCounts.internal}</p>
            <p className="text-xs mt-2 text-sky-200">@opju.ac.in</p>
          </div>

          <div className="rounded-2xl p-4 bg-violet-500">
            <p className="text-xs font-medium mb-3 text-violet-100">External</p>
            <p className="text-xl sm:text-3xl md:text-4xl font-bold tabular-nums leading-none text-white">{participantCounts.external}</p>
            <p className="text-xs mt-2 text-violet-200">outside colleges</p>
          </div>
        </div>

        {/* Navigation grid */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Manage</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href + item.label} href={item.href} className="group">
                  <div className="bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-2xl px-4 py-4 transition-all h-full flex flex-col gap-3">
                    <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug hidden sm:block">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Events overview */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Events overview</p>
            <Link
              href="/admin/events"
              className="text-xs text-teal-600 hover:text-teal-700 transition-colors font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center bg-white">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No events yet</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {events.map((event) => {
                const border = STATUS_BORDER[event.status] ?? "border-l-slate-300";
                const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-100" };
                return (
                  <Link
                    key={event._id}
                    href={`/admin/events/${event._id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 border-l-4 ${border} hover:bg-slate-50 transition-colors`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {event.category && (
                          <span className="text-xs text-slate-400">{event.category}</span>
                        )}
                        {event.participantCount > 0 && (
                          <>
                            {event.category && <span className="text-xs text-slate-300">Â·</span>}
                            <span className="text-xs text-slate-600 font-medium">{event.participantCount} registered</span>
                            {event.internalCount > 0 && (
                              <span className="text-xs bg-sky-100 text-sky-700 font-medium px-1.5 py-0.5 rounded-full">{event.internalCount} OPJU</span>
                            )}
                            {event.externalCount > 0 && (
                              <span className="text-xs bg-violet-100 text-violet-700 font-medium px-1.5 py-0.5 rounded-full">{event.externalCount} ext</span>
                            )}
                          </>
                        )}
                        {event.participantCount === 0 && (
                          <span className="text-xs text-slate-400">No registrations yet</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${label.bg} ${label.color}`}>{label.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
