export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { getAllEventsAction } from "@/actions/event-actions";
import { CalendarDays, Users, CheckSquare, UsersRound, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";

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

const QUICK_LINKS = [
  { label: "Participants", icon: Users,        desc: "Registered participants", key: "participants", color: "bg-sky-600"     },
  { label: "Teams",        icon: UsersRound,   desc: "Team rosters",            key: "teams",        color: "bg-violet-600"  },
  { label: "Check-In",     icon: CheckSquare,  desc: "Mark attendance",         key: "checkin",      color: "bg-emerald-600" },
  { label: "Schedule",     icon: CalendarDays, desc: "Event timetable",         key: "schedule",     color: "bg-amber-500"   },
  { label: "Reports",      icon: ClipboardList,desc: "Export event data",       key: "reports",      color: "bg-rose-500"    },
];

type EventRow = {
  _id: string; name: string; status: string; category?: string;
  teamSize?: number; maxParticipants?: number; prizeMoney?: number;
};

async function getAssignedEvents(userId: string, role: string) {
  await connectToDatabase();

  if (role === "DEV_ADMIN" || role === "MANAGEMENT_ADMIN") {
    const events = await getAllEventsAction().catch(() => []);
    return events as EventRow[];
  }

  const assignment = await ManagementAssignment.findOne({ userId, isActive: true })
    .populate("eventIds")
    .lean();

  if (!assignment || !assignment.eventIds?.length) return [];

  const populated = assignment.eventIds as unknown as EventRow[];
  return JSON.parse(JSON.stringify(populated)) as EventRow[];
}

export default async function EventManagerPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const assignedEvents = await getAssignedEvents(String(user._id), user.role).catch(() => []);
  const firstName = user.fullName.split(" ")[0];

  const liveCount = assignedEvents.filter((e) => e.status === "EVENT_LIVE").length;
  const openCount = assignedEvents.filter((e) => e.status === "REGISTRATION_OPEN").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Event Manager</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Events</h1>
            <p className="text-xs text-slate-400 mt-0.5">Techno-aiMBiAtion 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-orange-600 font-mono">
              {user.role.replace(/_/g, " ")}
            </code>
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-orange-500 rounded-2xl p-4">
            <p className="text-xs font-medium text-orange-100 mb-3">Assigned events</p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">{assignedEvents.length}</p>
            <p className="text-xs text-orange-200 mt-2">total</p>
          </div>
          <div className={`rounded-2xl p-4 ${openCount > 0 ? "bg-emerald-500" : "bg-white border border-slate-200"}`}>
            <p className={`text-xs font-medium mb-3 ${openCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Registration open</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${openCount > 0 ? "text-white" : "text-slate-700"}`}>{openCount}</p>
            <p className={`text-xs mt-2 ${openCount > 0 ? "text-emerald-200" : "text-slate-400"}`}>events</p>
          </div>
          <div className={`rounded-2xl p-4 ${liveCount > 0 ? "bg-blue-600" : "bg-white border border-slate-200"}`}>
            <p className={`text-xs font-medium mb-3 ${liveCount > 0 ? "text-blue-100" : "text-slate-400"}`}>Live now</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${liveCount > 0 ? "text-white" : "text-slate-700"}`}>{liveCount}</p>
            <p className={`text-xs mt-2 ${liveCount > 0 ? "text-blue-200" : "text-slate-400"}`}>events</p>
          </div>
        </div>

        {/* Assigned events list */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Assigned events</p>
          {assignedEvents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center bg-white">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No events assigned yet</p>
              <p className="text-xs text-slate-400 mt-1">Contact a Management Admin to get events assigned</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {assignedEvents.map((event) => {
                const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
                const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-100" };
                return (
                  <Link
                    key={event._id}
                    href={`/event-manager/${event._id}`}
                    className={`flex items-center gap-3 px-4 py-3.5 border-l-4 ${border} hover:bg-slate-50 transition-colors`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {[
                          event.category,
                          event.teamSize && `Team: ${event.teamSize}`,
                          event.maxParticipants && `Limit: ${event.maxParticipants}`,
                          event.prizeMoney && `Prize: â‚¹${event.prizeMoney}`,
                        ].filter(Boolean).join(" Â· ")}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>{label.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick access */}
        {assignedEvents.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: "0.14s" }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick access Â· {assignedEvents[0].name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {QUICK_LINKS.map(({ label, icon: Icon, desc, key, color }) => (
                <Link key={key} href={`/event-manager/${assignedEvents[0]._id}/${key}`} className="group">
                  <div className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl px-4 py-4 transition-all h-full flex flex-col gap-3">
                    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug hidden sm:block">{desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
