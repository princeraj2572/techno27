export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/team.model";
import { Event } from "@/models/event.model";
import { ChevronLeft, UsersRound } from "lucide-react";
import Link from "next/link";

async function getAllTeamsWithEvents() {
  await connectToDatabase();
  const teams = await Team.find().sort({ createdAt: -1 }).lean();
  const eventIds = [...new Set(teams.map((t: { event: unknown }) => String(t.event)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name").lean();
  const eventMap = Object.fromEntries(
    events.map((e: { _id: unknown; name: string }) => [String(e._id), e.name])
  );
  return JSON.parse(JSON.stringify(teams.map((t: { event: unknown }) => ({
    ...t,
    eventName: eventMap[String(t.event)] ?? "Unknown",
  }))));
}

export default async function AdminTeamsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const teams = await getAllTeamsWithEvents().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teams</h1>
            <p className="text-xs text-slate-400 mt-0.5">{teams.length} registered teams</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <UsersRound className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Teams list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {teams.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <UsersRound className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No teams yet</p>
            </div>
          ) : (
            teams.map((t: { _id: string; leader: string; eventName: string; members: string[]; size: number }) => {
              const fillPct = Math.round((t.members.length / t.size) * 100);
              const isFull  = t.members.length >= t.size;
              return (
                <div key={t._id} className="bg-white border border-slate-100 border-l-4 border-l-indigo-300 rounded-xl px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                      {t.leader[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{t.eventName}</p>
                      <p className="text-xs text-slate-400 truncate">{t.leader}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFull ? "bg-emerald-500" : "bg-indigo-500"}`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 tabular-nums">
                          {t.members.length}/{t.size}
                        </span>
                      </div>
                      {isFull && (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                          Full
                        </span>
                      )}
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
