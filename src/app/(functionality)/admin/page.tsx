export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users, CalendarDays, CreditCard, Hotel,
  CheckSquare, UsersRound, ShieldCheck, BarChart2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Participants", href: "/admin/participants",    icon: Users,       desc: "View and search all registrants" },
  { label: "Events",       href: "/admin/events",          icon: CalendarDays,desc: "Monitor events and registrations" },
  { label: "Payments",     href: "/admin/payments",        icon: CreditCard,  desc: "Review payment submissions" },
  { label: "Accommodation",href: "/admin/accommodation",   icon: Hotel,       desc: "Accommodation applications" },
  { label: "Check-In",     href: "/admin/checkin",         icon: CheckSquare, desc: "Manage event check-in" },
  { label: "Teams",        href: "/admin/teams",           icon: UsersRound,  desc: "All registered teams" },
  { label: "Event Managers",href: "/admin/event-managers", icon: ShieldCheck, desc: "Manage event manager access" },
  { label: "Reports",      href: "/admin/reports",         icon: BarChart2,   desc: "Export data and reports" },
];

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",  color: "text-indigo-600"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
  DRAFT:               { text: "Draft",     color: "text-slate-400"   },
  UPCOMING:            { text: "Upcoming",  color: "text-slate-500"   },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-indigo-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = (await getAllEventsAction().catch(() => [])) as Array<{
    _id: string; name: string; status: string; category?: string;
  }>;

  const openCount  = events.filter((e) => e.status === "REGISTRATION_OPEN").length;
  const liveCount  = events.filter((e) => e.status === "EVENT_LIVE").length;
  const totalCount = events.length;
  const firstName  = user.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-4 animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Management console</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{firstName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Technorollix 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50"
            >
              {user.role.replace(/_/g, " ")}
            </Badge>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────── */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Total events — primary indigo */}
          <Link href="/admin/events">
            <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl p-4">
              <p className="text-xs font-medium text-indigo-200 mb-3">Total events</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{totalCount}</p>
              <p className="text-xs text-indigo-300 mt-2">all events</p>
            </div>
          </Link>

          {/* Open for registration — emerald */}
          <div className={`rounded-2xl p-4 transition-colors ${openCount > 0 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${openCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Open now</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${openCount > 0 ? "text-white" : "text-slate-700"}`}>{openCount}</p>
            <p className={`text-xs mt-2 ${openCount > 0 ? "text-emerald-200" : "text-slate-400"}`}>registration open</p>
          </div>

          {/* Live — amber if any, slate otherwise */}
          <div className={`rounded-2xl p-4 transition-colors ${liveCount > 0 ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${liveCount > 0 ? "text-amber-100" : "text-slate-400"}`}>Live now</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${liveCount > 0 ? "text-white" : "text-slate-700"}`}>{liveCount}</p>
            <p className={`text-xs mt-2 ${liveCount > 0 ? "text-amber-200" : "text-slate-400"}`}>events running</p>
          </div>
        </div>

        {/* ── Navigation grid ────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-xs font-medium text-slate-400 mb-3 tracking-wide">Manage</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white border border-slate-100 border-l-4 border-l-indigo-200 hover:border-l-indigo-500 rounded-2xl px-4 py-4 transition-all h-full">
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                      <Icon className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug hidden sm:block">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* ── Events overview ─────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Events overview</p>
            <Link
              href="/admin/events"
              className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => {
                const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
                const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400" };
                return (
                  <div
                    key={event._id}
                    className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                        {event.category && (
                          <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                        <Link
                          href={`/admin/events/${event._id}`}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
