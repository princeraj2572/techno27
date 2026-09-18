export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventManagerPermissions } from "@/actions/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { CheckIn } from "@/models/checkIn.model";
import { ChevronLeft, CheckSquare, QrCode, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

async function getData(eventId: string) {
  await connectToDatabase();

  const event = await Event.findById(eventId).select("name status").lean();
  if (!event) return null;

  const teams = await Team.find({ event: eventId }).lean();
  const allEmails = [...new Set(
    teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members])
  )];

  const [users, checkIns] = await Promise.all([
    User.find({ email: { $in: allEmails } })
      .select("email fullName enrollmentNumber participantId role")
      .lean(),
    CheckIn.find({ eventId }).select("userId checkedInAt method").lean(),
  ]);

  const checkedInIds = new Set(
    JSON.parse(JSON.stringify(checkIns)).map((c: { userId: string }) => c.userId)
  );

  return {
    event: JSON.parse(JSON.stringify(event)) as { _id: string; name: string; status: string },
    participants: JSON.parse(JSON.stringify(users)).map((u: {
      _id: string; email: string; fullName?: string; role?: string;
      enrollmentNumber?: string; participantId?: string;
    }) => ({
      ...u,
      checkedIn: checkedInIds.has(u._id),
    })),
    checkedInCount: checkedInIds.size,
  };
}

export default async function EventManagerCheckinPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role)) redirect("/dashboard");

  const { eventId } = await params;

  if (user.role === "EVENT_MANAGER") {
    const { hasAccess } = await getEventManagerPermissions(String(user._id), eventId).catch(() => ({ hasAccess: false }));
    if (!hasAccess) redirect("/event-manager");
  }

  const data = await getData(eventId).catch(() => null);
  if (!data) redirect("/event-manager");

  const { event, participants, checkedInCount } = data;

  type Participant = {
    _id: string; email: string; fullName?: string; role?: string;
    enrollmentNumber?: string; participantId?: string; checkedIn: boolean;
  };

  const notCheckedIn = (participants as Participant[]).filter((p) => !p.checkedIn);
  const checkedIn    = (participants as Participant[]).filter((p) => p.checkedIn);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href={`/event-manager/${eventId}`} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> {event.name}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Check-In</h1>
            <p className="text-xs text-slate-400 mt-0.5">{participants.length} registered · {checkedInCount} checked in</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <CheckSquare className="h-4 w-4 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Registered</p>
            <p className="text-2xl font-bold text-white tabular-nums">{participants.length}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${checkedInCount > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${checkedInCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Checked in</p>
            <p className={`text-2xl font-bold tabular-nums ${checkedInCount > 0 ? "text-white" : "text-slate-700"}`}>{checkedInCount}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${notCheckedIn.length > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${notCheckedIn.length > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-2xl font-bold tabular-nums ${notCheckedIn.length > 0 ? "text-white" : "text-slate-700"}`}>{notCheckedIn.length}</p>
          </div>
        </div>

        {/* QR scanner info */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-5 flex items-start gap-4 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
            <QrCode className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">QR check-in</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Scan participant QR codes at the venue to mark check-in. Profile photo is shown for identity verification. Coming soon.
            </p>
          </div>
        </div>

        {/* Not checked in */}
        {notCheckedIn.length > 0 && (
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-xs font-medium text-slate-400">Pending check-in ({notCheckedIn.length})</p>
            {notCheckedIn.map((p: Participant) => (
              <div key={p._id} className="bg-white border border-slate-100 border-l-4 border-l-amber-300 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  p.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {(p.fullName ?? p.email)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName ?? p.email}</p>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                </div>
                {(p.enrollmentNumber ?? p.participantId) && (
                  <code className="text-xs font-mono text-slate-400 shrink-0">{p.enrollmentNumber ?? p.participantId}</code>
                )}
                <span className="text-xs font-medium text-amber-600 flex items-center gap-1 shrink-0">
                  <Clock className="h-3.5 w-3.5" /> Pending
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Checked in */}
        {checkedIn.length > 0 && (
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.12s" }}>
            <p className="text-xs font-medium text-slate-400">Checked in ({checkedIn.length})</p>
            {checkedIn.map((p: Participant) => (
              <div key={p._id} className="bg-white border border-slate-100 border-l-4 border-l-emerald-400 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  p.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {(p.fullName ?? p.email)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName ?? p.email}</p>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                </div>
                {(p.enrollmentNumber ?? p.participantId) && (
                  <code className="text-xs font-mono text-slate-400 shrink-0">{p.enrollmentNumber ?? p.participantId}</code>
                )}
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
                </span>
              </div>
            ))}
          </div>
        )}

        {participants.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
            <CheckSquare className="h-8 w-8 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No participants registered yet</p>
          </div>
        )}

      </div>
    </div>
  );
}
