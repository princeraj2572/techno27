import GenerateAllEMButton from "./GenerateAllEMButton";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { ChevronLeft, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import QuickStatusToggle from "./QuickStatusToggle";

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

export default async function DevEventsPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);
  const userId = String(user._id ?? "");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
            <p className="text-xs text-slate-400 mt-0.5">{events.length} event(s) total</p>
          </div>
          <div className="flex items-center gap-2">
            <GenerateAllEMButton userId={userId} />
            <Link
              href="/dev/seed"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg px-3 py-2"
            >
              <Plus className="h-3.5 w-3.5" /> Seed
            </Link>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <CalendarDays className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {events.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events yet</p>
              <Link href="/dev/seed" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Seed dummy events →
              </Link>
            </div>
          ) : (
            events.map((event: {
              _id: string; name: string; status: string;
              teamSize?: number; internalFee?: number; externalFee?: number; prizeMoney?: number;
              category?: string;
            }) => {
              const border = STATUS_BORDER[event.status] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[event.status]  ?? { text: event.status.replace(/_/g, " "), color: "text-slate-400" };
              return (
                <div key={event._id} className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{event.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {[
                        event.category,
                        `Team: ${event.teamSize ?? 1}`,
                        `Internal: ₹${event.internalFee ?? 0}`,
                        `External: ₹${event.externalFee ?? 0}`,
                        event.prizeMoney ? `Prize: ₹${event.prizeMoney}` : null,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${label.color}`}>{label.text}</span>
                  <QuickStatusToggle eventId={event._id} currentStatus={event.status} currentUserId={userId} />
                  <Link href={`/dev/events/${event._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
                    Manage →
                  </Link>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
