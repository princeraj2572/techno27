export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventManagerPermissions } from "@/actions/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { Team } from "@/models/team.model";
import { Users, CheckSquare, ChevronLeft } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  EVENT_LIVE:          { text: "Live now",  color: "text-indigo-700",  bg: "bg-indigo-50 border-indigo-200"   },
  COMPLETED:           { text: "Completed", color: "text-slate-500",   bg: "bg-slate-50 border-slate-200"     },
  CANCELLED:           { text: "Cancelled", color: "text-red-600",     bg: "bg-red-50 border-red-200"         },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"     },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-700",  bg: "bg-orange-50 border-orange-200"   },
  DRAFT:               { text: "Draft",     color: "text-slate-500",   bg: "bg-slate-50 border-slate-200"     },
};

async function getEventData(eventId: string) {
  await connectToDatabase();
  const event = await Event.findById(eventId).lean();
  if (!event) return null;
  const registeredCount = await Team.countDocuments({ event: eventId });
  return JSON.parse(JSON.stringify({ ...event, registeredCount })) as {
    _id: string; name: string; status: string; category?: string; description?: string;
    teamSize?: number; maxParticipants?: number; prizeMoney?: number;
    internalFee?: number; externalFee?: number; registeredCount: number;
  };
}

const NAV = [
  { label: "Participants", href: "participants", icon: Users,       desc: "Registered teams" },
  { label: "Teams",        href: "teams",        icon: Users,       desc: "Team rosters"     },
  { label: "Check-In",     href: "checkin",      icon: CheckSquare, desc: "Mark attendance"  },
];

export default async function EventManagerEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const { eventId } = await params;

  // EVENT_MANAGER: verify they're assigned to this event
  if (user.role === "EVENT_MANAGER") {
    const { hasAccess } = await getEventManagerPermissions(String(user._id), eventId).catch(() => ({ hasAccess: false }));
    if (!hasAccess) redirect("/event-manager");
  }

  const event = await getEventData(eventId).catch(() => null);
  if (!event) redirect("/event-manager");

  const statusInfo = STATUS_LABEL[event.status] ?? { text: event.status.replace(/_/g, " "), color: "text-slate-500", bg: "bg-slate-50 border-slate-200" };
  const fillPct = (event.maxParticipants ?? 0) > 0
    ? Math.round((event.registeredCount / (event.maxParticipants ?? 1)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/event-manager" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> My events
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{event.name}</h1>
            {event.category && <p className="text-xs text-slate-400 mt-0.5">{event.category}</p>}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 mt-1 ${statusInfo.color} ${statusInfo.bg}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {[
            { label: "Registered",  value: event.registeredCount, highlight: true },
            { label: "Limit",       value: event.maxParticipants || "∞" },
            { label: "Prize pool",  value: event.prizeMoney ? `₹${event.prizeMoney}` : "—" },
            { label: "Team size",   value: event.teamSize ?? 1 },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl px-4 py-4 ${s.highlight ? "bg-indigo-600" : "bg-slate-50 border border-slate-100"}`}>
              <p className={`text-xs font-medium mb-1 ${s.highlight ? "text-indigo-200" : "text-slate-400"}`}>{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.highlight ? "text-white" : "text-slate-900"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Fill bar */}
        {(event.maxParticipants ?? 0) > 0 && (
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${fillPct >= 90 ? "bg-red-400" : fillPct >= 60 ? "bg-amber-400" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(fillPct, 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 tabular-nums w-10 text-right">{fillPct}%</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-slate-500 leading-relaxed animate-slide-up" style={{ animationDelay: "0.09s" }}>
            {event.description}
          </p>
        )}

        {/* Fees */}
        <div className="flex items-center gap-6 text-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div>
            <p className="text-xs text-slate-400">Internal fee</p>
            <p className="font-semibold text-slate-900">₹{event.internalFee ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">External fee</p>
            <p className="font-semibold text-slate-900">₹{event.externalFee ?? 0}</p>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-medium text-slate-400 mb-3">Manage</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {NAV.map(({ label, href, icon: Icon, desc }) => (
              <Link key={href} href={`/event-manager/${eventId}/${href}`} className="group">
                <div className="bg-white border border-slate-100 border-l-4 border-l-indigo-200 hover:border-l-indigo-500 rounded-2xl px-4 py-4 transition-all h-full">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
