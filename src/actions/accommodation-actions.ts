"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation, IAccommodation } from "@/models/accommodation.model";
import { IUser, User } from "@/models/user.model";
import { ITeam, Team } from "@/models/team.model";
import { getUser } from "./user-actions";

interface AccommodationDetails {
  arrivalTime: Date;
  departureTime: Date;
  additionalDetails?: string;
  universityName: string;
  gender: "Male" | "Female" | "Other";
  groupName?: string;
}

export async function getAccommodationDetailsAction(): Promise<IAccommodation | null> {
  await connectToDatabase();
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const accommodation = await Accommodation.findOne({ userId: user._id }).lean<IAccommodation>();
  return JSON.parse(JSON.stringify(accommodation));
}

export async function setAccommodationDetailsAction(
  details: AccommodationDetails,
): Promise<IAccommodation> {
  await connectToDatabase();
  const user = await getUser();
  if (!user) throw new Error("User not found");

  let accommodation = await Accommodation.findOne({ userId: user._id });
  if (accommodation) {
    accommodation.arrivalTime = details.arrivalTime;
    accommodation.departureTime = details.departureTime;
    accommodation.additionalDetails = details.additionalDetails;
    accommodation.universityName = details.universityName;
    accommodation.gender = details.gender;
    await accommodation.save();
  } else {
    accommodation = new Accommodation({ ...details, userId: user._id });
    await accommodation.save();
  }
  return JSON.parse(JSON.stringify(accommodation));
}

interface AccommodationWithUser {
  user: IUser;
  accommodation: IAccommodation;
  leaders: string[];
}

export async function getAllAccommodationsWithUsers(): Promise<AccommodationWithUser[]> {
  await connectToDatabase();
  const accommodations = await Accommodation.find().lean<IAccommodation[]>();
  const userIds = accommodations.map((a) => a.userId);
  const users = await User.find({ _id: { $in: userIds } }).lean<IUser[]>();

  const results = await Promise.all(
    accommodations.map(async (accommodation) => {
      const user = users.find(
        (u) => u._id.toString() === accommodation.userId.toString(),
      );
      if (!user) return null;

      const teams = await Team.find({ members: user.email }).lean<ITeam[]>();
      const leaders = Array.from(new Set(teams.map((t) => t.leader).filter(Boolean)));

      return { user, accommodation, leaders };
    }),
  );

  return JSON.parse(JSON.stringify(results.filter(Boolean)));
}
