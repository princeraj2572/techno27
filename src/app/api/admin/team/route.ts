import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/features/teams/team.model";
import { Event } from "@/features/events/event.model";
import { User } from "@/features/users/user.model";
import { getUser } from "@/features/users/user-actions";

// POST /api/admin/team — create a team for a user (admin-privileged)
export async function POST(req: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { leaderEmail, eventId } = await req.json();
  if (!leaderEmail || !eventId) {
    return NextResponse.json({ error: "leaderEmail and eventId are required" }, { status: 400 });
  }

  await connectToDatabase();

  const event = await Event.findById(eventId);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (event.status !== "REGISTRATION_OPEN") {
    return NextResponse.json({ error: "Registration is not open for this event" }, { status: 400 });
  }

  const leader = await User.findOne({ email: leaderEmail.toLowerCase() });
  if (!leader) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check if already registered
  const existing = await Team.findOne({ event: eventId, members: leaderEmail.toLowerCase() });
  if (existing) return NextResponse.json({ error: "User is already registered for this event" }, { status: 400 });

  const team = await Team.create({
    leader: leaderEmail.toLowerCase(),
    members: [leaderEmail.toLowerCase()],
    event: eventId,
    size: 1,
    invites: [],
  });

  // Add team to user's teams array
  await User.findByIdAndUpdate(leader._id, { $addToSet: { teams: team._id } });

  return NextResponse.json({ success: true, team: JSON.parse(JSON.stringify(team)) });
}
