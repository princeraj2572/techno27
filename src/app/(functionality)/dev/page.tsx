export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getEventStatsAction } from "@/features/events/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";
import { Event } from "@/features/events/event.model";
import {
  CalendarDays, Users, Shield, Sprout,
  CreditCard, Hotel, FileText, Database,
  ArrowRight, TrendingUp, UserCog,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Events",        href: "/dev/events",       icon: CalendarDays, desc: "Full event control",    color: "bg-teal-600"    },
  { label: "Users",         href: "/dev/users",         icon: Users,        desc: "All user accounts",     color: "bg-sky-600"     },
  { label: "Management",    href: "/dev/management",    icon: Shield,       desc: "Management accounts",   color: "bg-violet-600"  },
  { label: "Seed Events",   href: "/dev/seed",          icon: Sprout,       desc: "Insert test data",      color: "bg-emerald-600" },
  { label: "Payments",      href: "/dev/payments",      icon: CreditCard,   desc: "All transactions",      color: "bg-amber-500"   },
  { label: "Accommodation", href: "/dev/accommodation", icon: Hotel,        desc: "Accommodation data",    color: "bg-rose-500"    },
  { label: "Audit Logs",    href: "/dev/logs",          icon: FileText,     desc: "System activity",       color: "bg-slate-600"   },
  { label: "System",        href: "/dev/system",        icon: Database,     desc: "DB health & stats",     color: "bg-indigo-600"  },
];

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-100" },
  EVENT_LIVE:          { text: "Live",       color: "text-blue-700",    bg: "bg-blue-100"    },
  COMPLETED:           { text: "Completed",  color: "text-slate-500",   bg: "bg-slate-100"   },
  CANCELLED:           { text: "Cancelled",  color: "text-red-700",     bg: "bg-red-100"     },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-700",   bg: "bg-amber-100"   },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-700",  bg: "bg-orange-100"  },
  DRAFT:               { text: "Draft",      color: "text-slate-500",   bg: "bg-slate-100"   },
  UPCOMING:            { text: "Upcoming",   color: "text-sky-700",     bg: "bg-sky-100"     },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-blue-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
  DRAFT:               "border-l-slate-200",
  UPCOMING:            "border-l-sky-400",
};

async function getManagementStats() {
  await connectToDatabase();

  const [mgmtAdminCount, eventManagers, assignments] = await Promise.all([
    User.countDocuments({ role: "MANAGEMENT_ADMIN" }),
    User.find({ role: "EVENT_MANAGER" })
      .select("fullName email createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    ManagementAssignment.find({ isActive: true })
      .select("userId eventIds")
      .lean(),
  ]);

  const assignmentMap: Record<string, string[]> = {};
  for (const a of assignments) {
    assignmentMap[String(a.userId)] = (a.eventIds as unknown[]).map(String);
  }

  const allEventIds = [...new Set(Object.values(assignmentMap).flat())];
  const events = allEventIds.length
    ? await Event.find({ _id: { $in: allEventIds } }).select("name status").lean()
    : [];

  const eventMap: Record<string, { name: string; status: string }> = {};
  for (const e of events) {
    eventMap[String(e._id)] = { name: e.name as string, status: e.status as string };
  }

  const managers = JSON.parse(JSON.stringify(eventManagers)).map((m: {
    _id: string; fullName: string; email: string;
  }) => ({
    ...m,
    assignedEvents: (assignmentMap[m._id] ?? []).map((id) => ({
      id,
      name: eventMap[id]?.name ?? "Unknown event",
      status: eventMap[id]?.status ?? "DRAFT",
    })),
  }));

  return { mgmtAdminCount, managers };
}

export default async function DevDashboardPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const [stats, mgmt] = await Promise.all([
    getEventStatsAction().catch(() => ({
      totalUsers: 0,
      internalCount: 0,
      externalCount: 0,
      eventStats: [] as Array<{ eventId: string; name: string; registered: number; limit: number; status: string }>,
    })),
    getManagementStats().catch(() => ({ mgmtAdminCount: 0, managers: [] })),
  ]);

  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Dev control center</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Developer</h1>
            <p className="text-xs text-slate-400 mt-0.5">Techno-aiMBiAtion 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg text-indigo-600 font-mono">
              DEV_ADMIN
            </code>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* User stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <Link href="/dev/users">
            <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl p-4 cursor-pointer">
              <p className="text-xs font-medium text-indigo-200 mb-3">Total users</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{stats.totalUsers}</p>
              <p className="text-xs text-indigo-300 mt-2">registered</p>
            </div>
          </Link>
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
            <p className="text-xs font-medium text-sky-500 mb-3">OPJU (internal)</p>
            <p className="text-4xl font-bold text-sky-900 tabular-nums leading-none">{stats.internalCount}</p>
            <p className="text-xs text-sky-400 mt-2">@opju.ac.in</p>
          </div>
          <div className={`rounded-2xl p-4 transition-colors ${stats.externalCount > 0 ? "bg-violet-600 hover:bg-violet-700" : "bg-white border border-slate-200"}`}>
            <p className={`text-xs font-medium mb-3 ${stats.externalCount > 0 ? "text-violet-200" : "text-slate-400"}`}>External</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${stats.externalCount > 0 ? "text-white" : "text-slate-700"}`}>{stats.externalCount}</p>
            <p className={`text-xs mt-2 ${stats.externalCount > 0 ? "text-violet-300" : "text-slate-400"}`}>outside colleges</p>
          </div>
        </div>

        {/* Management stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <Link href="/dev/management">
            <div className="bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-2xl p-4 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-xs font-medium text-slate-500">Management Admins</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">{mgmt.mgmtAdminCount}</p>
              <p className="text-xs text-teal-600 mt-2 font-medium">View all â†’</p>
            </div>
          </Link>
          <Link href="/dev/management">
            <div className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-4 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-orange-500 flex items-center justify-center">
                  <UserCog className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-xs font-medium text-slate-500">Event Managers</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">{mgmt.managers.length}</p>
              <p className="text-xs text-orange-500 mt-2 font-medium">Manage assignments â†’</p>
            </div>
          </Link>
        </div>

        {/* Navigation grid */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Control</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-2xl px-4 py-4 transition-all h-full flex flex-col gap-3">
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

        {/* Event Managers list */}
        <div className="animate-slide-up" style={{ animationDelay: "0.13s" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Event Managers</p>
            <Link href="/dev/management" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {mgmt.managers.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center bg-white">
              <UserCog className="h-7 w-7 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No event managers yet</p>
              <Link href="/dev/management/create" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Create one â†’
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {mgmt.managers.map((m: {
                _id: string; fullName: string; email: string;
                assignedEvents: Array<{ id: string; name: string; status: string }>;
              }) => (
                <div key={m._id} className="px-4 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700 shrink-0">
                      {m.fullName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{m.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{m.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${m.assignedEvents.length > 0 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-400"}`}>
                      {m.assignedEvents.length} event{m.assignedEvents.length !== 1 ? "s" : ""}
                    </span>
                    <Link href={`/dev/management/${m._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
                      Assign â†’
                    </Link>
                  </div>
                  {m.assignedEvents.length > 0 && (
                    <div className="mt-2 pl-11 flex flex-wrap gap-1.5">
                      {m.assignedEvents.map((ev) => {
                        const sl = STATUS_LABEL[ev.status];
                        return (
                          <span key={ev.id} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            {ev.name}
                            {sl && <span className={`font-semibold ${sl.color}`}>Â· {sl.text}</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event registration table */}
        <div className="animate-slide-up" style={{ animationDelay: "0.18s" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Event registration</p>
            <Link href="/dev/events" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Manage events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.eventStats.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center bg-white">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No events found</p>
              <Link href="/dev/seed" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Seed events to get started
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {stats.eventStats.map((ev) => {
                const pct    = ev.limit && ev.limit > 0 ? Math.round((ev.registered / ev.limit) * 100) : 0;
                const border = STATUS_BORDER[ev.status] ?? "border-l-slate-300";
                const label  = STATUS_LABEL[ev.status]  ?? { text: ev.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-100" };
                return (
                  <div key={ev.eventId} className={`flex items-center gap-4 px-4 py-3.5 border-l-4 ${border} hover:bg-slate-50 transition-colors`}>
                    <p className="text-sm font-semibold text-slate-900 min-w-0 flex-1 truncate">{ev.name}</p>
                    <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                      {ev.registered}<span className="text-xs font-normal text-slate-400">/{ev.limit || "âˆž"}</span>
                    </span>
                    {ev.limit != null && ev.limit > 0 && (
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
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>{label.text}</span>
                    <Link href={`/dev/events/${ev.eventId}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0 flex items-center gap-1">
                      Manage <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer summary */}
        <div className="flex items-center gap-2 text-xs text-slate-400 animate-slide-up" style={{ animationDelay: "0.22s" }}>
          <TrendingUp className="h-3.5 w-3.5" />
          <span>
            {stats.totalUsers} total users Â· {stats.internalCount} internal Â· {stats.externalCount} external Â·{" "}
            {mgmt.managers.length} event manager{mgmt.managers.length !== 1 ? "s" : ""}
          </span>
        </div>

      </div>
    </div>
  );
}
