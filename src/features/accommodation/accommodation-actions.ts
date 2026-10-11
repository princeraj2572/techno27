"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation, IAccommodation } from "@/features/accommodation/accommodation.model";
import { IUser, User } from "@/features/users/user.model";
import { ITeam, Team } from "@/features/teams/team.model";
import { getUser } from "@/features/users/user-actions";

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

export async function getAccommodationCounts() {
  await connectToDatabase();
  const [total, male, female, other] = await Promise.all([
    Accommodation.countDocuments(),
    Accommodation.countDocuments({ gender: "Male" }),
    Accommodation.countDocuments({ gender: "Female" }),
    Accommodation.countDocuments({ gender: "Other" }),
  ]);
  return { total, male, female, other };
}

// Paginated per gender tab so grouped rooming blocks (same groupName) never
// split across pages within the tab being viewed.
export async function getAccommodationsByGender(
  gender: "Male" | "Female" | "Other",
  page: number = 1,
  limit: number = 25,
): Promise<{ rows: AccommodationWithUser[]; total: number }> {
  await connectToDatabase();
  const total = await Accommodation.countDocuments({ gender });
  const accommodations = await Accommodation.find({ gender })
    .sort({ groupName: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean<IAccommodation[]>();

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

  return JSON.parse(JSON.stringify({ rows: results.filter(Boolean), total }));
}
