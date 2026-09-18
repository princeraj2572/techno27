"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { CheckIn } from "@/models/checkIn.model";
import { Team } from "@/models/team.model";
import { User, IUser } from "@/models/user.model";
import mongoose from "mongoose";

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
  checkedInById: string,
): Promise<CheckInResult> {
  await connectToDatabase();

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
  checkedInById: string,
): Promise<CheckInResult> {
  await connectToDatabase();

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
