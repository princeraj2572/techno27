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
import { display } from "@/components/indie";
import { GoldBackdrop, INK, TicketTitle } from "@/components/indie/gold-poster";

const NAV_ITEMS = [
  { label: "Events",        href: "/dev/events",       icon: CalendarDays, desc: "Full event control",    color: "bg-[#0f6b63]"    },
  { label: "Users",         href: "/dev/users",         icon: Users,        desc: "All user accounts",     color: "bg-[#ff6a00]"     },
  { label: "Management",    href: "/dev/management",    icon: Shield,       desc: "Management accounts",   color: "bg-[#c8421f]"  },
  { label: "Seed Events",   href: "/dev/seed",          icon: Sprout,       desc: "Insert test data",      color: "bg-[#0f6b63]" },
  { label: "Payments",      href: "/dev/payments",      icon: CreditCard,   desc: "All transactions",      color: "bg-[#ffb10f]"   },
  { label: "Accommodation", href: "/dev/accommodation", icon: Hotel,        desc: "Accommodation data",    color: "bg-[#c8421f]"    },
  { label: "Audit Logs",    href: "/dev/logs",          icon: FileText,     desc: "System activity",       color: "bg-[#1c1812]"   },
  { label: "System",        href: "/dev/system",        icon: Database,     desc: "DB health & stats",     color: "bg-[#ff6a00]"  },
];

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-100" },
  EVENT_LIVE:          { text: "Live",       color: "text-[#1c1812]",    bg: "bg-[#fde9a8]"    },
  COMPLETED:           { text: "Completed",  color: "text-slate-500",   bg: "bg-slate-100"   },
  CANCELLED:           { text: "Cancelled",  color: "text-red-700",     bg: "bg-red-100"     },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-700",   bg: "bg-amber-100"   },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-700",  bg: "bg-orange-100"  },
  DRAFT:               { text: "Draft",      color: "text-slate-500",   bg: "bg-slate-100"   },
  UPCOMING:            { text: "Upcoming",   color: "text-[#1c1812]",     bg: "bg-[#fde9a8]"     },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-[#e9a11a]",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
  DRAFT:               "border-l-slate-200",
  UPCOMING:            "border-l-[#e9a11a]",
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
  const stats5 = [
    { label: "Total users",       value: stats.totalUsers,          sub: "registered",          bg: "bg-[#f5c928]", href: "/dev/users" },
    { label: "OPJU (internal)",   value: stats.internalCount,       sub: "@opju.ac.in",         bg: "bg-white" },
    { label: "External",          value: stats.externalCount,       sub: "outside colleges",    bg: "bg-[#ff6a00]" },
    { label: "Management admins", value: mgmt.mgmtAdminCount,       sub: "view all",            bg: "bg-[#ffb10f]", href: "/dev/management" },
    { label: "Event managers",    value: mgmt.managers.length,      sub: "manage assignments",  bg: "bg-[#c8421f]", href: "/dev/management", light: true },
    { label: "Events",            value: stats.eventStats.length,   sub: "in the database",     bg: "bg-white", href: "/dev/events" },
  ] as Array<{ label: string; value: number; sub: string; bg: string; href?: string; light?: boolean }>;

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Gold header banner (same as Management) */}
        <div className="relative overflow-hidden rounded-3xl border-[3px] px-5 py-6 sm:px-8 sm:py-7" style={{ borderColor: INK, boxShadow: `0 5px 0 ${INK}` }}>
          <GoldBackdrop at="90% 130%" sparkles={false} />
          <div className="relative flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] sm:text-sm" style={{ color: INK }}>Dev control center</p>
              <TicketTitle className="text-4xl leading-[1.05] sm:text-6xl">Developer</TicketTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border-2 bg-[#0f6b63] px-3 py-1 text-[10px] font-extrabold uppercase text-white sm:text-xs" style={{ borderColor: INK }}>Dev admin</span>
                <span className="rounded-full border-2 px-3 py-1 text-[10px] font-extrabold uppercase text-[#f3e8cf] sm:text-xs" style={{ borderColor: INK, background: INK }}>Techno-aiMBiAtion 2027</span>
              </div>
            </div>
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] bg-[#f3e8cf] text-2xl ${display.className}`} style={{ borderColor: INK, color: INK, boxShadow: `0 4px 0 ${INK}` }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stat tiles (fest palette, same as Management) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats5.map((t) => {
            const tile = (
              <div className={`h-full rounded-2xl border-[3px] border-[#1c1812] p-4 shadow-[0_4px_0_#1c1812] ${t.href ? "card-lift" : ""} ${t.bg} ${t.light ? "text-white" : "text-[#1c1812]"}`}>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className={`mt-2 text-4xl leading-none tabular-nums ${display.className}`}>{t.value}</p>
                <p className="mt-2 text-xs font-medium">{t.sub}</p>
              </div>
            );
            return t.href ? <Link key={t.label} href={t.href}>{tile}</Link> : <div key={t.label}>{tile}</div>;
          })}
        </div>

        {/* Navigation grid */}
        <div className="">
          <p className={`mb-3 text-xl ${display.className}`}>Control</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-4 py-4 h-full flex flex-col gap-3 card-lift">
                    <div className={`w-9 h-9 rounded-xl border-2 border-[#1c1812] ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1c1812] leading-tight">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug hidden sm:block">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Event Managers list */}
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xl ${display.className}`}>Event managers</p>
            <Link href="/dev/management" className="text-xs text-[#0f6b63] hover:text-[#0b4f49] font-medium flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {mgmt.managers.length === 0 ? (
            <div className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 py-10 text-center bg-white/60">
              <UserCog className="h-7 w-7 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No event managers yet</p>
              <Link href="/dev/management/create" className="text-xs text-[#0f6b63] hover:underline mt-1 block">
                Create one
              </Link>
            </div>
          ) : (
            <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl overflow-hidden divide-y divide-slate-100">
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
                      <p className="text-sm font-semibold text-[#1c1812]">{m.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{m.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${m.assignedEvents.length > 0 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`}>
                      {m.assignedEvents.length} event{m.assignedEvents.length !== 1 ? "s" : ""}
                    </span>
                    <Link href={`/dev/management/${m._id}`} className="text-xs text-[#0f6b63] hover:text-[#0b4f49] font-medium shrink-0">
                      Assign
                    </Link>
                  </div>
                  {m.assignedEvents.length > 0 && (
                    <div className="mt-2 pl-11 flex flex-wrap gap-1.5">
                      {m.assignedEvents.map((ev) => {
                        const sl = STATUS_LABEL[ev.status];
                        return (
                          <span key={ev.id} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            {ev.name}
                            {sl && <span className={`font-semibold ${sl.color}`}>· {sl.text}</span>}
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
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xl ${display.className}`}>Event registration</p>
            <Link href="/dev/events" className="text-xs text-[#0f6b63] hover:text-[#0b4f49] font-medium flex items-center gap-1">
              Manage events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.eventStats.length === 0 ? (
            <div className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 py-12 text-center bg-white/60">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No events found</p>
              <Link href="/dev/seed" className="text-xs text-[#0f6b63] hover:underline mt-1 block">
                Seed events to get started
              </Link>
            </div>
          ) : (
            <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl overflow-hidden divide-y divide-slate-100">
              {stats.eventStats.map((ev) => {
                const pct    = ev.limit && ev.limit > 0 ? Math.round((ev.registered / ev.limit) * 100) : 0;
                const border = STATUS_BORDER[ev.status] ?? "border-l-slate-300";
                const label  = STATUS_LABEL[ev.status]  ?? { text: ev.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-100" };
                return (
                  <div key={ev.eventId} className={`flex items-center gap-4 px-4 py-3.5 border-l-4 ${border} hover:bg-slate-50 transition-colors`}>
                    <p className="text-sm font-semibold text-[#1c1812] min-w-0 flex-1 truncate">{ev.name}</p>
                    <span className="text-sm font-bold text-[#1c1812] tabular-nums shrink-0">
                      {ev.registered}<span className="text-xs font-normal text-slate-500">/{ev.limit || "∞"}</span>
                    </span>
                    {ev.limit != null && ev.limit > 0 && (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-amber-400" : "bg-[#0f6b63]"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 tabular-nums w-8">{pct}%</span>
                      </div>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>{label.text}</span>
                    <Link href={`/dev/events/${ev.eventId}`} className="text-xs text-[#0f6b63] hover:text-[#0b4f49] font-medium shrink-0 flex items-center gap-1">
                      Manage <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer summary */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>
            {stats.totalUsers} total users · {stats.internalCount} internal · {stats.externalCount} external ·{" "}
            {mgmt.managers.length} event manager{mgmt.managers.length !== 1 ? "s" : ""}
          </span>
        </div>

      </div>
    </div>
  );
}
