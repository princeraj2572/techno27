"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ITeam, Team } from "@/features/teams/team.model";
import { Event, IEvent } from "@/features/events/event.model";
import { User } from "@/features/users/user.model";
import { IInvitation, Invitation } from "@/features/teams/invitation.model";
import { getUser } from "@/features/users/user-actions";

export async function getCurrentUserEmailAction(): Promise<string> {
  await connectToDatabase();
  const user = await getUser();
  return user?.email ?? "";
}

export async function getTeamDetailsAction(teamId: string) {
  await connectToDatabase();

  const team = await Team.findById(teamId);
  if (!team) throw new Error(`Team with ID ${teamId} not found`);

  const event = await Event.findById(team.event);
  if (!event) throw new Error(`Event with ID ${team.event} not found`);

  const members = await User.find({ email: { $in: team.members } });
  const invites = await Invitation.find({ teamId: team._id });

  return JSON.parse(JSON.stringify({ team, event, members, invites }));
}

export async function getParticipatingTeams() {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const teams = await Team.find({ members: user.email }).lean<ITeam[]>();

  const populatedTeams = await Promise.all(
    teams.map(async (team) => {
      const leaderUser = await User.findOne({ email: team.leader })
        .select("fullName email role")
        .lean<{ fullName: string; email: string; role: string }>();
      const event = await Event.findById(team.event)
        .select("name")
        .lean<{ name: string }>();
      const members = await User.find({ email: { $in: team.members } })
        .select("fullName email role")
        .lean<{ fullName: string; email: string; role: string }[]>();
      const individualSchema = team.members.length === 1 && leaderUser?.role === "EXTERNAL_USER";
      const pendingInvites = await Invitation.find({ teamId: team._id, status: "PENDING" })
        .select("_id inviteeEmail")
        .lean<{ _id: string; inviteeEmail: string }[]>();
      // Keep team.leader as the raw email string (do NOT overwrite with leaderUser object)
      return { ...team, members, leaderUser, event, individualSchema, pendingInvites };
    }),
  );

  return JSON.parse(JSON.stringify(populatedTeams));
}

export async function getInvitedTeams() {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const invites = await Invitation.find({ inviteeEmail: user.email }).lean<IInvitation[]>();

  const populatedInvites = await Promise.all(
    invites.map(async (invite) => {
      const team = await Team.findById(invite.teamId).lean<ITeam>();
      const members = await User.find({ email: { $in: team?.members } }).select("fullName email");
      const leader = await User.findOne({ email: team?.leader }).select("fullName email");
      const event = await Event.findById(team?.event).lean<IEvent>();
      return {
        ...invite,
        team: { ...team, members, leader, event },
      };
    }),
  );

  return JSON.parse(JSON.stringify(populatedInvites));
}

export async function checkUserExistsAction(email: string): Promise<{ exists: boolean; fullName?: string }> {
  await connectToDatabase();
  const found = await User.findOne({ email: email.toLowerCase().trim() }).select("fullName").lean<{ fullName: string }>();
  return found ? { exists: true, fullName: found.fullName } : { exists: false };
}

export async function removeTeamMemberAction(teamId: string, memberEmail: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");
  if (team.leader !== user.email) throw new Error("Only the team leader can remove members");
  if (memberEmail === team.leader) throw new Error("Cannot remove the team leader");
  if (!team.members.includes(memberEmail)) throw new Error("User is not a member of this team");

  team.members = team.members.filter((m: string) => m !== memberEmail);
  await team.save();

  await User.updateOne({ email: memberEmail }, { $pull: { teams: team._id } });

  return { success: true };
}

export async function leaveTeamAction(teamId: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");
  if (team.leader === user.email) throw new Error("Leader cannot leave — delete the team instead");
  if (!team.members.includes(user.email)) throw new Error("You are not a member of this team");

  team.members = team.members.filter((m: string) => m !== user.email);
  await team.save();

  await User.updateOne({ email: user.email }, { $pull: { teams: team._id } });

  return { success: true };
}

export async function deleteTeamAction(teamId: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const team = await Team.findById(teamId);
  if (!team) throw new Error(`Team with ID ${teamId} not found`);

  if (team.leader !== user.email) {
    throw new Error("Only the team leader can delete teams");
  }

  await User.updateMany({ email: { $in: team.members } }, { $pull: { teams: teamId } });
  await Invitation.deleteMany({ teamId });
  await Team.findByIdAndDelete(teamId);

  return JSON.parse(JSON.stringify({ success: true, deletedTeamId: teamId }));
}
