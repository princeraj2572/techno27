export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventStatsAction } from "@/actions/event-actions";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays, Users, Shield, Sprout,
  CreditCard, Hotel, FileText, Database,
  ArrowRight, TrendingUp,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Events",       href: "/dev/events",       icon: CalendarDays, desc: "Full event control" },
  { label: "Users",        href: "/dev/users",         icon: Users,        desc: "All user accounts" },
  { label: "Management",   href: "/dev/management",    icon: Shield,       desc: "Management accounts" },
  { label: "Seed Events",  href: "/dev/seed",          icon: Sprout,       desc: "Insert test data" },
  { label: "Payments",     href: "/dev/payments",      icon: CreditCard,   desc: "All transactions" },
  { label: "Accommodation",href: "/dev/accommodation", icon: Hotel,        desc: "Accommodation data" },
  { label: "Audit Logs",   href: "/dev/logs",          icon: FileText,     desc: "System activity" },
  { label: "System",       href: "/dev/system",        icon: Database,     desc: "DB health & stats" },
];

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",  color: "text-indigo-600"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-indigo-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};

export default async function DevDashboardPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const stats = await getEventStatsAction().catch(() => ({
    totalUsers: 0,
    internalCount: 0,
    externalCount: 0,
    eventStats: [] as Array<{ eventId: string; name: string; registered: number; limit: number; status: string }>,
  }));

  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-4 animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Dev control center</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{firstName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Technorollix 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 font-mono">
              DEV_ADMIN
            </code>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── User stats ─────────────────────────────────── */}
        <div
          className="grid grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Total — primary indigo */}
          <Link href="/dev/users">
            <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl p-4">
              <p className="text-xs font-medium text-indigo-200 mb-3">Total users</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{stats.totalUsers}</p>
              <p className="text-xs text-indigo-300 mt-2">registered</p>
            </div>
          </Link>

          {/* Internal — light indigo */}
          <div className="bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-400 mb-3">OPJU (internal)</p>
            <p className="text-4xl font-bold text-indigo-900 tabular-nums leading-none">{stats.internalCount}</p>
            <p className="text-xs text-indigo-400 mt-2">@opju.ac.in</p>
          </div>

          {/* External — amber */}
          <div className={`rounded-2xl p-4 transition-colors ${stats.externalCount > 0 ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${stats.externalCount > 0 ? "text-amber-100" : "text-slate-400"}`}>External</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${stats.externalCount > 0 ? "text-white" : "text-slate-700"}`}>{stats.externalCount}</p>
            <p className={`text-xs mt-2 ${stats.externalCount > 0 ? "text-amber-200" : "text-slate-400"}`}>outside colleges</p>
          </div>
        </div>

        {/* ── Navigation grid ────────────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-xs font-medium text-slate-400 mb-3 tracking-wide">Control</p>
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

        {/* ── Event registration table ────────────────────── */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Event registration</p>
            <Link
              href="/dev/events"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              Manage events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.eventStats.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events found</p>
              <Link href="/dev/seed" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Seed events to get started
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.eventStats.map((ev) => {
                const pct    = ev.limit > 0 ? Math.round((ev.registered / ev.limit) * 100) : 0;
                const border = STATUS_BORDER[ev.status] ?? "border-l-slate-200";
                const label  = STATUS_LABEL[ev.status]  ?? { text: ev.status.replace(/_/g, " "), color: "text-slate-400" };

                return (
                  <div
                    key={ev.eventId}
                    className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Name */}
                      <p className="text-sm font-semibold text-slate-900 min-w-0 flex-1 truncate">
                        {ev.name}
                      </p>

                      {/* Registration count */}
                      <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                        {ev.registered}
                        <span className="text-xs font-normal text-slate-400">
                          /{ev.limit || "∞"}
                        </span>
                      </span>

                      {/* Fill bar */}
                      {ev.limit > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-amber-400" : "bg-indigo-500"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 tabular-nums w-8">{pct}%</span>
                        </div>
                      )}

                      {/* Status */}
                      <span className={`text-xs font-medium shrink-0 ${label.color}`}>
                        {label.text}
                      </span>

                      {/* Link */}
                      <Link
                        href={`/dev/events/${ev.eventId}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick links ─────────────────────────────────── */}
        <div
          className="flex items-center gap-2 text-xs text-slate-400 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>
            {stats.totalUsers} total users ·{" "}
            {stats.internalCount} internal · {stats.externalCount} external
          </span>
        </div>

      </div>
    </div>
  );
}
