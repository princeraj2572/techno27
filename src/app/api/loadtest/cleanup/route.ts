import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Invitation } from "@/models/invitation.model";
import { CheckIn } from "@/models/checkIn.model";
import { Accommodation } from "@/models/accommodation.model";
import { Transaction } from "@/models/transaction.model";
import { Event } from "@/models/event.model";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

const LOADTEST_EMAIL_RE = /^loadtest-/;
const LOADTEST_EVENT_NAME_RE = /^Load Test/;

// Deletes everything team-flow.js creates: synthetic loadtest-* users, the
// teams/invites/check-ins they touched, and the seeded "Load Test Event".
// Leaves real users/events untouched.
export async function POST() {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    await connectToDatabase();

    const loadtestUsers = await User.find({ email: LOADTEST_EMAIL_RE })
      .select("_id email")
      .lean<{ _id: unknown; email: string }[]>();
    const loadtestEmails = loadtestUsers.map((u) => u.email);
    const loadtestUserIds = loadtestUsers.map((u) => u._id);

    const loadtestTeams = await Team.find({
      $or: [
        { leader: { $in: loadtestEmails } },
        { members: { $in: loadtestEmails } },
      ],
    })
      .select("_id")
      .lean<{ _id: unknown }[]>();
    const teamIds = loadtestTeams.map((t) => t._id);

    const [checkIns, invitations, teams, accommodations, transactions, users] = await Promise.all([
      CheckIn.deleteMany({ userId: { $in: loadtestUserIds } }),
      Invitation.deleteMany({
        $or: [{ teamId: { $in: teamIds } }, { inviteeEmail: { $in: loadtestEmails } }],
      }),
      Team.deleteMany({ _id: { $in: teamIds } }),
      Accommodation.deleteMany({ userId: { $in: loadtestUserIds } }),
      Transaction.deleteMany({ userEmail: { $in: loadtestEmails } }),
      User.deleteMany({ email: LOADTEST_EMAIL_RE }),
    ]);

    const events = await Event.deleteMany({ name: LOADTEST_EVENT_NAME_RE });

    return NextResponse.json({
      success: true,
      deleted: {
        users: users.deletedCount,
        teams: teams.deletedCount,
        invitations: invitations.deletedCount,
        checkIns: checkIns.deletedCount,
        accommodations: accommodations.deletedCount,
        transactions: transactions.deletedCount,
        loadTestEvents: events.deletedCount,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
