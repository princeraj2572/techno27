import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Event } from "@/models/event.model";
import { Invitation } from "@/models/invitation.model";
import { getUser } from "@/actions/user-actions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await connectToDatabase();

  const user = await User.findById(id).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const u = user as typeof user & { email: string; teams?: unknown[] };

  // Fetch teams where this user is a member
  const teams = await Team.find({ members: u.email }).lean();

  // Populate each team with event name and member details
  const populatedTeams = await Promise.all(
    teams.map(async (team) => {
      const event = await Event.findById(team.event).select("name status category").lean();
      const memberUsers = await User.find({ email: { $in: team.members } })
        .select("fullName email role")
        .lean();
      const pendingInvites = await Invitation.find({ teamId: team._id, status: "PENDING" })
        .select("inviteeEmail")
        .lean();
      return { ...team, event, memberUsers, pendingInvites };
    }),
  );

  // Registered events (unique events via teams)
  const eventIds = [...new Set(teams.map((t) => String(t.event)))];
  const events = await Event.find({ _id: { $in: eventIds } })
    .select("name status category teamSize maxParticipants prizeMoney")
    .lean();

  // Attach team info to each event
  const eventsWithTeam = events.map((ev) => {
    const team = teams.find((t) => String(t.event) === String(ev._id));
    return { ...ev, team: team ? { _id: team._id, leader: team.leader, size: team.size } : null };
  });

  return NextResponse.json({
    user: JSON.parse(JSON.stringify(user)),
    teams: JSON.parse(JSON.stringify(populatedTeams)),
    events: JSON.parse(JSON.stringify(eventsWithTeam)),
  });
}
