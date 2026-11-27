export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";
import { getAllEventsAction } from "@/features/events/event-actions";
import { CalendarDays, Users, CheckSquare, UsersRound, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { TicketTitle } from "@/components/indie/gold-poster";

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

const QUICK_LINKS = [
  { label: "Participants", icon: Users,        desc: "Registered participants", key: "participants", color: "bg-[#0f6b63]"     },
  { label: "Teams",        icon: UsersRound,   desc: "Team rosters",            key: "teams",        color: "bg-[#c8421f]"  },
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

  if (role === "DEV_ADMIN") {
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
  if (!user || !["DEV_ADMIN", "EVENT_MANAGER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const assignedEvents = await getAssignedEvents(String(user._id), user.role).catch(() => []);
  const firstName = user.fullName.split(" ")[0];

  const liveCount = assignedEvents.filter((e) => e.status === "EVENT_LIVE").length;
  const openCount = assignedEvents.filter((e) => e.status === "REGISTRATION_OPEN").length;

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center flex-wrap justify-between gap-x-4 gap-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Event Manager</p>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">My Events</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">Techno-aiMBiAtion 2027</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border-2 border-[#1c1812] bg-[#0f6b63] px-3 py-1 text-[10px] font-extrabold uppercase text-white sm:text-xs">
              {user.role.replace(/_/g, " ")}
            </span>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] border-[#1c1812] bg-[#f5c928] text-lg font-extrabold text-[#1c1812] shadow-[0_4px_0_#1c1812]">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#c8421f] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl p-4">
            <p className="text-xs font-medium text-orange-100 mb-3">Assigned events</p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">{assignedEvents.length}</p>
            <p className="text-xs text-orange-200 mt-2">total</p>
          </div>
          <div className={`rounded-2xl p-4 ${openCount > 0 ? "bg-[#0f6b63] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"}`}>
            <p className={`text-xs font-medium mb-3 ${openCount > 0 ? "text-emerald-100" : "text-slate-500"}`}>Registration open</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${openCount > 0 ? "text-white" : "text-slate-700"}`}>{openCount}</p>
            <p className={`text-xs mt-2 ${openCount > 0 ? "text-emerald-200" : "text-slate-500"}`}>events</p>
          </div>
          <div className={`rounded-2xl p-4 ${liveCount > 0 ? "bg-[#c8421f] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"}`}>
            <p className={`text-xs font-medium mb-3 ${liveCount > 0 ? "text-blue-100" : "text-slate-500"}`}>Live now</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${liveCount > 0 ? "text-white" : "text-slate-700"}`}>{liveCount}</p>
            <p className={`text-xs mt-2 ${liveCount > 0 ? "text-blue-200" : "text-slate-500"}`}>events</p>
          </div>
        </div>

        {/* Assigned events list */}
        <div className="">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Assigned events</p>
          {assignedEvents.length === 0 ? (
            <div className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 py-12 text-center bg-white/60">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No events assigned yet</p>
              <p className="text-xs text-slate-500 mt-1">Contact a Management Admin to get events assigned</p>
            </div>
          ) : (
            <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl overflow-hidden divide-y divide-slate-100">
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
                      <p className="text-xs text-slate-500 mt-0.5">
                        {[
                          event.category,
                          event.teamSize && `Team: ${event.teamSize}`,
                          event.maxParticipants && `Limit: ${event.maxParticipants}`,
                          event.prizeMoney && `Prize: ₹${event.prizeMoney}`,
                        ].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${label.bg} ${label.color}`}>{label.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick access */}
        {assignedEvents.length > 0 && (
          <div className="">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick access · {assignedEvents[0].name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {QUICK_LINKS.map(({ label, icon: Icon, desc, key, color }) => (
                <Link key={key} href={`/event-manager/${assignedEvents[0]._id}/${key}`} className="group">
                  <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-4 py-4 h-full flex flex-col gap-3 card-lift">
                    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug hidden sm:block">{desc}</p>
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
