export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventManagerPermissions } from "@/actions/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { Team } from "@/models/team.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, UsersRound, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getData(eventId: string, page: number, limit: number) {
  await connectToDatabase();
  const event = await Event.findById(eventId).select("name status teamSize maxParticipants").lean();
  if (!event) return null;
  const teamSize = (event as { teamSize?: number }).teamSize ?? 1;
  const [teams, total, fullCount] = await Promise.all([
    Team.find({ event: eventId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Team.countDocuments({ event: eventId }),
    Team.countDocuments({ event: eventId, $expr: { $gte: [{ $size: "$members" }, teamSize] } }),
  ]);
  return {
    event: JSON.parse(JSON.stringify(event)) as { _id: string; name: string; status: string; teamSize?: number; maxParticipants?: number },
    teams: JSON.parse(JSON.stringify(teams)) as Array<{ _id: string; leader: string; members: string[]; size: number; createdAt?: string }>,
    total,
    fullCount,
  };
}

export default async function EventManagerTeamsPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role)) redirect("/dashboard");

  const { eventId } = await params;
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  if (user.role === "EVENT_MANAGER") {
    const { hasAccess } = await getEventManagerPermissions(String(user._id), eventId).catch(() => ({ hasAccess: false }));
    if (!hasAccess) redirect("/event-manager");
  }

  const data = await getData(eventId, page, limit).catch(() => null);
  if (!data) redirect("/event-manager");

  const { event, teams, total, fullCount } = data;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href={`/event-manager/${eventId}`} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> {event.name}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teams</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {total} team(s) · {fullCount} full
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <UsersRound className="h-4 w-4 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Total teams</p>
            <p className="text-2xl font-bold text-white tabular-nums">{total}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${fullCount > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${fullCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Full</p>
            <p className={`text-2xl font-bold tabular-nums ${fullCount > 0 ? "text-white" : "text-slate-700"}`}>{fullCount}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Team size</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{event.teamSize ?? 1}</p>
          </div>
        </div>

        {/* Teams list */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {teams.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <UsersRound className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No teams registered yet</p>
            </div>
          ) : (
            teams.map((team) => {
              const maxSize = event.teamSize ?? team.size ?? 1;
              const fillPct = Math.round((team.members.length / maxSize) * 100);
              const isFull  = team.members.length >= maxSize;
              return (
                <div key={team._id} className="bg-white border border-slate-100 border-l-4 border-l-indigo-300 rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                    {team.leader[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{team.leader}</p>
                    <p className="text-xs text-slate-400">
                      {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? "bg-emerald-500" : "bg-indigo-500"}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">{team.members.length}/{maxSize}</span>
                  </div>
                  {isFull && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                      Full
                    </span>
                  )}
                </div>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                {(page - 1) * limit + 1}â€“{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/event-manager/${eventId}/teams?page=${page - 1}`}>â† Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>â† Prev</Button>
                )}
                <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/event-manager/${eventId}/teams?page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
