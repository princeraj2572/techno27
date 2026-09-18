export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventManagerPermissions } from "@/actions/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";

async function getData(eventId: string) {
  await connectToDatabase();

  const event = await Event.findById(eventId).select("name status teamSize maxParticipants").lean();
  if (!event) return null;

  const teams = await Team.find({ event: eventId }).sort({ createdAt: -1 }).lean();

  const allEmails = [...new Set(
    teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members])
  )];
  const users = await User.find({ email: { $in: allEmails } })
    .select("email fullName role enrollmentNumber participantId collegeName mobileNumber")
    .lean();
  const userMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string }) => [u.email, u])
  );

  return {
    event: JSON.parse(JSON.stringify(event)) as { _id: string; name: string; status: string; teamSize?: number; maxParticipants?: number },
    teams: JSON.parse(JSON.stringify(teams)).map((t: { _id: string; leader: string; members: string[] }) => ({
      ...t,
      leaderUser: userMap[t.leader] ?? null,
      memberUsers: t.members.map((m: string) => userMap[m] ?? { email: m }),
    })),
  };
}

export default async function EventManagerParticipantsPage({
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

  const { event, teams } = data;

  type MemberUser = { email: string; fullName?: string; role?: string; enrollmentNumber?: string; participantId?: string };
  type TeamRow = { _id: string; leader: string; members: string[]; leaderUser: MemberUser | null; memberUsers: MemberUser[] };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href={`/event-manager/${eventId}`} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> {event.name}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Participants</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {teams.length} team(s) · {teams.reduce((s: number, t: TeamRow) => s + t.members.length, 0)} total members
              {event.maxParticipants ? ` · Limit: ${event.maxParticipants}` : ""}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
        </div>

        {/* Teams list */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {teams.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No teams registered yet</p>
            </div>
          ) : (
            (teams as TeamRow[]).map((team, idx) => (
              <div key={team._id} className="bg-white border border-slate-100 border-l-4 border-l-indigo-300 rounded-xl px-4 py-4">
                {/* Team header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-400">Leader</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{team.leaderUser?.fullName ?? team.leader}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                        team.leaderUser?.role === "EXTERNAL_USER"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}>
                        {team.leaderUser?.role === "EXTERNAL_USER" ? "External" : "OPJU"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{team.leader}</p>
                    {(team.leaderUser?.enrollmentNumber ?? team.leaderUser?.participantId) && (
                      <code className="text-[10px] font-mono text-slate-400">
                        {team.leaderUser.enrollmentNumber ?? team.leaderUser.participantId}
                      </code>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{team.members.length} member(s)</span>
                </div>

                {/* Members */}
                {team.members.length > 0 && (
                  <div className="pl-9 space-y-1.5">
                    {team.memberUsers.map((m: MemberUser) => (
                      <div key={m.email} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          m.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {(m.fullName ?? m.email)[0]?.toUpperCase()}
                        </div>
                        <p className="text-xs text-slate-700">{m.fullName ?? m.email}</p>
                        {(m.enrollmentNumber ?? m.participantId) && (
                          <code className="text-[10px] font-mono text-slate-400">{m.enrollmentNumber ?? m.participantId}</code>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
