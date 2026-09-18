export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { ChevronLeft, CalendarDays, Users, Trophy } from "lucide-react";
import Link from "next/link";

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

export default async function AdminEventsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []) as Array<{
    _id: string; name: string; status: string; category?: string;
    teamSize?: number; internalFee?: number; externalFee?: number; prizeMoney?: number;
  }>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
            <p className="text-xs text-slate-400 mt-0.5">{events.length} events total</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "DEV_ADMIN" && (
              <Link href="/dev/events" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Registration controls →
              </Link>
            )}
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
            </div>
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
                <div key={event._id} className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5`}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                      {event.category && <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>}
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {event.teamSize ?? 1}
                      </span>
                      {event.prizeMoney ? (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Trophy className="h-3.5 w-3.5" /> ₹{event.prizeMoney}
                        </span>
                      ) : null}
                      <span className="hidden sm:inline">
                        Int ₹{event.internalFee ?? 0} · Ext ₹{event.externalFee ?? 0}
                      </span>
                      <span className={`font-medium ${label.color}`}>{label.text}</span>
                      <Link href={`/admin/events/${event._id}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
