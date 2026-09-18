export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventsWithRegistrationCountsAction } from "@/actions/event-actions";
import { ChevronLeft, CalendarDays, Users, Trophy } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",  color: "text-teal-600"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
  DRAFT:               { text: "Draft",     color: "text-slate-400"   },
  UPCOMING:            { text: "Upcoming",  color: "text-slate-500"   },
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

  const { eventsWithCounts: events, totalParticipants, totalInternal, totalExternal } =
    await getEventsWithRegistrationCountsAction().catch(() => ({ eventsWithCounts: [], totalParticipants: 0, totalInternal: 0, totalExternal: 0 })) as {
      eventsWithCounts: Array<{ _id: string; name: string; status: string; category?: string; teamSize?: number; internalFee?: number; externalFee?: number; prizeMoney?: number; teamCount: number; participantCount: number; internalCount: number; externalCount: number }>;
      totalParticipants: number; totalInternal: number; totalExternal: number;
    };

  return (
    <div className="min-h-screen bg-white">
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
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <div className="bg-teal-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-teal-200 mb-1">Total registered</p>
            <p className="text-2xl font-bold text-white tabular-nums">{totalParticipants}</p>
            <p className="text-xs text-teal-300 mt-1">across all events</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${totalInternal > 0 ? "bg-teal-50" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${totalInternal > 0 ? "text-teal-500" : "text-slate-400"}`}>OPJU (Internal)</p>
            <p className={`text-2xl font-bold tabular-nums ${totalInternal > 0 ? "text-teal-900" : "text-slate-600"}`}>{totalInternal}</p>
            <p className={`text-xs mt-1 ${totalInternal > 0 ? "text-teal-400" : "text-slate-400"}`}>participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${totalExternal > 0 ? "bg-amber-50 border border-amber-100" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${totalExternal > 0 ? "text-amber-600" : "text-slate-400"}`}>External</p>
            <p className={`text-2xl font-bold tabular-nums ${totalExternal > 0 ? "text-amber-900" : "text-slate-600"}`}>{totalExternal}</p>
            <p className={`text-xs mt-1 ${totalExternal > 0 ? "text-amber-500" : "text-slate-400"}`}>participants</p>
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {events.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events found</p>
            </div>
          ) : (
            events.map((event) => {
              const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400" };
              return (
                <Link key={event._id} href={`/admin/events/${event._id}`} className={`block bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                        {event.category && <span className="text-xs text-slate-400">{event.category}</span>}
                        <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users className="h-3 w-3" /> {event.participantCount} registered
                        </span>
                        {event.internalCount > 0 && (
                          <span className="text-teal-500">{event.internalCount} OPJU</span>
                        )}
                        {event.externalCount > 0 && (
                          <span className="text-amber-600">{event.externalCount} external</span>
                        )}
                        {event.teamCount > 0 && (
                          <span className="text-slate-400">{event.teamCount} team{event.teamCount !== 1 ? "s" : ""}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                      {event.teamSize && event.teamSize > 1 && (
                        <span className="hidden sm:flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {event.teamSize}
                        </span>
                      )}
                      {event.prizeMoney ? (
                        <span className="hidden sm:flex items-center gap-1 text-amber-600 font-medium">
                          <Trophy className="h-3.5 w-3.5" /> â‚¹{event.prizeMoney}
                        </span>
                      ) : null}
                      <span className="text-teal-600 font-medium">View â†’</span>
                    </div>
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
