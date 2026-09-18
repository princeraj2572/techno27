export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventByIdAction } from "@/actions/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, CalendarDays, Users, Trophy, UsersRound } from "lucide-react";
import Link from "next/link";

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getUser();
  if (!viewer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(viewer.role)) redirect("/dashboard");

  const { id } = await params;
  const event = await getEventByIdAction(id);
  if (!event) notFound();

  await connectToDatabase();
  const teams = await Team.find({ event: id }).lean();
  const allEmails = teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members]);
  const uniqueEmails = [...new Set(allEmails)];
  const users = await User.find({ email: { $in: uniqueEmails } })
    .select("fullName email role enrollmentNumber participantId")
    .lean();

  const usersMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string }) => [u.email, u])
  );
  const teamList = JSON.parse(JSON.stringify(teams));

  const STATUS_LABEL: Record<string, { text: string; color: string }> = {
    REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
    EVENT_LIVE:          { text: "Live now",  color: "text-indigo-600"  },
    COMPLETED:           { text: "Completed", color: "text-slate-400"   },
    CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
    REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
    TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
  };

  const label = STATUS_LABEL[String(event.status)] ?? { text: String(event.status).replace(/_/g, " "), color: "text-slate-400" };
  const registered = event.registeredCount ?? teamList.length;
  const limit = event.maxParticipants ?? 0;
  const fillPct = limit > 0 ? Math.round((registered / limit) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/events" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Events
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{event.name}</h1>
            <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {viewer.role === "DEV_ADMIN" && (
              <Link href={`/dev/events/${id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Manage →
              </Link>
            )}
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-200 mb-3">Registered</p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">{registered}</p>
            <p className="text-xs text-indigo-300 mt-2">teams</p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-400 mb-3">Limit</p>
            <p className="text-4xl font-bold text-indigo-900 tabular-nums leading-none">{limit || "∞"}</p>
            <p className="text-xs text-indigo-400 mt-2">max participants</p>
          </div>
          <div className={`rounded-2xl p-4 ${event.prizeMoney ? "bg-amber-500" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${event.prizeMoney ? "text-amber-100" : "text-slate-400"}`}>Prize pool</p>
            <p className={`text-2xl font-bold tabular-nums leading-none ${event.prizeMoney ? "text-white" : "text-slate-700"}`}>
              {event.prizeMoney ? `₹${event.prizeMoney}` : "—"}
            </p>
            <p className={`text-xs mt-2 ${event.prizeMoney ? "text-amber-200" : "text-slate-400"}`}>total prizes</p>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {[
            { icon: Users, label: "Team size", value: String(event.teamSize ?? 1) },
            { icon: Trophy, label: "Internal fee", value: `₹${event.internalFee ?? 0}` },
            { icon: Trophy, label: "External fee", value: `₹${event.externalFee ?? 0}` },
            { icon: CalendarDays, label: "Fill", value: limit > 0 ? `${fillPct}%` : "No limit" },
          ].map(({ label: lbl, value }) => (
            <div key={lbl} className="bg-white border border-slate-100 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400">{lbl}</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {limit > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Registration fill</span>
              <span>{registered} / {limit}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-400" : fillPct >= 60 ? "bg-amber-400" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(fillPct, 100)}%` }}
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Teams */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.14s" }}>
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-900">
              Registered teams <span className="text-slate-400 font-normal">({teamList.length})</span>
            </p>
          </div>

          {teamList.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-sm text-slate-400">No registrations yet</p>
            </div>
          ) : (
            teamList.map((t: { _id: string; leader: string; members: string[] }) => {
              const leaderUser = usersMap[t.leader] as { fullName?: string; role?: string } | undefined;
              const isExternal = leaderUser?.role === "EXTERNAL_USER";
              return (
                <div key={t._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isExternal ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {(leaderUser?.fullName ?? t.leader)[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{leaderUser?.fullName ?? t.leader}</p>
                    <p className="text-xs text-slate-400 truncate">{t.leader}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">{t.members.length} member(s)</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      isExternal ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {isExternal ? "External" : "OPJU"}
                    </span>
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
