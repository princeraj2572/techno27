export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getEventManagerPermissions } from "@/features/management/management-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/features/events/event.model";
import { Team } from "@/features/teams/team.model";
import { User } from "@/features/users/user.model";
import { CheckIn } from "@/features/checkin/checkIn.model";
import { ChevronLeft, CheckSquare } from "lucide-react";
import Link from "next/link";
import CheckinClient from "./CheckinClient";

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
    JSON.parse(JSON.stringify(checkIns)).map((c: { userId: string }) => String(c.userId))
  );

  return {
    event: JSON.parse(JSON.stringify(event)) as { _id: string; name: string; status: string },
    participants: JSON.parse(JSON.stringify(users)).map((u: {
      _id: string; email: string; fullName?: string; role?: string;
      enrollmentNumber?: string; participantId?: string;
    }) => ({
      ...u,
      checkedIn: checkedInIds.has(String(u._id)),
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
  const checkedInById = String(user._id ?? "");

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

        <CheckinClient
          eventId={eventId}
          checkedInById={checkedInById}
          initialParticipants={participants}
          totalRegistered={participants.length}
          initialCheckedInCount={checkedInCount}
        />

      </div>
    </div>
  );
}
