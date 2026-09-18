export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { Event } from "@/models/event.model";
import { getAllEventsAction } from "@/actions/event-actions";
import { CalendarDays, Users, CheckSquare } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",  color: "text-indigo-600"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
  DRAFT:               { text: "Draft",     color: "text-slate-400"   },
  UPCOMING:            { text: "Upcoming",  color: "text-sky-600"     },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-indigo-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
  DRAFT:               "border-l-slate-200",
  UPCOMING:            "border-l-sky-400",
};

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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Event Manager</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{firstName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Technorollix 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 font-mono">
              {user.role.replace(/_/g, " ")}
            </code>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-200 mb-3">Assigned events</p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">{assignedEvents.length}</p>
            <p className="text-xs text-indigo-300 mt-2">total</p>
          </div>
          <div className={`rounded-2xl p-4 ${openCount > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${openCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Registration open</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${openCount > 0 ? "text-white" : "text-slate-700"}`}>{openCount}</p>
            <p className={`text-xs mt-2 ${openCount > 0 ? "text-emerald-200" : "text-slate-400"}`}>events</p>
          </div>
          <div className={`rounded-2xl p-4 ${liveCount > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${liveCount > 0 ? "text-amber-100" : "text-slate-400"}`}>Live now</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${liveCount > 0 ? "text-white" : "text-slate-700"}`}>{liveCount}</p>
            <p className={`text-xs mt-2 ${liveCount > 0 ? "text-amber-200" : "text-slate-400"}`}>events</p>
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-medium text-slate-400">Assigned events</p>
          {assignedEvents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events assigned yet</p>
              <p className="text-xs text-slate-400 mt-1">Contact a Management Admin to get events assigned</p>
            </div>
          ) : (
            assignedEvents.map((event) => {
              const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400" };
              return (
                <div key={event._id} className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {[
                        event.category,
                        event.teamSize && `Team: ${event.teamSize}`,
                        event.maxParticipants && `Limit: ${event.maxParticipants}`,
                        event.prizeMoney && `Prize: ₹${event.prizeMoney}`,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${label.color}`}>{label.text}</span>
                  <Link href={`/event-manager/${event._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
                    Manage →
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Quick access */}
        {assignedEvents.length > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.14s" }}>
            {[
              { label: "Participants",  icon: Users,       desc: "Registered teams",    key: "participants" },
              { label: "Teams",         icon: Users,       desc: "Team rosters",        key: "teams"        },
              { label: "Check-In",      icon: CheckSquare, desc: "Mark attendance",     key: "checkin"      },
            ].map(({ label, icon: Icon, desc, key }) => (
              <Link key={key} href={`/event-manager/${assignedEvents[0]._id}/${key}`} className="group">
                <div className="bg-white border border-slate-100 border-l-4 border-l-indigo-200 hover:border-l-indigo-500 rounded-2xl px-4 py-4 transition-all">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
