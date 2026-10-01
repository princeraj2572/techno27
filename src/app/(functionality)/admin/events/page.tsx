export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventsWithRegistrationCountsAction } from "@/actions/event-actions";
import { ChevronLeft, CalendarDays, Users, Trophy, UsersRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import StatTile from "./StatTile";

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-100" },
  EVENT_LIVE:          { text: "Live now",  color: "text-teal-700",    bg: "bg-teal-100"    },
  COMPLETED:           { text: "Completed", color: "text-slate-500",   bg: "bg-slate-100"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-700",     bg: "bg-red-100"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-700",   bg: "bg-amber-100"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-700",  bg: "bg-orange-100"  },
  DRAFT:               { text: "Draft",     color: "text-slate-500",   bg: "bg-slate-100"   },
  UPCOMING:            { text: "Upcoming",  color: "text-blue-700",    bg: "bg-blue-100"    },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-teal-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};

export default async function AdminEventsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const { eventsWithCounts: events, totalParticipants, totalInternal, totalExternal, totalTeams } =
    await getEventsWithRegistrationCountsAction().catch(() => ({ eventsWithCounts: [], totalParticipants: 0, totalInternal: 0, totalExternal: 0, totalTeams: 0 })) as {
      eventsWithCounts: Array<{ _id: string; name: string; status: string; category?: string; teamSize?: number; internalFee?: number; externalFee?: number; prizeMoney?: number; teamCount: number; participantCount: number; internalCount: number; externalCount: number }>;
      totalParticipants: number; totalInternal: number; totalExternal: number; totalTeams: number;
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
            <p className="text-xs text-slate-400 mt-0.5">{events.length} events total</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "DEV_ADMIN" && (
              <Link href="/dev/events" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                Registration controls â†’
              </Link>
            )}
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Registration stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <div className="bg-teal-600 rounded-2xl px-4 py-4 shadow-sm">
            <p className="text-xs font-medium text-teal-200 mb-1">Total registered</p>
            <p className="text-3xl font-bold text-white tabular-nums">{totalParticipants}</p>
            <p className="text-xs text-teal-300 mt-1">across all events</p>
          </div>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4 shadow-sm">
            <p className="text-xs font-medium text-indigo-200 mb-1">Total teams</p>
            <p className="text-3xl font-bold text-white tabular-nums">{totalTeams}</p>
            <p className="text-xs text-indigo-300 mt-1">registered</p>
          </div>
          <div className="rounded-2xl px-4 py-4 bg-sky-500 shadow-sm">
            <p className="text-xs font-medium mb-1 text-sky-100">OPJU (Internal)</p>
            <p className="text-3xl font-bold tabular-nums text-white">{totalInternal}</p>
            <p className="text-xs mt-1 text-sky-200">participants</p>
          </div>
          <div className="rounded-2xl px-4 py-4 bg-amber-500 shadow-sm">
            <p className="text-xs font-medium mb-1 text-amber-100">External</p>
            <p className="text-3xl font-bold tabular-nums text-white">{totalExternal}</p>
            <p className="text-xs mt-1 text-amber-200">participants</p>
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {events.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events found</p>
            </div>
          ) : (
            events.map((event) => {
              const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-100" };
              return (
                <Link
                  key={event._id}
                  href={`/admin/events/${event._id}`}
                  className={`block bg-white border border-slate-200 border-l-4 ${border} rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-0.5 transition-all`}
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-base font-bold text-slate-900">{event.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${label.bg} ${label.color}`}>
                          {label.text}
                        </span>
                      </div>
                      {event.category && <p className="text-xs text-slate-400">{event.category}</p>}
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-teal-600">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* Stat grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <StatTile
                      label="Registered"
                      value={event.participantCount}
                      icon={<Users className="h-3.5 w-3.5 text-slate-500" />}
                      bg="bg-slate-100"
                      labelColor="text-slate-500"
                      valueColor="text-slate-900"
                    />
                    <StatTile
                      label="OPJU"
                      value={event.internalCount}
                      bg="bg-sky-50"
                      labelColor="text-sky-500"
                      valueColor="text-sky-700"
                    />
                    <StatTile
                      label="External"
                      value={event.externalCount}
                      bg="bg-amber-50"
                      labelColor="text-amber-600"
                      valueColor="text-amber-700"
                    />
                    <StatTile
                      label="Teams"
                      value={event.teamCount}
                      icon={<UsersRound className="h-3.5 w-3.5" />}
                      bg="bg-indigo-50"
                      labelColor="text-indigo-500"
                      valueColor="text-indigo-700"
                    />
                    <StatTile
                      label="Prize"
                      value={event.prizeMoney ? <>â‚¹{event.prizeMoney}</> : "â€”"}
                      icon={event.prizeMoney ? <Trophy className="h-3.5 w-3.5" /> : null}
                      bg="bg-emerald-50"
                      labelColor="text-emerald-600"
                      valueColor="text-emerald-700"
                      wide
                    />
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
