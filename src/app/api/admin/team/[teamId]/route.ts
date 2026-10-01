import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { Invitation } from "@/models/invitation.model";
import { getUser } from "@/actions/user-actions";

// DELETE /api/admin/team/[teamId] — delete a team (admin-privileged)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { teamId } = await params;
  await connectToDatabase();

  const team = await Team.findById(teamId);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  // Remove team from all members' teams arrays
  await User.updateMany(
    { email: { $in: team.members } },
    { $pull: { teams: team._id } },
  );

  // Cancel pending invitations
  await Invitation.updateMany({ teamId: team._id, status: "PENDING" }, { status: "CANCELED" });

  await Team.findByIdAndDelete(teamId);

  return NextResponse.json({ success: true });
}

// PATCH /api/admin/team/[teamId] — remove a member from a team (admin-privileged)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { teamId } = await params;
  const { memberEmail } = await req.json();
  if (!memberEmail) return NextResponse.json({ error: "memberEmail is required" }, { status: 400 });

  await connectToDatabase();

  const team = await Team.findById(teamId);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (team.leader === memberEmail.toLowerCase()) {
    return NextResponse.json({ error: "Cannot remove the team leader" }, { status: 400 });
  }

  await Team.findByIdAndUpdate(teamId, {
    $pull: { members: memberEmail.toLowerCase() },
    $inc: { size: -1 },
  });

  await User.findOneAndUpdate(
    { email: memberEmail.toLowerCase() },
    { $pull: { teams: team._id } },
  );

  return NextResponse.json({ success: true });
}

// POST /api/admin/team/[teamId] — send invite from a team (admin-privileged)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { teamId } = await params;
  const { inviteeEmail } = await req.json();
  if (!inviteeEmail) return NextResponse.json({ error: "inviteeEmail is required" }, { status: 400 });

  await connectToDatabase();

  const team = await Team.findById(teamId);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const invitee = await User.findOne({ email: inviteeEmail.toLowerCase() });
  if (!invitee) return NextResponse.json({ error: "Invitee user not found" }, { status: 404 });

  if (team.members.includes(inviteeEmail.toLowerCase())) {
    return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
  }

  const existing = await Invitation.findOne({
    teamId: team._id,
    inviteeEmail: inviteeEmail.toLowerCase(),
    status: "PENDING",
  });
  if (existing) return NextResponse.json({ error: "Invitation already sent" }, { status: 400 });

  const invitation = await Invitation.create({
    teamId: team._id,
    inviterEmail: team.leader,
    inviteeEmail: inviteeEmail.toLowerCase(),
    status: "PENDING",
  });

  await Team.findByIdAndUpdate(teamId, { $addToSet: { invites: invitation._id } });

  return NextResponse.json({ success: true, invitation: JSON.parse(JSON.stringify(invitation)) });
}
