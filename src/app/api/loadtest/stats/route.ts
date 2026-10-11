import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import { Team } from "@/features/teams/team.model";
import { CheckIn } from "@/features/checkin/checkIn.model";
import { Invitation } from "@/features/teams/invitation.model";
import { Accommodation } from "@/features/accommodation/accommodation.model";
import { Transaction } from "@/features/payments/transaction.model";
import { Event } from "@/features/events/event.model";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

const LOADTEST_EMAIL_RE = /^loadtest-/;

// Read-only snapshot of everything team-flow.js has created so far, without
// touching any data — use this to see final capacity numbers when the run
// is left uncleaned for inspection.
export async function GET() {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    await connectToDatabase();

    const loadtestUsers = await User.find({ email: LOADTEST_EMAIL_RE }).select("_id role").lean();
    const userIds = loadtestUsers.map((u) => u._id);
    const internalCount = loadtestUsers.filter((u) => u.role === "INTERNAL_USER").length;
    const externalCount = loadtestUsers.filter((u) => u.role === "EXTERNAL_USER").length;

    const [
      totalTeams,
      totalCheckIns,
      totalInvitations,
      acceptedInvitations,
      totalAccommodations,
      totalTransactions,
      events,
    ] = await Promise.all([
      Team.countDocuments({ leader: { $regex: /^loadtest-/ } }),
      CheckIn.countDocuments({ userId: { $in: userIds } }),
      Invitation.countDocuments({ inviteeEmail: { $regex: /^loadtest-/ } }),
      Invitation.countDocuments({ inviteeEmail: { $regex: /^loadtest-/ }, status: "ACCEPTED" }),
      Accommodation.countDocuments({ userId: { $in: userIds } }),
      Transaction.countDocuments({ userEmail: { $regex: /^loadtest-/ } }),
      Event.find({ name: { $regex: /^Load Test/ } }).select("name status maxParticipants teamSize").lean(),
    ]);

    const teamsPerEvent = await Promise.all(
      events.map(async (e) => ({
        name: e.name,
        maxParticipants: e.maxParticipants ?? null,
        teams: await Team.countDocuments({ event: e._id }),
      })),
    );

    return NextResponse.json({
      success: true,
      users: { total: loadtestUsers.length, internal: internalCount, external: externalCount },
      teams: totalTeams,
      checkIns: totalCheckIns,
      invitations: { total: totalInvitations, accepted: acceptedInvitations },
      accommodations: totalAccommodations,
      transactions: totalTransactions,
      teamsPerEvent,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
