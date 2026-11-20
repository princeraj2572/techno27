import { connectToDatabase } from "@/lib/mongodb";
import { IUser, User } from "@/features/users/user.model";
import { generateParticipantId } from "@/lib/server-utils";

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  program: string;
  branch: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
  // INTERNAL_USER
  enrollmentNumber?: string;
  semester?: string;
  section?: string;
  dayScholarOrHosteller?: "Day Scholar" | "Hosteller";
  // EXTERNAL_USER
  collegeName?: string;
  city?: string;
  state?: string;
  accommodationNeeded?: boolean;
}

// Server-only: no OTP check. Callers: userSignup (after OTP) and the gated loadtest route.
export const createUser = async (data: SignupData): Promise<IUser> => {
  await connectToDatabase();

  const normalizedEmail = data.email.toLowerCase().trim();
  const isInternal = normalizedEmail.endsWith("@opju.ac.in");
  const role = isInternal ? "INTERNAL_USER" : "EXTERNAL_USER";

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("User already exists with this email");

  const participantId = !isInternal ? await generateParticipantId() : undefined;

  const newUser = new User({
    ...data,
    email: normalizedEmail,
    role,
    isOutsider: !isInternal,
    isAdmin: false,
    ...(participantId ? { participantId } : {}),
  });

  await newUser.save();
  return JSON.parse(JSON.stringify(newUser));
};
