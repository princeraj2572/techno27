"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Invitation } from "@/models/invitation.model";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { getUser } from "./user-actions";
import { getParticipatingEventsCountAction } from "./event-actions";

export async function sendTeamInviteAction({
  teamId,
  inviteeEmail,
}: {
  teamId: string;
  inviteeEmail: string;
}) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const team = await Team.findById(teamId);
  if (!team) throw new Error(`Team with ID ${teamId} not found`);
  if (team.leader !== user.email) throw new Error("Only the team leader can send invites");
  if (team.members.length >= team.size) throw new Error("Team is already full");

  const newInvite = new Invitation({
    teamId: team._id,
    inviterEmail: user.email,
    inviteeEmail,
    status: "PENDING",
  });
  const savedInvite = await newInvite.save();

  team.invites.push(savedInvite._id);
  await team.save();

  return JSON.parse(JSON.stringify({ success: true, invite: savedInvite }));
}

export async function cancelInviteAction(inviteId: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const invite = await Invitation.findById(inviteId);
  if (!invite) throw new Error(`Invite with ID ${inviteId} not found`);

  const team = await Team.findById(invite.teamId);
  if (!team) throw new Error(`Team with ID ${invite.teamId} not found`);

  if (team.leader !== user.email) {
    throw new Error("Only the team leader can cancel invites");
  }

  invite.status = "CANCELED";
  await invite.save();

  return { success: true };
}

export async function acceptInviteAction(inviteId: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const invite = await Invitation.findById(inviteId);
  if (!invite) throw new Error(`Invite with ID ${inviteId} not found`);

  if (invite.inviteeEmail !== user.email) {
    throw new Error("You are not the recipient of this invite");
  }

  const team = await Team.findById(invite.teamId);
  if (!team) throw new Error(`Team with ID ${invite.teamId} not found`);

  if (team.members.includes(invite.inviteeEmail)) {
    throw new Error("Invitee is already a member of the team");
  }

  const inviteeUser = await User.findOne({ email: invite.inviteeEmail });
  if (!inviteeUser) throw new Error(`Invitee with email ${invite.inviteeEmail} not found`);

  const userEvents = await Promise.all(
    inviteeUser.teams.map(async (teamId: string) => {
      const t = await Team.findById(teamId);
      return t?.event.toString();
    }),
  );

  if (userEvents.some((event) => event === team.event.toString())) {
    throw new Error("You have already registered for this event.");
  }

  const mainEventsCount = await getParticipatingEventsCountAction(
    userEvents.filter(Boolean) as string[],
    team.event.toString(),
  );

  if (
    inviteeUser.role === "EXTERNAL_USER" &&
    (mainEventsCount.eventCount > 7 ||
      (mainEventsCount.eventCount === 7 && !mainEventsCount.isNewEventIncluded))
  ) {
    throw new Error("External participants cannot register for more than 7 events.");
  }

  team.members.push(invite.inviteeEmail);
  await team.save();

  inviteeUser.teams = [...inviteeUser.teams, team._id];
  await inviteeUser.save();

  invite.status = "ACCEPTED";
  await invite.save();

  return { success: true };
}

export async function rejectInviteAction(inviteId: string) {
  await connectToDatabase();

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const invite = await Invitation.findById(inviteId);
  if (!invite) throw new Error(`Invite with ID ${inviteId} not found`);

  if (invite.inviteeEmail !== user.email) {
    throw new Error("You are not the recipient of this invite");
  }

  invite.status = "REJECTED";
  await invite.save();

  return { success: true };
}
