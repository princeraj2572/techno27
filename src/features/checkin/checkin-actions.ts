"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { CheckIn } from "@/features/checkin/checkIn.model";
import { Team } from "@/features/teams/team.model";
import { User, IUser } from "@/features/users/user.model";
import mongoose from "mongoose";
import { getUser } from "@/features/users/user-actions";
import { ManagementAssignment } from "@/features/management/managementAssignment.model";

/** Only admins, or an event manager assigned to this event, may check people in. Returns the caller's id. */
async function requireCheckinAccess(eventId: string): Promise<string | null> {
  const me = await getUser();
  if (!me || !mongoose.Types.ObjectId.isValid(eventId)) return null;
  if (["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(me.role)) return String(me._id);
  if (me.role === "EVENT_MANAGER" && (await ManagementAssignment.exists({ userId: me._id, eventIds: eventId, isActive: true }))) {
    return String(me._id);
  }
  return null;
}

export interface CheckInResult {
  success: boolean;
  alreadyCheckedIn?: boolean;
  checkedInAt?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    enrollmentNumber?: string;
    participantId?: string;
    profilePhotoUrl?: string;
    department?: string;
    collegeName?: string;
  };
  error?: string;
}

export async function checkInByQRAction(
  scannedUserId: string,
  eventId: string,
): Promise<CheckInResult> {
  await connectToDatabase();
  const checkedInById = await requireCheckinAccess(eventId);
  if (!checkedInById) return { success: false, error: "You can't check people in for this event." };

  if (!mongoose.Types.ObjectId.isValid(scannedUserId)) {
    return { success: false, error: "Invalid QR code" };
  }

  const participant = await User.findById(scannedUserId)
    .select("fullName email role enrollmentNumber participantId profilePhotoUrl department collegeName")
    .lean<IUser>();

  if (!participant) {
    return { success: false, error: "Participant not found" };
  }

  // Verify registered for this event
  const isRegistered = await Team.exists({
    event: eventId,
    $or: [
      { leader: participant.email },
      { members: participant.email },
    ],
  });
  if (!isRegistered) {
    return { success: false, error: `${participant.fullName} is not registered for this event` };
  }

  // Check for duplicate
  const existing = await CheckIn.findOne({ userId: scannedUserId, eventId }).lean();
  if (existing) {
    return {
      success: false,
      alreadyCheckedIn: true,
      checkedInAt: (existing as { checkedInAt: Date }).checkedInAt.toISOString(),
      user: JSON.parse(JSON.stringify(participant)),
      error: "Already checked in",
    };
  }

  await CheckIn.create({
    userId: scannedUserId,
    eventId,
    checkedInBy: checkedInById,
    method: "QR",
  });

  return { success: true, user: JSON.parse(JSON.stringify(participant)) };
}

export async function checkInManualAction(
  participantUserId: string,
  eventId: string,
): Promise<CheckInResult> {
  await connectToDatabase();
  const checkedInById = await requireCheckinAccess(eventId);
  if (!checkedInById) return { success: false, error: "You can't check people in for this event." };
  if (!mongoose.Types.ObjectId.isValid(participantUserId)) return { success: false, error: "Participant not found" };

  const participant = await User.findById(participantUserId).select("email").lean<IUser>();
  if (!participant) return { success: false, error: "Participant not found" };
  if (!(await Team.exists({ event: eventId, $or: [{ leader: participant.email }, { members: participant.email }] }))) {
    return { success: false, error: "Not registered for this event" };
  }

  const existing = await CheckIn.findOne({ userId: participantUserId, eventId }).lean();
  if (existing) {
    return {
      success: false,
      alreadyCheckedIn: true,
      checkedInAt: (existing as { checkedInAt: Date }).checkedInAt.toISOString(),
      error: "Already checked in",
    };
  }

  await CheckIn.create({
    userId: participantUserId,
    eventId,
    checkedInBy: checkedInById,
    method: "MANUAL",
  });

  return { success: true };
}
